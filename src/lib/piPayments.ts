/**
 * Pi Payment Helpers
 * ------------------
 * Pi Network SDK v2.0 integration per official docs:
 * https://github.com/pi-apps/pi-platform-docs
 *
 * Payment Flow (3 phases):
 * Phase 1: Payment creation → Server-Side Approval (/approve)
 * Phase 2: User interaction + blockchain transaction
 * Phase 3: Server-Side Completion (/complete)
 */

// Pi Network realistic market rate: 1 PI ≈ $0.15 USD
const PI_USD_RATE = 0.15;

/** Convert a USD amount to Pi */
export function usdToPi(usdAmount: number): number {
  return Math.round((usdAmount / PI_USD_RATE) * 100) / 100;
}

/** Convert Pi amount back to USD string */
export function piToUsd(piAmount: number): string {
  return `$${(piAmount * PI_USD_RATE).toFixed(2)}`;
}

/** Format a Pi amount for display, e.g. 6.33 π */
export function formatPiAmount(piAmount: number): string {
  return `${piAmount.toFixed(2)} π`;
}

/** Convert Pi to USD for display reference */
export function piToUsdNumber(piAmount: number): number {
  return Math.round(piAmount * PI_USD_RATE * 100) / 100;
}

/* ------------------------------------------------------------------ */
/*  Pi SDK Payment Types (from official docs)                           */
/*                                                                    */
/*  IMPORTANT: Per Pi Network docs, PaymentData ONLY contains:        */
/*    - amount   (number)                                             */
/*    - memo     (string)                                             */
/*    - metadata (object)                                             */
/*                                                                    */
/*  Developer fee is configured in the Pi Developer Portal,           */
/*  NOT passed through the SDK.                                       */
/*  See: https://github.com/pi-apps/pi-platform-docs/blob/master/payments.md */
/* ------------------------------------------------------------------ */

export interface PiPaymentArgs {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
}

export interface CreatePiPaymentOptions {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  onPaymentId?: (paymentId: string) => void;
  onTransactionId?: (txid: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Mock Server-Side Payment Operations (Testnet only)                */
/*                                                                    */
/*  PRODUCTION: These MUST be implemented on your backend server      */
/*  using your Server API Key.                                        */
/*  Server API Key MUST NEVER be exposed in frontend code.            */
/*                                                                    */
/*  Endpoints (from platform_API.md):                                 */
/*   POST /payments/{payment_id}/approve   — Server API Key           */
/*   POST /payments/{payment_id}/complete  — Server API Key + {txid}  */
/*   POST /payments/{payment_id}/cancel    — Server API Key           */
/* ------------------------------------------------------------------ */

const API_URL = import.meta.env.VITE_API_URL || 'https://stayfind-api.onrender.com';

export async function serverSideApprove(paymentId: string): Promise<void> {
  console.log('[PiServer] Server-Side Approval:', paymentId);
  const res = await fetch(`${API_URL}/api/payments/approve/${paymentId}`, { method: 'POST' });
  if (!res.ok) throw new Error(`Approve failed: ${res.status}`);
}

export async function serverSideComplete(paymentId: string, txid: string): Promise<void> {
  console.log('[PiServer] Server-Side Completion:', paymentId, 'txid:', txid);
  const res = await fetch(`${API_URL}/api/payments/complete/${paymentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ txid }),
  });
  if (!res.ok) throw new Error(`Complete failed: ${res.status}`);
}

export async function serverSideCancel(paymentId: string): Promise<void> {
  console.log('[PiServer] Server-Side Cancel:', paymentId);
  // PRODUCTION: const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/cancel`, {
  //   method: 'POST', headers: { 'Authorization': `Key ${PI_SERVER_API_KEY}` }
  // });
}

/* ------------------------------------------------------------------ */
/*  Create Payment — Full 3-phase flow per Pi docs                    */
/* ------------------------------------------------------------------ */

/**
 * Create a Pi Network payment following the official 3-phase flow.
 *
 * Per Pi docs, metadata should NOT contain sensitive user data.
 * Only include data needed for your internal business logic
 * (e.g., order IDs, booking references).
 *
 * Security note from Pi docs:
 * "The user might be lying to your app! Users might be running a
 *  hacked version of the SDK. If the API call for Server-Side
 *  completion returns a non-200 error code, do not mark the payment
 *  as complete on your side, and do not deliver whatever the user
 *  was trying to buy."
 */
export async function createPiPayment(
  options: CreatePiPaymentOptions
): Promise<void> {
  const { amount, memo, metadata, onPaymentId, onTransactionId } = options;

  if (!window.Pi) {
    throw new Error('Pi SDK not available — open this app in Pi Browser');
  }

  // Pi.init is already called in index.html — do NOT call again

  const paymentData: PiPaymentArgs = {
    amount,
    memo,
    // Per Pi docs: metadata is for your own internal business logic only.
    // Do NOT include sensitive user data here.
    metadata,
  };

  return new Promise((resolve, reject) => {
    window.Pi!.createPayment!(paymentData, {
      /** Phase 1: Server-Side Approval */
      async onReadyForServerApproval(paymentId: string) {
        console.log('[PiPayment] Phase 1 — Ready for server approval:', paymentId);
        try {
          await serverSideApprove(paymentId);
        } catch (err) {
          console.error('[PiPayment] Server-side approval failed:', err);
        }
        onPaymentId?.(paymentId);
      },

      /** Phase 3: Server-Side Completion.
       *  Per Pi docs: if /complete returns non-200, do NOT mark the payment
       *  complete and do NOT deliver. Retry, then surface the error — Pi will
       *  re-deliver it via onIncompletePaymentFound on next authenticate. */
      async onReadyForServerCompletion(paymentId: string, txid: string) {
        console.log('[PiPayment] Phase 3 — Ready for server completion:', paymentId, txid);
        let lastErr: unknown;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            await serverSideComplete(paymentId, txid);
            onTransactionId?.(txid);
            resolve();
            return;
          } catch (err) {
            lastErr = err;
            console.warn(`[PiPayment] Completion attempt ${attempt}/3 failed:`, err);
            if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt));
          }
        }
        console.error('[PiPayment] Server completion failed after retries:', lastErr);
        reject(new Error('COMPLETION_FAILED'));
      },

      onCancel(paymentId: string) {
        console.warn('[PiPayment] Cancelled:', paymentId);
        reject(new Error('Payment was cancelled'));
      },

      onError(error: Error, payment?: unknown) {
        console.error('[PiPayment] Error:', error, payment);
        reject(error);
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Utility: check native features                                     */
/* ------------------------------------------------------------------ */

export async function isAdNetworkSupported(): Promise<boolean> {
  if (!window.Pi) return false;
  try {
    const features = await window.Pi.nativeFeaturesList();
    return features.includes('ad_network');
  } catch {
    return false;
  }
}
