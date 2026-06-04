/**
 * Pi Payment Helpers
 * ------------------
 * Pi Network SDK v2.0 integration per official docs:
 * https://github.com/pi-apps/pi-platform-docs
 *
 * Payment Flow (3 phases):
 * 1. Payment creation + Server-Side Approval
 * 2. User interaction + blockchain transaction
 * 3. Server-Side Completion
 */

// Pi Network realistic market rate: 1 PI ≈ $0.15 USD
const PI_USD_RATE = 0.15;

// Developer fee percentage (required for Pi Network Mainnet)
const DEVELOPER_FEE_PERCENT = 2;

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

/** Calculate 2% developer fee for a given Pi amount */
export function calculateDeveloperFee(piAmount: number): number {
  return Math.round((piAmount * DEVELOPER_FEE_PERCENT) / 100 * 100) / 100;
}

/** Get the developer fee percentage for display */
export function getDeveloperFeePercent(): number {
  return DEVELOPER_FEE_PERCENT;
}

/* ------------------------------------------------------------------ */
/*  Pi SDK Payment Types (from official docs)                           */
/* ------------------------------------------------------------------ */

/**
 * PaymentData — arguments passed to Pi.createPayment()
 * Per docs: only amount, memo, metadata are allowed.
 * uid is generated automatically by the SDK.
 * developerFee is handled server-side via Platform API.
 */
export interface PiPaymentArgs {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

/** Payment callbacks as defined in official Pi SDK docs */
export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
}

/** Options for creating a Pi payment in our app */
export interface CreatePiPaymentOptions {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  onPaymentId?: (paymentId: string) => void;
  onTransactionId?: (txid: string) => void;
}

/** Mock server-side approval (Testnet only).
 *  Production: backend calls POST /payments/{id}/approve with Server API Key.
 */
async function serverSideApprove(paymentId: string): Promise<void> {
  console.log('[PiPayment] Server-Side Approval:', paymentId);
  // Production implementation:
  // const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
  //   method: 'POST',
  //   headers: { 'Authorization': `Key ${PI_SERVER_API_KEY}` }
  // });
  // if (!res.ok) throw new Error('Server-side approval failed');
}

/** Mock server-side completion (Testnet only).
 *  Production: backend calls POST /payments/{id}/complete with { txid }.
 */
async function serverSideComplete(paymentId: string, txid: string): Promise<void> {
  console.log('[PiPayment] Server-Side Completion:', paymentId, txid);
  // Production implementation:
  // const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
  //   method: 'POST',
  //   headers: { 'Authorization': `Key ${PI_SERVER_API_KEY}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ txid })
  // });
  // if (!res.ok) throw new Error('Server-side completion failed');
}

/* ------------------------------------------------------------------ */
/*  Create Payment — Full 3-phase flow per Pi docs                      */
/* ------------------------------------------------------------------ */

/**
 * Create a Pi Network payment following the official 3-phase flow:
 *
 * Phase 1: Payment creation + Server-Side Approval
 *   - Frontend calls Pi.createPayment()
 *   - onReadyForServerApproval: frontend sends paymentId to backend
 *   - Backend calls /approve API
 *
 * Phase 2: User interaction + blockchain transaction
 *   - Pi Wallet shows payment dialog
 *   - User confirms and submits transaction
 *   - Everything handled by Pi Platform
 *
 * Phase 3: Server-Side Completion
 *   - onReadyForServerCompletion: frontend sends txid to backend
 *   - Backend calls /complete API
 *   - Payment flow closes
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
    metadata: {
      ...metadata,
      developerFee: calculateDeveloperFee(amount),
      developerFeePercent: DEVELOPER_FEE_PERCENT,
    },
  };

  return new Promise((resolve, reject) => {
    window.Pi!.createPayment!(paymentData, {
      /** Phase 1: Server-Side Approval */
      async onReadyForServerApproval(paymentId: string) {
        console.log('[PiPayment] Phase 1 — Ready for server approval:', paymentId);
        try {
          await serverSideApprove(paymentId);
          console.log('[PiPayment] Server-side approval done');
        } catch (err) {
          console.error('[PiPayment] Server-side approval failed:', err);
        }
        onPaymentId?.(paymentId);
      },

      /** Phase 3: Server-Side Completion */
      async onReadyForServerCompletion(paymentId: string, txid: string) {
        console.log('[PiPayment] Phase 3 — Ready for server completion:', paymentId, txid);
        try {
          await serverSideComplete(paymentId, txid);
          console.log('[PiPayment] Server-side completion done');
        } catch (err) {
          console.error('[PiPayment] Server-side completion failed:', err);
        }
        onTransactionId?.(txid);
        resolve();
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
/*  Utility: check if Pi Browser ads are supported                     */
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
