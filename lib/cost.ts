import type { Review } from "@/lib/types";

/**
 * Pull a numeric price out of a string like "$35", "$1,295.00", "Rs. 499",
 * or "£12.50". Returns null if no number can be parsed.
 */
export function parsePrice(price: string | undefined): number | null {
  if (!price) return null;
  const match = price.replace(/,/g, "").match(/[\d.]+/);
  if (!match) return null;
  const n = parseFloat(match[0]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Cost per day in the same currency as `price`. Requires
 * `servingsPerContainer` in frontmatter. If `dailyServings` is missing,
 * defaults to 1 (one dose per day).
 *
 * Returns null when there isn't enough info to compute, caller should
 * hide the row.
 */
export function costPerDay(
  review: Pick<Review, "price" | "servingsPerContainer" | "dailyServings">,
): number | null {
  const price = parsePrice(review.price);
  const servings = review.servingsPerContainer;
  if (!price || !servings || servings <= 0) return null;
  const daily = review.dailyServings && review.dailyServings > 0
    ? review.dailyServings
    : 1;
  return (price / servings) * daily;
}

/**
 * Infer the currency symbol from the price string. Falls back to "$"
 * since most products on the site are priced in USD.
 */
export function currencyFor(price: string | undefined): string {
  if (!price) return "$";
  const match = price.match(/[$₹£€¥]|Rs\.?/i);
  return match ? match[0] : "$";
}

export function formatCostPerDay(
  review: Pick<Review, "price" | "servingsPerContainer" | "dailyServings">,
): string | null {
  const cpd = costPerDay(review);
  if (cpd === null) return null;
  const symbol = currencyFor(review.price);
  // Two decimals feel right for anything under $10/day; above that,
  // round to whole currency units to avoid false precision.
  return cpd < 10 ? `${symbol}${cpd.toFixed(2)}` : `${symbol}${Math.round(cpd)}`;
}
