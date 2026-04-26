import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Best of 2026",
  description:
    "The annual issue. Coming at the end of the year once every category has had a full twelve months on the shelf.",
  alternates: { canonical: "/best-of/2026" },
};

export default function BestOf2026Page() {
  return (
    <Container className="max-w-3xl py-20 sm:py-28">
      <div className="mb-10 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>The annual issue</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">
          Vol. 2026
        </span>
      </div>

      <h1 className="font-serif text-[14vw] leading-[0.92] tracking-[-0.045em] text-stone-900 dark:text-stone-100 sm:text-8xl">
        Best of
        <br />
        2026<span className="text-rose-400">.</span>
      </h1>

      <p className="mt-10 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 dark:text-stone-300">
        Coming in early 2027.
      </p>

      <div className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-stone-700 dark:text-stone-300">
        <p>
          A best-of-the-year only means something if every product has had
          the full year to prove itself. We are still mid-2026, so any
          ranking right now would be picking favourites from a half-empty
          shelf.
        </p>
        <p>
          The plan: come back in January 2027. By then every category will
          have a year of real use behind it, and the picks will be the
          products I would buy first if I were starting that shelf from
          scratch the next morning. One pick per category. No nominations,
          no submissions, no PR samples.
        </p>
        <p>
          In the meantime, the catalog is open: every review carries a
          verdict word, three rating axes, and the long-form prose that
          carries the case.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/skincare"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          Browse the catalog
        </Link>
        <Link
          href="/subscribe"
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition-colors hover:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-400"
        >
          Get notified when it lands
        </Link>
      </div>

      <p className="mt-20 border-t border-stone-200 pt-8 text-center font-serif italic text-stone-500 dark:border-stone-800 dark:text-stone-400">
        See you in January 2027.
      </p>
    </Container>
  );
}
