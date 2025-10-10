// utils/formatPrice.ts

/**
 * Format a number or string as price with commas and two decimals
 * Example: 10000 => "10,000.00"
 */
export function formatPrice(value: number | string, currency: string): string {
  if (!value && value !== 0) return "";

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) return "";

  const formattedValue = numberValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currency === "USD" ? `$${formattedValue}` : `ETB ${formattedValue}`;

}
