import { useState, useCallback, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Pi Network Auth types                                               */
/* ------------------------------------------------------------------ */

export interface PiUser {
  uid: string;
  username: string;
  roles: string[];
  accessToken?: string;
}

interface AuthResult {
  user: PiUser;
  accessToken: string;
}

type AuthScope = 'username' | 'payments' | 'wallet_address';

/* Pi SDK Payment types */
interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  uid: string;
}

interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string, error?: unknown) => void;
  onError: (error: Error, payment?: unknown) => void;
}

/** Incomplete payment passed from the Pi SDK */
export interface IncompletePayment {
  identifier: string;
  amount: number;
  memo: string;
  metadata?: Record<string, unknown>;
  status?: string;
  created_at?: string;
}

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (
        scopes: AuthScope[],
        onIncompletePaymentFound: (payment: IncompletePayment) => void | Promise<void>
      ) => Promise<AuthResult>;
      createPayment: (
        paymentData: PiPaymentData,
        callbacks: PiPaymentCallbacks
      ) => Promise<void>;
    };
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
    if (parsed && parsed.uid && parsed.username) return parsed as PiUser;
  } catch {
    /* ignore corrupt storage */
  }
  return null;
}

export function usePiAuth() {
  const [user, setUser] = useState<PiUser | null>(loadUserFromStorage);
  const [isReady, setIsReady] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const [incompletePayment, setIncompletePayment] = useState<IncompletePayment | null>(null);
  const checkedRef = useRef(false);

  /* Wait for the Pi SDK to be injected — or switch to sandbox */
  useEffect(() => {
    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      if (typeof window !== 'undefined' && window.Pi) {
        setIsReady(true);
      } else if (!checkedRef.current) {
        checkedRef.current = true;
        /* Give the Pi SDK a short window to appear, then go sandbox */
        setTimeout(() => {
          if (cancelled) return;
          if (!window.Pi) {
            setIsSandbox(true);
            setIsReady(true);
          } else {
            setIsReady(true);
          }
        }, 1200);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const authenticate = useCallback(
    async (scopes: AuthScope[] = ['username']): Promise<PiUser | null> => {
      /* ── Sandbox mode: no Pi Browser ── */
      if (!window.Pi) {
        console.warn('[PiAuth] Pi SDK not available — using sandbox mode');
        const mockUser: PiUser = {
          uid: 'sandbox-' + Math.random().toString(36).slice(2, 10),
          username: 'sandbox_user',
          roles: [],
          accessToken: 'mock_token',
        };
        setUser(mockUser);
        setIsSandbox(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        return mockUser;
      }

      /* ── Real Pi SDK ── */
      try {
        await window.Pi.init({ version: '2.0', sandbox: true });

        const authResult = await window.Pi.authenticate(
          scopes,
          (payment: IncompletePayment) => {
            console.log('[PiAuth] Incomplete payment found:', payment);
            setIncompletePayment(payment);
          }
        );

        if (authResult?.user) {
          const userWithToken: PiUser = {
            ...authResult.user,
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
    []
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
    authenticate,
    signOut,
    incompletePayment,
    setIncompletePayment,
  };
}
