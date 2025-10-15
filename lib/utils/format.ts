/**
 * Safe number formatting utilities
 * Handles invalid numbers, NaN, Infinity, and edge cases
 */

/**
 * Safely converts value to number
 */
export function safeParseNumber(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || !isFinite(num)) return 0;
  return num;
}

/**
 * Safely format number with toFixed
 */
export function safeToFixed(value: string | number | undefined | null, decimals: number = 2): string {
  const num = safeParseNumber(value);
  return num.toFixed(decimals);
}

/**
 * Format price with appropriate decimal places
 */
export function formatPrice(price: string | number | undefined | null): string {
  const value = safeParseNumber(price);

  if (value === 0) return "$0.00";

  // Format based on magnitude
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  if (value >= 0.000001) return `$${value.toFixed(8)}`;

  // For very small numbers, use scientific notation
  return `$${value.toExponential(2)}`;
}

/**
 * Format volume with K/M/B suffix
 */
export function formatVolume(volume: string | number | undefined | null): string {
  const value = safeParseNumber(volume);

  if (value === 0) return "$0";

  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

/**
 * Format percentage change
 */
export function formatChange(change: string | number | undefined | null): {
  value: string;
  trend: "up" | "down" | "neutral";
} {
  const value = safeParseNumber(change);

  return {
    value: `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`,
    trend: value > 0 ? "up" : value < 0 ? "down" : "neutral",
  };
}

/**
 * Format STX amount (microSTX to STX)
 */
export function formatSTX(microSTX: string | number | undefined | null, decimals: number = 6): string {
  const value = safeParseNumber(microSTX);
  return `${(value / 1e6).toFixed(decimals)} STX`;
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(
  amount: string | number | undefined | null,
  decimals: number = 6,
  symbol?: string
): string {
  const value = safeParseNumber(amount);
  const formatted = value.toFixed(decimals);
  return symbol ? `${formatted} ${symbol}` : formatted;
}
