import Link from "next/link";
import { VerdictPill } from "./verdict-pill";
import { CompareToggle } from "./compare-bar";
import { ProductCardPhoto } from "./product-card-photo";
import { availabilityLabel, brandTextColor } from "@/lib/retailers";
import { pricesByRegion } from "@/lib/price";
import { toCompareId } from "@/lib/compare";
import { collectCardPhotos } from "@/lib/card-photos";
import type { ReviewSummary } from "@/lib/types";

export function ProductCard({ review }: { review: ReviewSummary }) {
  const href = `/${review.kind}/${review.slug}`;
  const availability = availabilityLabel(review);
  const isRegionLocked = availability?.endsWith("only") ?? false;
  const isPending = !review.verdict;
  const photos = collectCardPhotos(review);
  return (
    <Link
      href={href}
      data-tour-listing="card"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-50 via-stone-50 to-stone-100">
        {photos.length > 0 ? (
          // Always-cream photo well, in both light and dark themes.
          // Product shots almost always come on white from the retailer,
          // so a dark photo well would surround them with stark contrast.
          // Keeping it cream regardless of theme reads as an intentional
          // magazine "product spotlight" frame.
          <ProductCardPhoto
            photos={photos}
            alt={`${review.brand} ${review.name}, ${review.category}`}
          />
        ) : (
          <>
            {/* Big brand watermark, fills the image well when no photo.
                The cream well needs a darker watermark than a stone-300
                ghost, otherwise it disappears. */}
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <span className="text-center font-serif text-4xl leading-[0.95] tracking-tight text-stone-400/90 sm:text-5xl">
                {review.brand}
              </span>
            </div>
            {/* Hairline cross corners, gives a "letterpress" hint. */}
            <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-stone-400/60" />
            <span aria-hidden className="absolute right-3 top-3 h-3 w-3 border-r border-t border-stone-400/60" />
            <span aria-hidden className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-stone-400/60" />
            <span aria-hidden className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-stone-400/60" />
          </>
        )}
        {/* Floating rating / pending badge in top-right */}
        <div className="absolute right-4 top-3 rounded-md bg-white/85 px-2 py-1 backdrop-blur dark:bg-stone-900/85">
          <VerdictPill verdict={review.verdict} size="sm" />
        </div>
        {/* Compare toggle in bottom-left of the image well */}
        <div className="absolute bottom-3 left-3 z-10">
          <CompareToggle id={toCompareId(review.kind, review.slug)} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={
              "inline-flex items-baseline gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] " +
              brandTextColor(review.brand)
            }
          >
            {review.brand}
            {/* Rotation indicator. The rose ❋ next to the brand means
                the product is in at least one active routine right now
                (morning / evening / stack / shower). Quiet, on-brand. */}
            {review.routines && review.routines.length > 0 && (
              <span
                aria-label={`In active rotation: ${review.routines.join(", ")}`}
                title={`In rotation: ${review.routines.join(", ")}`}
                className="text-rose-400"
              >
                ❋
              </span>
            )}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500">
            {review.category}
          </span>
        </div>
        <h3 className="font-serif text-2xl leading-[1.1] tracking-tight text-stone-900 dark:text-stone-100">
          {review.name}
        </h3>
        {review.summary ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {review.summary}
          </p>
        ) : isPending ? (
          <p className="mt-1 font-serif text-sm italic leading-relaxed text-stone-500 dark:text-stone-400">
            Full review coming after a month of real use.
          </p>
        ) : null}
        {(() => {
          const prices = pricesByRegion(review.price);
          if (prices.length === 0) return null;
          return (
            <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm tabular-nums text-stone-700 dark:text-stone-300">
              {prices.map(({ region, value }, i) => (
                <span key={region} className="inline-flex items-baseline">
                  {i > 0 && (
                    <span aria-hidden className="mr-2 text-stone-300 dark:text-stone-600">
                      ·
                    </span>
                  )}
                  <span className="font-medium">{value}</span>
                </span>
              ))}
            </p>
          );
        })()}
        {availability && (
          <p
            className={
              "mt-2 text-[10px] uppercase tracking-[0.18em] " +
              (isRegionLocked
                ? "text-amber-700 dark:text-amber-400"
                : "text-stone-400 dark:text-stone-500")
            }
          >
            {isRegionLocked ? "Sold in " : "Sold in "}
            {availability.replace(" only", "").replace(" + ", " + ")}
            {isRegionLocked && (
              <span className="ml-1 normal-case tracking-normal italic text-amber-600 dark:text-amber-300">
                only
              </span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
