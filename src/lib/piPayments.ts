/**
 * Pi Payment Helpers
 * ------------------
 * Convert USD amounts to Pi cryptocurrency for display.
 * Uses a fixed conversion rate: 1 Pi = $0.15 USD.
 * Includes 2% developer fee as required for Pi Network Mainnet listing.
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
/*  Pi SDK Payment Types                                                */
/* ------------------------------------------------------------------ */

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  uid: string;
  /** Developer fee in Pi (2% of amount) - required for Pi Network Mainnet */
  developerFee?: number;
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

  const developerFee = calculateDeveloperFee(amount);

  const paymentData: PiPaymentData = {
    amount,
    memo,
    metadata: {
      ...metadata,
      developerFee,
      developerFeePercent: DEVELOPER_FEE_PERCENT,
      totalWithFee: amount + developerFee,
    },
    uid: crypto.randomUUID(),
    developerFee,
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
