import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import {
  ROUTINE_DESCRIPTIONS,
  ROUTINE_LABELS,
  getReviewsInRoutine,
  getReviewsInSubroutine,
  getRoutinesList,
  getSubroutinesForParent,
  type RoutineSlug,
} from "@/lib/routines";

type Props = { params: Promise<{ slug: string }> };

const VALID: RoutineSlug[] = ["morning", "evening", "stack", "shower", "oral"];

export async function generateStaticParams() {
  return getRoutinesList().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!VALID.includes(slug as RoutineSlug)) return {};
  const label = ROUTINE_LABELS[slug as RoutineSlug];
  return {
    title: `${label} routine`,
    description: ROUTINE_DESCRIPTIONS[slug as RoutineSlug],
    alternates: { canonical: `/routine/${slug}` },
  };
}

export default async function RoutinePage({ params }: Props) {
  const { slug } = await params;
  if (!VALID.includes(slug as RoutineSlug)) notFound();
  const routine = slug as RoutineSlug;
  const items = getReviewsInRoutine(routine);
  const subroutines = getSubroutinesForParent(routine);

  // Application order for skincare: cleanse → exfoliate → tone →
  // treat → moisturize → protect. The list view should read top-down
  // as the literal sequence the products are applied, with a step
  // number on each row so the order is obvious without prose.
  const SKINCARE_ORDER: Record<string, number> = {
    "cleansing balm": 9,
    "face wash": 10,
    cleanser: 11,
    "chemical exfoliant": 20,
    "chemical peel": 21,
    "face scrub": 22,
    dermaplaning: 23,
    tool: 24,
    "face mask": 30,
    "sheet mask": 31,
    toner: 40,
    patches: 50,
    serum: 60,
    prescription: 70,
    "eye cream": 80,
    moisturizer: 90,
    aftershave: 95,
    "lip scrub": 96,
    "lip balm": 97,
    sunscreen: 100,
  };
  const skincare = items
    .filter((r) => r.kind === "skincare")
    .sort(
      (a, b) =>
        (SKINCARE_ORDER[a.category] ?? 999) -
        (SKINCARE_ORDER[b.category] ?? 999),
    );
  // Oral application order: brush + paste → interdental/floss →
  // water-flosser → rinse/spray → accessories last. Same sequence
  // morning and night.
  const ORAL_ORDER: Record<string, number> = {
    "electric toothbrush": 10,
    toothbrush: 11,
    "brush head": 12,
    toothpaste: 15,
    "teeth whitening": 18,
    interdental: 20,
    floss: 25,
    "floss picks": 26,
    "water flosser": 30,
    mouthwash: 50,
    "breath spray": 51,
    "toothbrush cover": 90,
  };
  const supplements = items.filter((r) => r.kind === "supplements");
  const oralCare = items
    .filter((r) => r.kind === "oral-care")
    .sort(
      (a, b) =>
        (ORAL_ORDER[a.category] ?? 999) - (ORAL_ORDER[b.category] ?? 999),
    );
  const hairCare = items.filter((r) => r.kind === "hair-care");
  const bodyCare = items.filter((r) => r.kind === "body-care");
  const essentials = items.filter((r) => r.kind === "essentials");
  const miscellaneous = items.filter((r) => r.kind === "miscellaneous");
  const numberSteps =
    routine === "morning" || routine === "evening" || routine === "oral";

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Link
        href="/routine"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
      >
        <ArrowLeft className="h-4 w-4" />
        All routines
      </Link>

      <div className="mt-8 border-b border-stone-300 pb-10 dark:border-stone-800">
        <div className="mb-4 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
          <span className="flex items-baseline gap-2">
            <span className="text-rose-400">❋</span>
            <span>Routine</span>
          </span>
        </div>
        <h1 className="font-serif text-4xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
          {ROUTINE_LABELS[routine]}
          <span className="text-rose-400">.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
          {ROUTINE_DESCRIPTIONS[routine]}
        </p>
        {subroutines.length > 0 && (
          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
            <span className="text-stone-400 dark:text-stone-500">
              Variations:
            </span>
            {subroutines.map((s) => (
              <Link
                key={s.slug}
                href={`/routine/${s.slug}`}
                className="border-b border-transparent pb-px transition-colors hover:border-rose-400 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 dark:hover:text-stone-100"
              >
                {s.label.replace(/^.+?, /, "")}
              </Link>
            ))}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-16 py-12 text-center text-stone-500 dark:text-stone-400">
          Nothing tagged into this routine yet.
        </p>
      ) : (
        <div className="mt-12 space-y-10">
          {skincare.length > 0 && (
            <Section
              label="Skincare"
              items={skincare}
              numbered={numberSteps}
              caption={
                numberSteps
                  ? "In application order. Each step waits ~30 seconds before the next."
                  : undefined
              }
            />
          )}
          {supplements.length > 0 && (
            <Section label="Supplements" items={supplements} />
          )}
          {oralCare.length > 0 && (
            <Section label="Oral care" items={oralCare} />
          )}
          {hairCare.length > 0 && (
            <Section label="Hair care" items={hairCare} />
          )}
          {bodyCare.length > 0 && (
            <Section label="Body care" items={bodyCare} />
          )}
          {essentials.length > 0 && (
            <Section label="Essentials" items={essentials} />
          )}
          {miscellaneous.length > 0 && (
            <Section label="Miscellaneous" items={miscellaneous} />
          )}
          {/* Evening-only: append the once-a-month items as a quiet
              sub-grouping below the daily list. Keeps the peel and
              the dermaplaning razor visible from the evening page
              without misleading the reader into running them daily. */}
          {routine === "evening" && <OnceAMonthSection />}
        </div>
      )}
    </Container>
  );
}

