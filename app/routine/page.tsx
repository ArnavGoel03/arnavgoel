import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import {
  ROUTINE_DESCRIPTIONS,
  ROUTINE_LABELS,
  getReviewsInRoutine,
  getRoutinesList,
} from "@/lib/routines";

export const metadata: Metadata = {
  title: "Routines",
  description:
    "What I actually do, morning, evening, and the running supplement stack.",
  alternates: { canonical: "/routine" },
};

export default function RoutineIndexPage() {
  const routines = getRoutinesList();
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="max-w-4xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>What I actually do</span>
        </span>
        <span className="font-mono text-stone-400">{today}</span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-8xl">
        Routines<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl">
        The reviews answer &ldquo;is this product good?&rdquo; These pages
        answer &ldquo;what do you actually do, in order?&rdquo;
      </p>

      <ol className="mt-16 divide-y divide-stone-200 border-t border-stone-300">
        {routines.map((r, i) => {
          const items = getReviewsInRoutine(r);
          return (
            <li key={r}>
              <Link
                href={`/routine/${r}`}
                className="group flex items-baseline gap-6 py-8"
              >
                <span className="hidden w-14 shrink-0 font-mono text-xs text-stone-400 tabular-nums sm:inline-block">
                  №&nbsp;{String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-3xl leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-rose-700 sm:text-4xl">
                    {ROUTINE_LABELS[r]}
                  </h3>
                  <p className="mt-3 max-w-2xl font-serif text-base italic leading-relaxed text-stone-500">
                    {ROUTINE_DESCRIPTIONS[r]}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
