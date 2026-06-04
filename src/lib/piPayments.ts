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
