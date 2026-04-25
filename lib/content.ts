import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { noteFrontmatter, primerFrontmatter, reviewFrontmatter } from "./schema";
import type {
  Kind,
  Note,
  NoteSummary,
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

function readNotes(): Note[] {
  const dir = path.join(ROOT, "notes");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const fm = noteFrontmatter.parse(data);
    const slug = file.replace(/\.mdx$/, "");
    return { slug, body: content.trim(), ...fm };
  });
}

function sortByDateDesc<T extends { datePublished: string }>(list: T[]): T[] {
  return [...list].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}

/**
 * Stable lift of photoed reviews to the top of the list. Visual grid
 * reads as a portfolio when the cards with real product shots come
 * first; the watermark-only cards form a quieter tail. Pair this after
 * sortByDateDesc so the within-group order stays "recent first."
 */
function sortPhotoFirst<T extends { photo?: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const ap = a.photo ? 0 : 1;
    const bp = b.photo ? 0 : 1;
    return ap - bp;
  });
}

/**
 * Public-facing listings exclude any review with `hidden: true` in its
 * frontmatter. The `/admin` dashboard uses `getAllReviewsIncludingHidden()` so
 * the author can still toggle them back on.
 */
export function getReviews(kind: Kind): ReviewSummary[] {
  return sortPhotoFirst(sortByDateDesc(readReviews(kind)))
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
  ]);
}

export function getAllReviewsIncludingHidden(kind: Kind): ReviewSummary[] {
  return sortByDateDesc(readReviews(kind)).map(
    ({ body: _body, ...rest }) => rest,
  );
}

export function getNotes(): NoteSummary[] {
  return sortByDateDesc(readNotes()).map(({ body: _body, ...rest }) => rest);
}

export function getNote(slug: string): Note | null {
  return readNotes().find((n) => n.slug === slug) ?? null;
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

export function getAdjacentNotes(slug: string): Adjacent<NoteSummary> {
  return findAdjacent(getNotes(), slug);
}
