import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import {
  ROUTINE_DESCRIPTIONS,
  ROUTINE_LABELS,
  getReviewsInRoutine,
  getRoutinesList,
  type RoutineSlug,
} from "@/lib/routines";

type Props = { params: Promise<{ slug: string }> };

const VALID: RoutineSlug[] = ["morning", "evening", "stack"];

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

  const skincare = items.filter((r) => r.kind === "skincare");
  const supplements = items.filter((r) => r.kind === "supplements");
  const oralCare = items.filter((r) => r.kind === "oral-care");

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <Link
        href="/routine"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All routines
      </Link>

      <div className="mt-8 border-b border-stone-300 pb-10">
        <div className="mb-4 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
          <span className="flex items-baseline gap-2">
            <span className="text-rose-400">❋</span>
            <span>Routine</span>
          </span>
        </div>
        <h1 className="font-serif text-4xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl">
          {ROUTINE_LABELS[routine]}
          <span className="text-rose-400">.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl">
          {ROUTINE_DESCRIPTIONS[routine]}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-16 py-12 text-center text-stone-500">
          Nothing tagged into this routine yet.
        </p>
      ) : (
        <div className="mt-12 space-y-10">
          {skincare.length > 0 && (
            <Section label="Skincare" items={skincare} />
          )}
          {supplements.length > 0 && (
            <Section label="Supplements" items={supplements} />
          )}
          {oralCare.length > 0 && (
            <Section label="Oral care" items={oralCare} />
          )}
        </div>
      )}
    </Container>
  );
}

function Section({
  label,
  items,
}: {
  label: string;
  items: ReturnType<typeof getReviewsInRoutine>;
}) {
  return (
    <section>
      <h2 className="mb-4 border-b border-stone-200 pb-2 font-display text-3xl font-light tracking-tight text-stone-900">
        {label}
      </h2>
      <ol className="divide-y divide-stone-100">
        {items.map((r) => (
          <li key={`${r.kind}-${r.slug}`} className="py-4">
            <Link
              href={`/${r.kind}/${r.slug}`}
              className="group flex items-baseline justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                  {r.brand} · {r.category}
                </p>
                <h3 className="mt-0.5 font-serif text-lg text-stone-900 transition-colors group-hover:text-rose-700">
                  {r.name}
                </h3>
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] italic text-stone-400">
                {r.verdict ?? "testing"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
