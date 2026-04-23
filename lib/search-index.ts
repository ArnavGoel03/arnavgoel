import { getAllReviews, getNotes, getPrimers } from "@/lib/content";

export type SearchItemType = "review" | "note" | "primer";

export type SearchItem = {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string; // brand / domain / tags — secondary display
  href: string;
  /** Lower-cased concatenation of every field that should match a query. */
  haystack: string;
  verdict?: "recommend" | "okay" | "bad";
  category?: string;
};

function norm(s: string | undefined | null): string {
  return (s ?? "").toLowerCase();
}

export function buildSearchIndex(): SearchItem[] {
  const out: SearchItem[] = [];

  for (const r of getAllReviews()) {
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
        ...(r.ingredients ?? []),
        ...(r.skinType ?? []),
        ...(r.goal ?? []),
      ]
        .map(norm)
        .filter(Boolean)
        .join(" "),
      verdict: r.verdict,
      category: r.category,
    });
  }

  for (const n of getNotes()) {
    out.push({
      id: `note:${n.slug}`,
      type: "note",
      title: n.title,
      subtitle: `Note · ${n.tags.join(", ") || "writing"}`,
      href: `/notes/${n.slug}`,
      haystack: [n.title, n.description, ...n.tags]
        .map(norm)
        .filter(Boolean)
        .join(" "),
    });
  }

  for (const p of getPrimers()) {
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
        ...p.tags,
        ...p.stack,
      ]
        .map(norm)
        .filter(Boolean)
        .join(" "),
    });
  }

  return out;
}
