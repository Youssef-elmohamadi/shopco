/**
 * Safely rounds a numeric price to at most 2 decimal places, avoiding JavaScript IEEE-754 floating point precision issues (e.g. 68.97999999999999 -> 68.98).
 */
export function roundPrice(value: number | string | undefined | null): number {
  if (value === undefined || value === null || value === "") return 0;
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Formats a price value to a clean string representation (e.g., 68.98, 50, 12.5).
 */
export function formatPrice(value: number | string | undefined | null): string {
  const rounded = roundPrice(value);
  return rounded.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}
