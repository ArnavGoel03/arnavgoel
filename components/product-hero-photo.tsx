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
    <figure className="relative mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
      <div className="relative mx-auto flex w-full items-center justify-center" style={{ maxHeight: "70vh" }}>
        {/* Use unoptimized=true via plain img: the photo can come from
            any external host (retailer CDN or our own Blob), and we want
            graceful fallback rather than 404'ing on the optimizer for
            unconfigured remote patterns. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.photo}
          alt={`${review.brand} ${review.name}`}
          className="block max-h-[70vh] w-full object-contain"
        />
      </div>
    </figure>
  );
}
