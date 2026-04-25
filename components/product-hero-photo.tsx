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
    <figure className="relative mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 via-stone-50 to-stone-100 dark:border-stone-800">
      <div className="relative mx-auto flex w-full items-center justify-center p-6 sm:p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.photo}
          alt={`${review.brand} ${review.name}`}
          className="block max-h-[34vh] w-auto object-contain sm:max-h-[40vh]"
        />
      </div>
    </figure>
  );
}
