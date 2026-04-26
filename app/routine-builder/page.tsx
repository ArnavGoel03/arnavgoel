import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { RoutineBuilder } from "@/components/routine-builder";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Routine builder",
  description:
    "Add your own products, pick your goals, and watch the tool order your routine, flag conflicts, and hand you a shareable link.",
  alternates: { canonical: "/routine-builder" },
};

export default function RoutineBuilderPage() {
  const catalog = [
    ...getReviews("skincare"),
    ...getReviews("supplements"),
    ...getReviews("oral-care"),
    ...getReviews("hair-care"),
    ...getReviews("body-care"),
  ].map((r) => ({
    kind: r.kind,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    verdict: r.verdict,
    ingredients: r.ingredients ?? [],
    goal: r.goal ?? [],
  }));

  return (
    <Container className="max-w-5xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Build a routine</span>
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Routine builder<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        Drop the products you actually own into the bag. The tool orders
        them, layers them, and tells you where the conflicts are.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        Search my catalog for products I have reviewed, or paste any product
        name with a category and the builder treats it the same way. Pick a
        goal, toggle AM or PM, share the resulting routine via URL.{" "}
        <strong className="font-medium text-stone-700 dark:text-stone-300">
          Different from the routine simulator
        </strong>
        : that page picks for you, this one is yours.
      </p>

      <Suspense fallback={null}>
        <RoutineBuilder catalog={catalog} />
      </Suspense>
    </Container>
  );
}
