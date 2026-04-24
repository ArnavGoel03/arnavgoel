import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { getRetiredReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Retired",
  description:
    "Products I used, loved or didn't, and eventually moved on from. Kept here for context, not recommendation.",
  alternates: { canonical: "/retired" },
};

export default function RetiredPage() {
  const items = getRetiredReviews();
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Off the shelf</span>
        </span>
        <span className="font-mono text-stone-400">{today}</span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-7xl">
        Retired<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 mb-12 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl">
        Products I used for long enough to have an opinion, then moved on
        from. Some were good and replaced by better. Some just didn&apos;t
        fit. Either way, here for context, not recommendation.
      </p>

      {items.length === 0 ? (
        <p className="py-16 text-center text-stone-500">
          Nothing retired yet.
        </p>
      ) : (
        <ol className="divide-y divide-stone-100 border-t border-stone-200">
          {items.map((review) => (
            <li key={`${review.kind}-${review.slug}`}>
              <Link
                href={`/${review.kind}/${review.slug}`}
                className="group block py-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                      {review.brand} · {review.category}
                    </p>
                    <h3 className="mt-0.5 font-serif text-xl text-stone-900 transition-colors group-hover:text-rose-700 sm:text-2xl">
                      {review.name}
                    </h3>
                    {review.retiredReason && (
                      <p className="mt-2 font-serif text-sm italic leading-relaxed text-stone-500">
                        &ldquo;{review.retiredReason}&rdquo;
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                    {review.kind}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </Container>
  );
}
