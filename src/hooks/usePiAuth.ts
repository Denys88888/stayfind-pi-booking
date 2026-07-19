import { useState, useCallback, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Pi Network SDK Types (from official docs:                           */
/*  https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md) */
/* ------------------------------------------------------------------ */

export interface PiUser {
  uid: string;
      // App-local identifier (from /me)
  username: string;   // Pi username (scope: username)
  accessToken: string;
  wallet_address?: string; // Pi wallet address (scope: wallet_address)
}

/** PaymentDTO — represents a payment object from Pi SDK */
export interface PaymentDTO {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  from_address: string;
  to_address: string;
  direction: 'user_to_app' | 'app_to_user';
  created_at: string;
  network: 'Pi Network' | 'Pi Testnet';
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

type AuthScope = 'username' | 'payments' | 'wallet_address';

interface AuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

/** UserDTO from Platform API /me endpoint */
interface MeResponse {
  uid: string;
  credentials: {
    scopes: AuthScope[];
    valid_until: { timestamp: number; iso8601: string };
  };
  username?: string;
  wallet_address?: string;
}

/* ------------------------------------------------------------------ */
/*  Window.Pi declaration                                               */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (
        scopes: AuthScope[],
        onIncompletePaymentFound: (payment: PaymentDTO) => void
      ) => Promise<AuthResult>;
      createPayment: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Record<string, unknown>;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: PaymentDTO) => void;
        }
      ) => void;
      nativeFeaturesList: () => Promise<string[]>;
      openShareDialog: (title: string, message: string) => void;
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Pi Browser Detection                                                */
/* ------------------------------------------------------------------ */

/** Detect if running inside Pi Browser.
 *  UA-only: the SDK script loads in ANY browser, so window.Pi presence
 *  does NOT mean Pi Browser — Pi.authenticate hangs forever outside it. */
export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return ua.includes('PiBrowser') || ua.includes('Pi Browser');
}

/** Detect if Pi SDK is available */
export function isPiSdkAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.Pi;
}

/* ------------------------------------------------------------------ */
/*  User Verification via /me endpoint                                  */
/*  Per Pi docs: https://github.com/pi-apps/pi-platform-docs/blob/master/authentication.md */
/*  "You can verify the user's identity by requesting the /me endpoint */
/*   from your backend, using the access token obtained with this method." */
/* ------------------------------------------------------------------ */

async function verifyUserWithMeEndpoint(accessToken: string): Promise<MeResponse | null> {
  try {
    const res = await fetch('https://api.minepi.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      console.error('[PiAuth] /me verification failed:', res.status);
      return null;
    }
    return await res.json() as MeResponse;
  } catch (err) {
    console.error('[PiAuth] /me network error:', err);
    // For Testnet sandbox: fall through — allow unverified user
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'stayfind_pi_auth';

function loadUserFromStorage(): PiUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.uid && parsed?.username) return parsed as PiUser;
  } catch {
    /* ignore corrupt storage */
  }
  return null;
}

export function usePiAuth() {
  const [user, setUser] = useState<PiUser | null>(loadUserFromStorage);
  const [isReady, setIsReady] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const [incompletePayment, setIncompletePayment] = useState<PaymentDTO | null>(null);
  const checkedRef = useRef(false);

  /* Wait for Pi SDK to be available */
  useEffect(() => {
    let cancelled = false;

    const check = () => {
      if (cancelled) return;

      if (typeof window !== 'undefined' && window.Pi) {
        setIsReady(true);
      } else if (!checkedRef.current) {
        checkedRef.current = true;
        setTimeout(() => {
          if (cancelled) return;
          if (!window.Pi) {
            setIsSandbox(true);
            setIsReady(true);
          } else {
            setIsReady(true);
          }
        }, 1500);
      }
    };

    check();
    return () => { cancelled = true; };
  }, []);

  /**
   * Handle incomplete payment found during authentication.
   * Per Pi docs: must complete this payment before starting a new one.
   * Send to server to call /complete endpoint.
   */
  const handleIncompletePayment = useCallback((payment: PaymentDTO) => {
    console.warn('[PiAuth] Incomplete payment found:', payment);
    setIncompletePayment(payment);

    if (payment.transaction?.txid) {
      console.log('[PiAuth] Auto-completing payment with txid:', payment.transaction.txid);
      // For Testnet: mock server-side completion
      // Production: send to backend → POST /payments/{id}/complete with Server API Key
      completePayment(payment.identifier, payment.transaction.txid);
    }
  }, []);

  const authenticate = useCallback(
    async (scopes: AuthScope[] = ['username']): Promise<PiUser | null> => {
      /* ── Sandbox mode: no Pi SDK, or SDK loaded outside Pi Browser
            (Pi.authenticate never resolves there — would hang the UI) ── */
      if (!window.Pi || !isPiBrowser()) {
        console.warn('[PiAuth] Pi SDK not available — using sandbox mode');
        const mockUser: PiUser = {
          uid: 'sandbox-' + Math.random().toString(36).slice(2, 10),
          username: 'sandbox_user',
          accessToken: 'mock_token_' + Date.now(),
        };
        setUser(mockUser);
        setIsSandbox(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        return mockUser;
      }

      /* ── Real Pi SDK ── */
      try {
        const authResult = await window.Pi.authenticate(
          scopes,
          handleIncompletePayment
        );

        if (authResult?.user) {
          // Step 2: Verify user identity via /me endpoint (per Pi docs)
          const meData = await verifyUserWithMeEndpoint(authResult.accessToken);

          const userData: PiUser = {
            uid: meData?.uid ?? authResult.user.uid,
            username: meData?.username ?? authResult.user.username,
            accessToken: authResult.accessToken,
            wallet_address: meData?.wallet_address,
          };

          setUser(userData);
          setIsSandbox(false);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
          return userData;
        }
      } catch (err) {
        console.error('[PiAuth] Authentication failed:', err);
      }

      return null;
    },
    [handleIncompletePayment]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setIsSandbox(false);
    setIncompletePayment(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isReady,
    isSandbox,
    isPiBrowser: isPiBrowser(),
    authenticate,
    signOut,
    incompletePayment,
    setIncompletePayment,
  };
}

/* ------------------------------------------------------------------ */
/*  Server-Side Payment Helpers (Mock for Testnet)                    */
/*  Production: backend must call Platform API with Server API Key    */
/*  https://github.com/pi-apps/pi-platform-docs/blob/master/platform_API.md */
/* ------------------------------------------------------------------ */

/** Mock server-side approval.
 *  Production: POST /payments/{payment_id}/approve with Server API Key */
export async function approvePayment(paymentId: string): Promise<boolean> {
  console.log('[PiServer] Approving payment:', paymentId);
  return true;
}

/** Mock server-side completion.
 *  Production: POST /payments/{payment_id}/complete with { txid } + Server API Key */
export async function completePayment(paymentId: string, txid: string): Promise<boolean> {
  console.log('[PiServer] Completing payment:', paymentId, 'txid:', txid);
  return true;
}

/** Mock cancel payment.
 *  Production: POST /payments/{payment_id}/cancel with Server API Key */
export async function cancelPayment(paymentId: string): Promise<boolean> {
  console.log('[PiServer] Cancelling payment:', paymentId);
  return true;
}
