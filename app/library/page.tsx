import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { LibraryTabs } from "@/components/library-tabs";
import { getLibrary } from "@/lib/library";

type Props = { searchParams: Promise<{ tab?: string }> };

export const metadata: Metadata = {
  title: "Library",
  description:
    "Books and films I am currently in, finished with, or gave up on. Two tabs, same shape, one-line takes.",
  alternates: { canonical: "/library" },
};

export default async function LibraryPage({ searchParams }: Props) {
  const sp = await searchParams;
  const initial = sp.tab === "watching" ? "watching" : "reading";
  const { reading, watching } = getLibrary();
  const empty = reading.length === 0 && watching.length === 0;

  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Off the desk</span>
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Library<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        Books and films, currently / finished / abandoned. Same one-line-take
        rule as the product reviews.
      </p>

      {empty ? (
        <div className="mt-16 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 dark:border-stone-700 dark:bg-stone-900">
          <p className="font-serif text-xl italic text-stone-700 dark:text-stone-200">
            Building this slowly.
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            The previous list was AI-picked filler, so it has been cleared.
            New entries will land here as I actually finish books and shows;
            the same one-month, no-shortcut rule the product reviews follow.
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            If you came looking for what I am reading right now, the answer
            is: I will tell you when I have something honest to say.
          </p>
        </div>
      ) : (
        <Suspense fallback={null}>
          <LibraryTabs
            reading={reading}
            watching={watching}
            initialTab={initial}
          />
        </Suspense>
      )}
    </Container>
  );
}
