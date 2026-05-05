import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { StackBuilder } from "@/components/stack-builder";
import { RoutineBuilder } from "@/components/routine-builder";
import { RoutineSimulator } from "@/components/routine-simulator";
import { getReviews } from "@/lib/content";

const VALID_TOOLS = ["routine", "stack", "simulator"] as const;
type Tool = (typeof VALID_TOOLS)[number];

const COPY: Record<Tool, { eyebrow: string; title: string; lede: string; sub: string }> = {
  routine: {
    eyebrow: "Build a routine",
    title: "Routine builder",
    lede: "Drop the products you actually own into the bag. The tool orders them, layers them, and tells you where the conflicts are.",
    sub: "Search my catalog for products I have reviewed, or paste any product name with a category. Pick a goal, toggle AM or PM, share the routine via URL.",
  },
  stack: {
    eyebrow: "Build a daily stack",
    title: "Stack builder",
    lede: "Drop supplements into a dosing window. The tool flags absorption-blockers and time-of-day conflicts before you take them, not after.",
    sub: "Search my supplement catalog or paste a custom one. Conflict rules are conservative; talk to a clinician for anything prescription-adjacent. This is not medical advice.",
  },
  simulator: {
    eyebrow: "Simulate a routine",
    title: "Routine simulator",
    lede: "Pick the variables, get a routine. The picks come straight from products I have actually reviewed; the simulator only ranks and filters, never invents.",
    sub: "",
  },
};

export const metadata: Metadata = {
  title: "Build",
  description:
    "One workshop for the routine and stack tools — pick a tab to build your own routine, build a supplement stack, or have the simulator pick a routine for you.",
  alternates: { canonical: "/build" },
};

type Props = { searchParams: Promise<{ tool?: string }> };

export default async function BuildPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tool: Tool = (VALID_TOOLS as readonly string[]).includes(sp.tool ?? "")
    ? (sp.tool as Tool)
    : "routine";
  const copy = COPY[tool];

  return (
    <Container className="max-w-5xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>{copy.eyebrow}</span>
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        {copy.title}<span className="text-rose-400">.</span>
      </h1>

      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        {copy.lede}
      </p>
      {copy.sub && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
          {copy.sub}
        </p>
      )}

      {/* Tab strip — three tools share the same page so they stop
          reading as duplicate destinations in the nav. The active
          tab is pure server-side, no JS needed; switching is a
          regular link with a different ?tool= value. */}
      <nav
        aria-label="Build tools"
        className="mt-10 flex flex-wrap items-baseline gap-2 border-b border-stone-200 pb-3 text-[11px] uppercase tracking-[0.18em] dark:border-stone-800"
      >
        {VALID_TOOLS.map((t) => {
          const active = t === tool;
          const label =
            t === "routine"
              ? "Routine builder"
              : t === "stack"
                ? "Stack builder"
                : "Simulator";
          return (
            <Link
              key={t}
              href={`/build?tool=${t}`}
              className={
                "rounded-full border px-3 py-1.5 transition-colors " +
                (active
                  ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:text-stone-100")
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        {tool === "routine" && <RoutineBuilderPanel />}
        {tool === "stack" && <StackBuilderPanel />}
        {tool === "simulator" && <RoutineSimulatorPanel />}
      </div>
    </Container>
  );
}

function RoutineBuilderPanel() {
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
    <Suspense fallback={null}>
      <RoutineBuilder catalog={catalog} />
    </Suspense>
  );
}

function StackBuilderPanel() {
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
    <Suspense fallback={null}>
      <StackBuilder catalog={catalog} />
    </Suspense>
  );
}

function RoutineSimulatorPanel() {
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
    skinType: r.skinType ?? [],
    goal: r.goal ?? [],
    price: r.price,
  }));
  return <RoutineSimulator catalog={catalog} />;
}
