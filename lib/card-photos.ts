import type { ReviewSummary } from "./types";

/**
 * The set of photos a listing card can rotate through, deduped and
 * preserved in display order: main `photo` first, then every distinct
 * `photoTimeline.src` after it.
 */
export function collectCardPhotos(review: ReviewSummary): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  if (review.photo) {
    seen.add(review.photo);
    out.push(review.photo);
  }
  for (const p of review.photoTimeline) {
    if (!p.src || seen.has(p.src)) continue;
    seen.add(p.src);
    out.push(p.src);
  }
  return out;
}
