import {
  getAllReviews,
  getNotes,
  getPrimers,
} from "@/lib/content";
import type { NoteSummary, PrimerSummary, ReviewSummary } from "@/lib/types";

export type IssuePeriod = string; // "YYYY-MM"

export type IssueContents = {
  period: IssuePeriod;
  reviews: ReviewSummary[];
  notes: NoteSummary[];
  primers: PrimerSummary[];
};

function toPeriod(iso: string): IssuePeriod {
  return iso.slice(0, 7);
}

/**
 * All months that have at least one piece of published content,
 * sorted newest-first.
 */
export function getAllIssuePeriods(): IssuePeriod[] {
  const set = new Set<IssuePeriod>();
  for (const r of getAllReviews()) set.add(toPeriod(r.datePublished));
  for (const n of getNotes()) set.add(toPeriod(n.datePublished));
  for (const p of getPrimers()) set.add(toPeriod(p.datePublished));
  return [...set].sort((a, b) => b.localeCompare(a));
}

export function getIssueForPeriod(period: IssuePeriod): IssueContents | null {
  if (!/^\d{4}-\d{2}$/.test(period)) return null;

  const reviews = getAllReviews().filter(
    (r) => toPeriod(r.datePublished) === period,
  );
  const notes = getNotes().filter((n) => toPeriod(n.datePublished) === period);
  const primers = getPrimers().filter(
    (p) => toPeriod(p.datePublished) === period,
  );

  if (
    reviews.length === 0 &&
    notes.length === 0 &&
    primers.length === 0
  ) {
    return null;
  }

  return { period, reviews, notes, primers };
}

/** Human label for an issue. "2026-04" → "April 2026". */
export function formatPeriodLabel(period: IssuePeriod): string {
  const [y, m] = period.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** Short slug for in-text references. "April 2026" → "Apr '26". */
export function formatPeriodShort(period: IssuePeriod): string {
  const [y, m] = period.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  return `${month} '${y.slice(-2)}`;
}
