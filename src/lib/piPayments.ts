/**
 * Pi Payment Helpers
 * ------------------
 * Convert USD amounts to Pi cryptocurrency for display.
 * Uses a fixed conversion rate: 1 Pi = $45 USD.
 */

const PI_CONVERSION_RATE = 45; // 1 Pi = $45 USD

/** Convert a USD amount to Pi */
export function usdToPi(usdAmount: number): number {
  return usdAmount / PI_CONVERSION_RATE;
}

/** Format a Pi amount for display, e.g. 6.33 π */
export function formatPiAmount(piAmount: number): string {
  return `${piAmount.toFixed(2)} π`;
}

/* ------------------------------------------------------------------ */
/*  Pi SDK Payment Types                                                */
/* ------------------------------------------------------------------ */

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  uid: string;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string, error?: unknown) => void;
  onError: (error: Error, payment?: unknown) => void;
}

/** Options for creating a Pi payment */
export interface CreatePiPaymentOptions {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  onPaymentId?: (paymentId: string) => void;
  onTransactionId?: (txid: string) => void;
}

/** Create a Pi Network payment using the Pi SDK */
export async function createPiPayment(
  options: CreatePiPaymentOptions
): Promise<void> {
  const { amount, memo, metadata, onPaymentId, onTransactionId } = options;

  if (!window.Pi) {
    throw new Error('Pi SDK not available');
  }

  await window.Pi.init({ version: '2.0', sandbox: true });

  const paymentData: PiPaymentData = {
    amount,
    memo,
    metadata,
    uid: crypto.randomUUID(),
  };

  return new Promise((resolve, reject) => {
    window.Pi!.createPayment!(paymentData, {
      onReadyForServerApproval(paymentId: string) {
        console.log('[PiPayment] Ready for server approval:', paymentId);
        onPaymentId?.(paymentId);
      },
      onReadyForServerCompletion(paymentId: string, txid: string) {
        console.log(
          '[PiPayment] Ready for server completion:',
          paymentId,
          txid
        );
        onTransactionId?.(txid);
        resolve();
      },
      onCancel(paymentId: string, error?: unknown) {
        console.warn('[PiPayment] Payment cancelled:', paymentId, error);
        reject(new Error('Payment was cancelled'));
      },
      onError(error: Error, payment?: unknown) {
        console.error('[PiPayment] Payment error:', error, payment);
        reject(error);
      },
    });
  });
}