function OnceAMonthSection() {
  const occasional = getReviewsInSubroutine("evening/occasional");
  if (occasional.length === 0) return null;
  return (
    <section className="rounded-2xl border border-stone-200 bg-stone-50/60 p-6 dark:border-stone-800 dark:bg-stone-900/40">
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-stone-200 pb-2 dark:border-stone-800">
        <h2 className="font-display text-2xl font-light tracking-tight text-stone-900 dark:text-stone-100">
          Once a month
        </h2>
        <p className="hidden text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:block dark:text-stone-400">
          Not part of the daily run · staggered cadence
        </p>
      </div>
      <ol className="divide-y divide-stone-100 dark:divide-stone-800">
        {occasional.map((r) => (
          <li key={`${r.kind}-${r.slug}`} className="py-4">
            <Link
              href={`/${r.kind}/${r.slug}`}
              className="group flex items-center gap-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-800 sm:h-20 sm:w-20">
                {r.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.photo}
                    alt={`${r.brand} ${r.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-serif text-xl text-stone-300 dark:text-stone-600">
                    {r.brand.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                  {r.brand} · {r.category}
                </p>
                <h3 className="mt-0.5 font-serif text-lg text-stone-900 transition-colors group-hover:text-rose-700 dark:text-stone-100 dark:group-hover:text-rose-400">
                  {r.name}
                </h3>
                {r.routineNote && (
                  <p className="mt-0.5 font-serif text-[13px] italic leading-snug text-stone-500 dark:text-stone-400">
                    {r.routineNote}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] italic text-stone-400 dark:text-stone-500">
                {r.verdict ?? "testing"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Section({
  label,
  items,
  numbered = false,
  caption,
}: {
  label: string;
  items: ReturnType<typeof getReviewsInRoutine>;
  numbered?: boolean;
  caption?: string;
}) {
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-stone-200 pb-2 dark:border-stone-800">
        <h2 className="font-display text-3xl font-light tracking-tight text-stone-900 dark:text-stone-100">
          {label}
        </h2>
        {caption && (
          <p className="hidden text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:block dark:text-stone-400">
            {caption}
          </p>
        )}
      </div>
      <ol className="divide-y divide-stone-100 dark:divide-stone-800">
        {items.map((r, i) => (
          <li key={`${r.kind}-${r.slug}`} className="py-4">
            <Link
              href={`/${r.kind}/${r.slug}`}
              className="group flex items-center gap-4"
            >
              {numbered && (
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white font-mono text-[11px] tabular-nums text-stone-500 transition-colors group-hover:border-rose-300 group-hover:text-rose-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:group-hover:border-rose-700 dark:group-hover:text-rose-400"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              {/* Thumbnail. Real photo when present, else a serif brand
                  monogram on a stone tile, so every row reads visually
                  rather than as a wall of text. */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-800 sm:h-20 sm:w-20">
                {r.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.photo}
                    alt={`${r.brand} ${r.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-serif text-xl text-stone-300 dark:text-stone-600">
                    {r.brand.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                  {r.brand} · {r.category}
                </p>
                <h3 className="mt-0.5 font-serif text-lg text-stone-900 transition-colors group-hover:text-rose-700 dark:text-stone-100 dark:group-hover:text-rose-400">
                  {r.name}
                </h3>
                {r.routineNote && (
                  <p className="mt-0.5 font-serif text-[13px] italic leading-snug text-stone-500 dark:text-stone-400">
                    {r.routineNote}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] italic text-stone-400 dark:text-stone-500">
                {r.verdict ?? "testing"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
