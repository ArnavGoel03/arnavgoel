import { getAllReviewsWithBody, getPrimers } from "@/lib/content";

export type SearchItemType = "review" | "primer";

export type SearchItem = {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string; // brand / domain / tags, secondary display
  href: string;
  /** Lower-cased concatenation of every field that should match a query. */
  haystack: string;
  /**
   * Plain-text body excerpt used for snippet generation in /search.
   * Strips markdown / MDX noise so highlighted snippets read as
   * editorial copy rather than raw source. Capped at 1.5 KB per
   * item to keep the index payload reasonable across the catalog.
   */
  body: string;
  verdict?: "recommend" | "okay" | "bad";
  category?: string;
};

function norm(s: string | undefined | null): string {
  return (s ?? "").toLowerCase();
}

/**
 * Cheap markdown / MDX → plain text. Good enough for snippets, not
 * a full markdown parser. Order matters — strip code first so its
 * inline backticks don't survive other passes.
 */
function plainText(src: string, max = 1500): string {
  let s = src;
  s = s.replace(/```[\s\S]*?```/g, " "); // fenced code
  s = s.replace(/`[^`]*`/g, " "); // inline code
  s = s.replace(/<[^>]+>/g, " "); // MDX / HTML tags
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, " "); // images
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1"); // links → keep label
  s = s.replace(/^#{1,6}\s+/gm, ""); // heading hashes
  s = s.replace(/[*_~]+/g, ""); // emphasis markers
  s = s.replace(/\s+/g, " ").trim();
  return s.slice(0, max);
}

export function buildSearchIndex(): SearchItem[] {
  const out: SearchItem[] = [];

  for (const r of getAllReviewsWithBody()) {
    const body = plainText(r.body ?? "");
    out.push({
      id: `review:${r.kind}/${r.slug}`,
      type: "review",
      title: r.name,
      subtitle: `${r.brand} · ${r.category}`,
      href: `/${r.kind}/${r.slug}`,
      haystack: [
        r.name,
        r.brand,
        r.category,
        r.kind,
        r.summary,
        body,
        ...(r.ingredients ?? []),
        ...(r.skinType ?? []),
        ...(r.goal ?? []),
      ]
        .map(norm)
        .filter(Boolean)
        .join(" "),
      body,
      verdict: r.verdict,
      category: r.category,
    });
  }

  for (const p of getPrimers()) {
    const body = plainText(p.body ?? "");
    out.push({
      id: `primer:${p.slug}`,
      type: "primer",
      title: p.title,
      subtitle: `Primer · ${p.domain} · ${p.kind}`,
      href: `/primers/${p.slug}`,
      haystack: [
        p.title,
        p.subtitle,
        p.domain,
        p.kind,
        body,
        ...p.tags,
        ...p.stack,
      ]
        .map(norm)
        .filter(Boolean)
        .join(" "),
      body,
    });
  }

  return out;
}
