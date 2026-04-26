import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { StackBuilder } from "@/components/stack-builder";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Stack builder",
  description:
    "Add supplements to your daily stack and the builder orders them by dosing window, flags timing conflicts, and gives you a shareable link.",
  alternates: { canonical: "/stack-builder" },
};

export default function StackBuilderPage() {
  const catalog = getReviews("supplements").map((r) => ({
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
          <span>Build a daily stack</span>
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Stack builder<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        Drop supplements into a dosing window. The tool flags the
        absorption-blockers and the time-of-day conflicts before you take
        them, not after.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        Search my supplement catalog or paste a custom one. The conflict
        rules below are conservative; talk to a clinician for anything
        prescription-adjacent.{" "}
        <strong className="font-medium text-stone-700 dark:text-stone-300">
          This is not medical advice.
        </strong>
      </p>

      <Suspense fallback={null}>
        <StackBuilder catalog={catalog} />
      </Suspense>
    </Container>
  );
}
