import Link from "next/link";
import type { ReviewSummary } from "@/lib/types";
import { brandTextColor } from "@/lib/retailers";
import { VerdictPill } from "@/components/verdict-pill";

/**
 * Compact "you might also like" cluster shown at the foot of every
 * review detail page. Deliberately smaller and quieter than the full
 * ProductCard grid: this is a cross-link, not a sales surface. Renders
 * nothing when the similarity scorer found no items above threshold so
 * thinly-populated categories never show "no related" empty state.
 */
export function RelatedReviews({
  reviews,
}: {
  reviews: ReviewSummary[];
}) {
  if (reviews.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-12 border-t border-stone-200 pt-10 dark:border-stone-800"
    >
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <h2
          id="related-heading"
          className="font-serif text-2xl text-stone-900 dark:text-stone-100"
        >
          You might also like.
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
          ❋ {reviews.length} similar
        </span>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <li key={`${r.kind}-${r.slug}`}>
            <Link
              href={`/${r.kind}/${r.slug}`}
              className="group block h-full rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600"
            >
              <div className="mb-3 flex items-baseline justify-between gap-2 text-[10px] uppercase tracking-[0.2em]">
                <span className={"font-medium " + brandTextColor(r.brand)}>
                  {r.brand}
                </span>
                <span className="text-stone-400 dark:text-stone-500">
                  {r.category}
                </span>
              </div>
              <h3 className="mb-3 font-serif text-base leading-snug text-stone-900 transition-colors group-hover:text-rose-700 dark:text-stone-100 dark:group-hover:text-rose-400">
                {r.name}
              </h3>
              <div className="flex items-center justify-between gap-2">
                <VerdictPill verdict={r.verdict} size="sm" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                  Read →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
