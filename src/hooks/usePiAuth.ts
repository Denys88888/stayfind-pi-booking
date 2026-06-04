import { useState, useCallback, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Pi Network SDK Types (from official docs)                           */
/* ------------------------------------------------------------------ */

export interface PiUser {
  uid: string;
  username: string;
  accessToken?: string;
}

/** PaymentDTO from Pi SDK — represents a payment object */
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

/** Detect if running inside Pi Browser */
export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  // Pi Browser sets navigator.userAgent containing 'PiBrowser' or similar
  const ua = navigator.userAgent || '';
  return ua.includes('PiBrowser') || ua.includes('Pi Browser') || !!window.Pi;
}

/** Detect if Pi SDK is available */
export function isPiSdkAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.Pi;
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
        // Pi SDK loaded (Pi Browser or script loaded)
        setIsReady(true);
      } else if (!checkedRef.current) {
        checkedRef.current = true;
        // Give SDK a short window, then fall back to sandbox
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
   */
  const handleIncompletePayment = useCallback((payment: PaymentDTO) => {
    console.warn('[PiAuth] Incomplete payment found:', payment);
    setIncompletePayment(payment);
    // Auto-complete incomplete payments for testnet (mock server-side)
    if (payment.transaction?.txid) {
      console.log('[PiAuth] Auto-completing payment with txid:', payment.transaction.txid);
      // In production: send to your backend to call /complete
      // For testnet: we mock the completion
      completePayment(payment.identifier, payment.transaction.txid);
    }
  }, []);

  const authenticate = useCallback(
    async (scopes: AuthScope[] = ['username']): Promise<PiUser | null> => {
      /* ── Sandbox mode: no Pi SDK ── */
      if (!window.Pi) {
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
        // Pi.init is already called in index.html — no need to call again
        const authResult = await window.Pi.authenticate(
          scopes,
          handleIncompletePayment
        );

        if (authResult?.user) {
          const userWithToken: PiUser = {
            uid: authResult.user.uid,
            username: authResult.user.username,
            accessToken: authResult.accessToken,
          };
          setUser(userWithToken);
          setIsSandbox(false);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithToken));
          return userWithToken;
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
/* ------------------------------------------------------------------ */

/**
 * Mock server-side payment approval.
 * In production: your backend calls POST /payments/{id}/approve with Server API Key.
 * For Testnet: we simulate the approval on the frontend.
 */
export async function approvePayment(paymentId: string): Promise<boolean> {
  console.log('[PiServer] Approving payment:', paymentId);
  // Production: const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
  //   method: 'POST', headers: { 'Authorization': `Key ${PI_API_KEY}` }
  // });
  // Testnet: auto-approve
  return true;
}

/**
 * Mock server-side payment completion.
 * In production: your backend calls POST /payments/{id}/complete with { txid }.
 * For Testnet: we simulate the completion.
 */
export async function completePayment(paymentId: string, txid: string): Promise<boolean> {
  console.log('[PiServer] Completing payment:', paymentId, 'txid:', txid);
  // Production: const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
  //   method: 'POST', headers: { 'Authorization': `Key ${PI_API_KEY}` },
  //   body: JSON.stringify({ txid })
  // });
  // Testnet: auto-complete
  return true;
}
