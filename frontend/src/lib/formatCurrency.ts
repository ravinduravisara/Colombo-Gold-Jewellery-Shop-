/**
 * Formats minor units (cents) into formatted Sri Lankan Rupee display
 * @param amountInCents Amount in minor units (e.g. 150000 cents = Rs. 1,500.00)
 * @param includeDecimals Whether to include .00
 */
export function formatLKR(amountInCents: number = 0, includeDecimals = false): string {
  if (isNaN(amountInCents)) return "Rs. 0";

  const rupees = amountInCents / 100;
  return `Rs. ${rupees.toLocaleString("en-LK", {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPrice(amountInCents: number = 0): string {
  return formatLKR(amountInCents, false);
}

