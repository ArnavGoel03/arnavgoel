import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { frontmatterSchema } from "./schema";
import type { Kind, Review, ReviewSummary } from "./types";

const ROOT = path.join(process.cwd(), "content");

function readKind(kind: Kind): Review[] {
  const dir = path.join(ROOT, kind);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const fm = frontmatterSchema.parse(data);
    const slug = file.replace(/\.mdx$/, "");
    return { kind, slug, body: content.trim(), ...fm };
  });
}

function sortByDateDesc<T extends { datePublished: string }>(list: T[]): T[] {
  return [...list].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}

export function getReviews(kind: Kind): ReviewSummary[] {
  return sortByDateDesc(readKind(kind)).map(({ body: _body, ...rest }) => rest);
}

export function getReview(kind: Kind, slug: string): Review | null {
  const reviews = readKind(kind);
  return reviews.find((r) => r.slug === slug) ?? null;
}

export function getAllReviews(): ReviewSummary[] {
  return sortByDateDesc([...getReviews("skincare"), ...getReviews("supplements")]);
}

export function getCategories(kind: Kind): string[] {
  const set = new Set(getReviews(kind).map((r) => r.category));
  return Array.from(set).sort();
}
