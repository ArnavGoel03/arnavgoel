import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import {
  formatPeriodLabel,
  getAllIssuePeriods,
  getIssueForPeriod,
} from "@/lib/issues";
import type { ReviewSummary } from "@/lib/types";

type Props = { params: Promise<{ period: string }> };

export async function generateStaticParams() {
  return getAllIssuePeriods().map((period) => ({ period }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { period } = await params;
  const issue = getIssueForPeriod(period);
  if (!issue) return {};
  const label = formatPeriodLabel(period);
  const count =
    issue.reviews.length + issue.notes.length + issue.primers.length;
  return {
    title: `${label} · Issue`,
    description: `${count} items landed on the site in ${label}: reviews, notes, and primers.`,
    alternates: { canonical: `/issue/${period}` },
  };
}

function ReviewLink({ review }: { review: ReviewSummary }) {
  return (
    <li className="py-3">
      <Link
        href={`/${review.kind}/${review.slug}`}
        className="group flex items-baseline justify-between gap-4"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
            {review.brand} · {review.category}
          </p>
          <h4 className="mt-0.5 font-serif text-lg text-stone-900 transition-colors group-hover:text-rose-700 dark:group-hover:text-rose-400 dark:text-stone-100">
            {review.name}
          </h4>
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] italic text-stone-400 dark:text-stone-500">
          {review.verdict ?? "testing"}
        </span>
      </Link>
    </li>
  );
}

export default async function IssuePage({ params }: Props) {
  const { period } = await params;
  const issue = getIssueForPeriod(period);
  if (!issue) notFound();

  const skincare = issue.reviews.filter((r) => r.kind === "skincare");
  const supplements = issue.reviews.filter((r) => r.kind === "supplements");
  const oralCare = issue.reviews.filter((r) => r.kind === "oral-care");

  const label = formatPeriodLabel(period);

  return (
    <Container className="max-w-4xl py-12 sm:py-16">
      <Link
        href="/issue"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
      >
        <ArrowLeft className="h-4 w-4" />
        All issues
      </Link>

      <div className="mt-8 border-b border-stone-300 pb-10 dark:border-stone-800">
        <div className="mb-4 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
          <span className="flex items-baseline gap-2">
            <span className="text-rose-400">❋</span>
            <span>Issue</span>
          </span>
          <span className="font-mono text-stone-400 dark:text-stone-500">{period}</span>
        </div>
        <h1 className="font-serif text-4xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
          {label}
          <span className="text-rose-400">.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl dark:text-stone-300">
          What landed in {label}, every product, note, and primer, in one
          place.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {skincare.length > 0 && (
          <section>
            <h2 className="mb-4 border-b border-stone-200 pb-2 font-display text-3xl font-light tracking-tight text-stone-900 dark:text-stone-100 dark:border-stone-800">
              Skincare
            </h2>
            <ol className="divide-y divide-stone-100 dark:divide-stone-800">
              {skincare.map((r) => (
                <ReviewLink key={r.slug} review={r} />
              ))}
            </ol>
          </section>
        )}

        {supplements.length > 0 && (
          <section>
            <h2 className="mb-4 border-b border-stone-200 pb-2 font-display text-3xl font-light tracking-tight text-stone-900 dark:text-stone-100 dark:border-stone-800">
              Supplements
            </h2>
            <ol className="divide-y divide-stone-100 dark:divide-stone-800">
              {supplements.map((r) => (
                <ReviewLink key={r.slug} review={r} />
              ))}
            </ol>
          </section>
        )}

        {oralCare.length > 0 && (
          <section>
            <h2 className="mb-4 border-b border-stone-200 pb-2 font-display text-3xl font-light tracking-tight text-stone-900 dark:text-stone-100 dark:border-stone-800">
              Oral care
            </h2>
            <ol className="divide-y divide-stone-100 dark:divide-stone-800">
              {oralCare.map((r) => (
                <ReviewLink key={r.slug} review={r} />
              ))}
            </ol>
          </section>
        )}

        {issue.primers.length > 0 && (
          <section>
            <h2 className="mb-4 border-b border-stone-200 pb-2 font-display text-3xl font-light tracking-tight text-stone-900 dark:text-stone-100 dark:border-stone-800">
              Primers
            </h2>
            <ol className="divide-y divide-stone-100 dark:divide-stone-800">
              {issue.primers.map((p) => (
                <li key={p.slug} className="py-3">
                  <Link
                    href={`/primers/${p.slug}`}
                    className="group flex items-baseline justify-between gap-4"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                        {p.domain} · {p.kind}
                      </p>
                      <h4 className="mt-0.5 font-serif text-lg text-stone-900 transition-colors group-hover:text-rose-700 dark:group-hover:text-rose-400 dark:text-stone-100">
                        {p.title}
                      </h4>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {issue.notes.length > 0 && (
          <section>
            <h2 className="mb-4 border-b border-stone-200 pb-2 font-display text-3xl font-light tracking-tight text-stone-900 dark:text-stone-100 dark:border-stone-800">
              Notes
            </h2>
            <ol className="divide-y divide-stone-100 dark:divide-stone-800">
              {issue.notes.map((n) => (
                <li key={n.slug} className="py-3">
                  <Link
                    href={`/notes/${n.slug}`}
                    className="group flex items-baseline justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-serif text-lg text-stone-900 transition-colors group-hover:text-rose-700 dark:group-hover:text-rose-400 dark:text-stone-100">
                        {n.title}
                      </h4>
                      {n.description && (
                        <p className="mt-0.5 text-sm text-stone-600 dark:text-stone-300">
                          {n.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </Container>
  );
}
