import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { primerFrontmatter, reviewFrontmatter } from "./schema";
import type {
  Kind,
  Primer,
  PrimerSummary,
  Review,
  ReviewSummary,
} from "./types";

const ROOT = path.join(process.cwd(), "content");

function readReviews(kind: Kind): Review[] {
  const dir = path.join(ROOT, kind);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const fm = reviewFrontmatter.parse(data);
    const slug = file.replace(/\.mdx$/, "");
    return { kind, slug, body: content.trim(), ...fm };
  });
}

function sortByDateDesc<T extends { datePublished: string }>(list: T[]): T[] {
  return [...list].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}

/**
 * Internal ranking score. Folds every signal that should influence the
 * order of a category listing into a single number. Higher = surfaces
 * sooner. Never rendered to the reader — used only for sort.
 *
 * Weights (chosen so the rules dominate ties):
 *   verdict      recommend +60 · okay +25 · testing 0 · bad −40
 *   routines     present in any routine: +30
 *                (the morning / evening / stack / shower shelves are
 *                what I actually reach for, so anything that earned a
 *                slot there should outrank anything that didn't)
 *   photo        +8 (photographed cards read as portfolio first; the
 *                watermark cards form a quieter tail)
 *   recency      0..15, tapered linearly across the last 365 days off
 *                `datePublished`; older entries bottom out at 0
 *
 * Recency is the smallest term on purpose — it only breaks ties between
 * otherwise-equal items. A photographed recommend from a year ago will
 * still beat a brand-new still-testing entry.
 */
const VERDICT_SCORE: Record<string, number> = {
  recommend: 60,
  okay: 25,
  bad: -40,
};

function recencyBoost(datePublished: string): number {
  const t = Date.parse(datePublished);
  if (Number.isNaN(t)) return 0;
  const days = (Date.now() - t) / 86_400_000;
  if (days <= 0) return 15;
  if (days >= 365) return 0;
  return 15 * (1 - days / 365);
}

type Rankable = {
  verdict?: string;
  routines?: string[];
  photo?: string;
  datePublished: string;
};

function getRankingScore(r: Rankable): number {
  let score = 0;
  if (r.verdict && VERDICT_SCORE[r.verdict] !== undefined) {
    score += VERDICT_SCORE[r.verdict];
  }
  if (Array.isArray(r.routines) && r.routines.length > 0) {
    score += 30;
  }
  if (r.photo) score += 8;
  score += recencyBoost(r.datePublished);
  return score;
}

function sortByScore<T extends Rankable>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const diff = getRankingScore(b) - getRankingScore(a);
    if (diff !== 0) return diff;
    return b.datePublished.localeCompare(a.datePublished);
  });
}

/**
 * Public-facing listings exclude any review with `hidden: true` in its
 * frontmatter. The `/admin` dashboard uses `getAllReviewsIncludingHidden()` so
 * the author can still toggle them back on.
 */
export function getReviews(kind: Kind): ReviewSummary[] {
  return sortByScore(readReviews(kind))
    .filter((r) => !r.hidden && !r.retired)
    .map(({ body: _body, ...rest }) => rest);
}

export function getRetiredReviews(): ReviewSummary[] {
  return sortByDateDesc([
    ...readReviews("skincare"),
    ...readReviews("supplements"),
    ...readReviews("oral-care"),
    ...readReviews("hair-care"),
    ...readReviews("body-care"),
    ...readReviews("essentials"),
    ...readReviews("miscellaneous"),
  ])
    .filter((r) => r.retired && !r.hidden)
    .map(({ body: _body, ...rest }) => rest);
}

export function getReview(kind: Kind, slug: string): Review | null {
  return readReviews(kind).find((r) => r.slug === slug) ?? null;
}

export function getAllReviews(): ReviewSummary[] {
  return sortByDateDesc([
    ...getReviews("skincare"),
    ...getReviews("supplements"),
    ...getReviews("oral-care"),
    ...getReviews("hair-care"),
    ...getReviews("body-care"),
    ...getReviews("essentials"),
    ...getReviews("miscellaneous"),
  ]);
}

export function getAllReviewsIncludingHidden(kind: Kind): ReviewSummary[] {
  return sortByDateDesc(readReviews(kind)).map(
    ({ body: _body, ...rest }) => rest,
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Primers, short, high-signal reference pages on ingredients and stacks.
// ────────────────────────────────────────────────────────────────────────────

function readPrimers(): Primer[] {
  const dir = path.join(ROOT, "primers");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const fm = primerFrontmatter.parse(data);
    const slug = file.replace(/\.mdx$/, "");
    return { slug, body: content.trim(), ...fm };
  });
}

export function getPrimers(): PrimerSummary[] {
  return sortByDateDesc(readPrimers()).map(({ body: _body, ...rest }) => rest);
}

export function getPrimer(slug: string): Primer | null {
  return readPrimers().find((p) => p.slug === slug) ?? null;
}

/** Primers that explicitly reference this product slug via relatedProductSlugs. */
export function getPrimersForProduct(productSlug: string): PrimerSummary[] {
  return getPrimers().filter((p) =>
    p.relatedProductSlugs.includes(productSlug),
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Prev/next navigation helpers. All lists are sorted newest-first by
// datePublished already (sortByDateDesc), so "prev" means older and
// "next" means newer within a content type.
// ────────────────────────────────────────────────────────────────────────────

type Adjacent<T> = { prev: T | null; next: T | null };

function findAdjacent<T extends { slug: string }>(
  list: T[],
  slug: string,
): Adjacent<T> {
  const i = list.findIndex((x) => x.slug === slug);
  if (i === -1) return { prev: null, next: null };
  // list is newest-first; "next" (newer) sits at a lower index, "prev"
  // (older) at a higher one. Present to the reader as prev=older since
  // that's the more natural "keep reading back" direction.
  return {
    next: i > 0 ? list[i - 1] : null,
    prev: i < list.length - 1 ? list[i + 1] : null,
  };
}

export function getAdjacentReviews(
  kind: Kind,
  slug: string,
): Adjacent<ReviewSummary> {
  return findAdjacent(getReviews(kind), slug);
}

export function getAdjacentPrimers(slug: string): Adjacent<PrimerSummary> {
  return findAdjacent(getPrimers(), slug);
}
