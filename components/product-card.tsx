import Link from "next/link";
import { VerdictPill } from "./verdict-pill";
import { availabilityLabel } from "@/lib/retailers";
import type { ReviewSummary } from "@/lib/types";

export function ProductCard({ review }: { review: ReviewSummary }) {
  const href = `/${review.kind}/${review.slug}`;
  const availability = availabilityLabel(review);
  const isRegionLocked = availability?.endsWith("only") ?? false;
  const isPending = !review.verdict;
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-50 via-stone-50 to-stone-100">
        {review.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.photo}
            alt={`${review.brand} ${review.name}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            {/* Big brand watermark — fills the image well when no photo */}
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <span className="text-center font-serif text-4xl leading-[0.95] tracking-tight text-stone-300/80 sm:text-5xl">
                {review.brand}
              </span>
            </div>
            {/* Hairline cross corners — gives a "letterpress" hint */}
            <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-stone-300/70" />
            <span aria-hidden className="absolute right-3 top-3 h-3 w-3 border-r border-t border-stone-300/70" />
            <span aria-hidden className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-stone-300/70" />
            <span aria-hidden className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-stone-300/70" />
          </>
        )}
        {/* Floating rating / pending badge in top-right */}
        <div className="absolute right-4 top-3 rounded-md bg-white/85 px-2 py-1 backdrop-blur">
          <VerdictPill verdict={review.verdict} size="sm" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-stone-500">
            {review.brand}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-stone-400">
            {review.category}
          </span>
        </div>
        <h3 className="font-serif text-2xl leading-[1.1] tracking-tight text-stone-900">
          {review.name}
        </h3>
        {review.summary ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-600">
            {review.summary}
          </p>
        ) : isPending ? (
          <p className="mt-1 font-serif text-sm italic leading-relaxed text-stone-500">
            Full review coming after a month of real use.
          </p>
        ) : null}
        {availability && (
          <p
            className={
              "mt-2 text-[10px] uppercase tracking-[0.18em] " +
              (isRegionLocked ? "text-amber-700" : "text-stone-400")
            }
          >
            {isRegionLocked ? "Sold in " : "Sold in "}
            {availability.replace(" only", "").replace(" + ", " + ")}
            {isRegionLocked && (
              <span className="ml-1 normal-case tracking-normal italic text-amber-600">
                only
              </span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
