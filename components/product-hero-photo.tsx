import type { Review } from "@/lib/types";

/**
 * Product hero shot for the detail page. Sits below the title block
 * and above the body grid, taking up the full content width. Renders
 * nothing if the review has no photo, so the existing brand-watermark
 * style (visible only on listing cards) doesn't double up here.
 *
 * Height is clamped so portrait bottle shots don't push the body off
 * the fold; landscape boxes sit comfortably inside the frame.
 */
export function ProductHeroPhoto({ review }: { review: Review }) {
  if (!review.photo) return null;
  return (
    <figure className="relative mx-auto mt-8 max-w-xs overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 via-stone-50 to-stone-100 dark:border-stone-800 sm:max-w-sm">
      <div className="relative flex aspect-square w-full items-center justify-center p-3 sm:p-4">
        {/* mix-blend-multiply collapses the source's pure-white product
            background into the cream well, so the bottle silhouette
            appears to float on the page instead of sitting on a stark
            inner rectangle. Square aspect + tight padding keeps both
            portrait bottles and landscape boxes filling the frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.photo}
          alt={`${review.brand} ${review.name}`}
          className="block h-full w-full object-contain mix-blend-multiply"
        />
      </div>
    </figure>
  );
}
