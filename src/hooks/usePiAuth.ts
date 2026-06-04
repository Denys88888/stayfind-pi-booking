import { useState, useCallback, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Pi Network Auth types                                               */
/* ------------------------------------------------------------------ */

export interface PiUser {
  uid: string;
  username: string;
  roles: string[];
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

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (
        scopes: AuthScope[],
        onIncompletePaymentFound: (payment: unknown) => void | Promise<void>
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

  /* Wait for the Pi SDK to be injected */
  useEffect(() => {
    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      if (typeof window !== 'undefined' && window.Pi) {
        setIsReady(true);
      } else {
        setTimeout(check, 300);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const authenticate = useCallback(
    async (scopes: AuthScope[] = ['username']): Promise<PiUser | null> => {
      if (!window.Pi) {
        console.warn('[PiAuth] Pi SDK not available');
        return null;
      }

      try {
        await window.Pi.init({ version: '2.0', sandbox: true });

        const authResult = await window.Pi.authenticate(
          scopes,
          (onIncompletePaymentFound: unknown) => {
            console.log(
              '[PiAuth] Incomplete payment found:',
              onIncompletePaymentFound
            );
          }
        );

        if (authResult?.user) {
          setUser(authResult.user);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authResult.user));
          return authResult.user;
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
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isReady,
    authenticate,
    signOut,
  };
}
