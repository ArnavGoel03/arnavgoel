import Link from "next/link";
import { RatingPill } from "./rating-pill";
import type { ReviewSummary } from "@/lib/types";

export function ProductCard({ review }: { review: ReviewSummary }) {
  const href = `/${review.kind}/${review.slug}`;
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100">
        {review.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.photo}
            alt={`${review.brand} ${review.name}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="px-6 text-center font-serif text-2xl leading-tight text-stone-400">
            {review.brand}
          </div>
        )}
        <div className="absolute right-3 top-3">
          <RatingPill rating={review.rating} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <div className="text-xs uppercase tracking-wider text-stone-500">
          {review.brand} · {review.category}
        </div>
        <h3 className="font-serif text-xl leading-snug text-stone-900">
          {review.name}
        </h3>
        {review.summary && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-600">
            {review.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
