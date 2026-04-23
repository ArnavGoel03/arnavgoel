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
 * Public-facing listings exclude any review with `hidden: true` in its
 * frontmatter. The `/admin` dashboard uses `getAllReviewsIncludingHidden()` so
 * the author can still toggle them back on.
 */
export function getReviews(kind: Kind): ReviewSummary[] {
  return sortByDateDesc(readReviews(kind))
    .filter((r) => !r.hidden)
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
// Primers — short, high-signal reference pages on ingredients and stacks.
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
