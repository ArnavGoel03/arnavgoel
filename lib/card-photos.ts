import type { ReviewSummary } from "./types";

/**
 * The set of photos a listing card can rotate through, deduped and
 * preserved in display order:
 *   1. main `photo`
 *   2. every entry in `photos` (additional product shots)
 *   3. every distinct `photoTimeline.src` (dated progress shots)
 *
 * Video is intentionally excluded — listing cards stay quiet, video
 * lives only on the expanded detail-page gallery.
 */
export function collectCardPhotos(review: ReviewSummary): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  if (review.photo) {
    seen.add(review.photo);
    out.push(review.photo);
  }
  for (const src of review.photos ?? []) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push(src);
  }
  for (const p of review.photoTimeline) {
    if (!p.src || seen.has(p.src)) continue;
    seen.add(p.src);
    out.push(p.src);
  }
  return out;
}
