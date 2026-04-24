import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { getPrimers } from "@/lib/content";
import { site } from "@/lib/site";
import type { PrimerSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "Primers",
  description: `Short, high-signal reference pages on ingredients and stacks, written by ${site.shortName}.`,
  alternates: { canonical: "/primers" },
};

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const DOMAIN_LABEL: Record<PrimerSummary["domain"], string> = {
  supplement: "Health",
  skincare: "Skincare",
};

function groupByDomain(primers: PrimerSummary[]) {
  const bucket: Record<PrimerSummary["domain"], PrimerSummary[]> = {
    supplement: [],
    skincare: [],
  };
  for (const p of primers) bucket[p.domain].push(p);
  return bucket;
}

// ────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ────────────────────────────────────────────────────────────────────────────

function PrimerRow({ primer, index }: { primer: PrimerSummary; index: number }) {
  return (
    <li>
      <Link
        href={`/primers/${primer.slug}`}
        className="group flex items-baseline gap-6 py-6"
      >
        <span className="hidden w-10 shrink-0 font-mono text-xs text-stone-400 tabular-nums sm:inline-block">
          №&nbsp;{String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-2xl leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-rose-700 sm:text-3xl">
            {primer.title}
          </h3>
          {primer.subtitle && (
            <p className="mt-2 font-serif text-base italic leading-relaxed text-stone-600">
              {primer.subtitle}
            </p>
          )}
          {primer.stack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-stone-400">
              {primer.stack.map((s, i) => (
                <span key={s}>
                  {i > 0 && <span className="mr-2 text-stone-300">·</span>}
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-stone-400">
          {primer.kind === "stack" ? "Stack" : "Ingredient"}
        </span>
      </Link>
    </li>
  );
}

function DomainGroup({
  label,
  items,
}: {
  label: string;
  items: PrimerSummary[];
}) {
  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between border-b border-stone-200 pb-2">
        <h2 className="font-display text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">
          {label}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
          {items.length} {items.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <ol className="divide-y divide-stone-100">
        {items.map((p, i) => (
          <PrimerRow key={p.slug} primer={p} index={i} />
        ))}
      </ol>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────

export default function PrimersPage() {
  const primers = getPrimers();
  const grouped = groupByDomain(primers);
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="max-w-4xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>The reading room</span>
        </span>
        <span className="font-mono text-stone-400">{today}</span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-8xl">
        Primers<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl">
        High-signal reference pages on ingredients and stacks. No filler,
        no marketing, the parts of a topic you actually need before a
        review makes sense.
      </p>

      {primers.length === 0 ? (
        <p className="mt-16 py-12 text-center text-stone-500">
          No primers yet. Come back soon.
        </p>
      ) : (
        <div className="mt-16 space-y-16 border-t border-stone-300 pt-10">
          {(["supplement", "skincare"] as const).map((d) =>
            grouped[d].length > 0 ? (
              <DomainGroup key={d} label={DOMAIN_LABEL[d]} items={grouped[d]} />
            ) : null,
          )}
        </div>
      )}
    </Container>
  );
}
