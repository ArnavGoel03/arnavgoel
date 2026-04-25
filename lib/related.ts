import { getAllReviews } from "@/lib/content";
import type { ReviewSummary } from "@/lib/types";

/**
 * Hand-tuned similarity score for two reviews. The scoring weights are
 * picked so a niacinamide serum from one brand surfaces another brand's
 * niacinamide serum first, *not* a different brand's moisturizer that
 * happens to also list niacinamide. Category match is the strongest
 * signal because category is the closest thing to a buy-decision peer
 * group on this site.
 *
 *   category match     +5
 *   each ingredient    +2 (set overlap)
 *   each goal          +1.5
 *   each skinType      +1
 *   same kind          +3
 *   verdict tier match +1
 *
 * Items in different `kind`s never reach the surface unless the score
 * crosses MIN_SCORE; this prevents random Essentials cards leaking
 * into a Skincare detail page.
 */
const MIN_SCORE = 4;

function setOverlap(a: string[] | undefined, b: string[] | undefined): number {
  if (!a?.length || !b?.length) return 0;
  const A = new Set(a.map((s) => s.toLowerCase().trim()));
  let n = 0;
  for (const x of b) if (A.has(x.toLowerCase().trim())) n++;
  return n;
}

function score(a: ReviewSummary, b: ReviewSummary): number {
  if (a.slug === b.slug && a.kind === b.kind) return 0;
  let s = 0;
  if (a.kind === b.kind) s += 3;
  if (a.category && a.category === b.category) s += 5;
  s += setOverlap(a.ingredients, b.ingredients) * 2;
  s += setOverlap(a.goal, b.goal) * 1.5;
  s += setOverlap(a.skinType, b.skinType) * 1;
  if (a.verdict && a.verdict === b.verdict) s += 1;
  return s;
}

/**
 * Top-N most-related reviews to the given one. Filters out hidden,
 * retired, and below-threshold matches so the surface is always
 * "actually similar," never filler. Returns [] when the catalog is too
 * small for any product to clear MIN_SCORE.
 */
export function getRelatedReviews(
  review: { slug: string; kind: string; category: string },
  n = 3,
): ReviewSummary[] {
  const all = getAllReviews();
  const ranked = all
    .filter((r) => !(r.slug === review.slug && r.kind === review.kind))
    .map((r) => ({
      review: r,
      score: score(review as ReviewSummary, r),
    }))
    .filter((x) => x.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.review);
  return ranked;
}
