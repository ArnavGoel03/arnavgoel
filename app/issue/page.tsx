import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import {
  formatPeriodLabel,
  getAllIssuePeriods,
  getIssueForPeriod,
} from "@/lib/issues";

export const metadata: Metadata = {
  title: "Issues",
  description:
    "Monthly digest, what landed on the site, what moved off the shelf, and what's still on trial.",
  alternates: { canonical: "/issue" },
};

export default function IssueIndexPage() {
  const periods = getAllIssuePeriods();
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="max-w-4xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>The archive</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">{today}</span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-8xl dark:text-stone-100">
        Issues<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl dark:text-stone-300">
        A running index of each month, every product, note, and primer that
        landed here, grouped by when it joined the shelf.
      </p>

      {periods.length === 0 ? (
        <p className="mt-16 py-12 text-center text-stone-500 dark:text-stone-400">
          Nothing archived yet. Come back at the end of the month.
        </p>
      ) : (
        <ol className="mt-16 divide-y divide-stone-200 border-t border-stone-300 dark:border-stone-800 dark:divide-stone-800">
          {periods.map((period, i) => {
            const issue = getIssueForPeriod(period)!;
            const count =
              issue.reviews.length +
              issue.notes.length +
              issue.primers.length;
            return (
              <li key={period}>
                <Link
                  href={`/issue/${period}`}
                  className="group flex items-baseline gap-6 py-6"
                >
                  <span className="hidden w-14 shrink-0 font-mono text-xs text-stone-400 tabular-nums sm:inline-block dark:text-stone-500">
                    №&nbsp;{String(periods.length - i).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-2xl leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-rose-700 sm:text-3xl dark:text-stone-100">
                      {formatPeriodLabel(period)}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                      {issue.reviews.length} reviews
                      {issue.notes.length > 0 &&
                        ` · ${issue.notes.length} notes`}
                      {issue.primers.length > 0 &&
                        ` · ${issue.primers.length} primers`}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                    {count} item{count === 1 ? "" : "s"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </Container>
  );
}
