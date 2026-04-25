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
    <figure className="relative mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 via-stone-50 to-stone-100 dark:border-stone-800 sm:max-w-lg">
      <div className="relative flex aspect-[4/5] w-full items-center justify-center p-6 sm:p-10">
        {/* mix-blend-multiply collapses the source's pure-white product
            background into the cream well, so the bottle silhouette
            appears to float on the page instead of sitting on a stark
            inner rectangle. Aspect-ratio + max-w keeps the frame tight
            so portrait product shots feel framed, not lost. */}
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
