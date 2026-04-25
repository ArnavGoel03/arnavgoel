import type { Kind } from "@/lib/types";

/** URL-encoded compare ID: "kind/slug" (e.g. "supplements/magtein-l-threonate"). */
export type CompareId = string;

export function toCompareId(kind: Kind, slug: string): CompareId {
  return `${kind}/${slug}`;
}

export function parseCompareId(id: CompareId): { kind: Kind; slug: string } | null {
  const [kind, ...rest] = id.split("/");
  const slug = rest.join("/");
  if (!slug) return null;
  if (
    kind !== "skincare" &&
    kind !== "supplements" &&
    kind !== "oral-care" &&
    kind !== "hair-care" &&
    kind !== "body-care" &&
    kind !== "essentials"
  )
    return null;
  return { kind: kind as Kind, slug };
}

export function parseIdsParam(raw: string | string[] | undefined): CompareId[] {
  const str = Array.isArray(raw) ? raw.join(",") : raw;
  if (!str) return [];
  return Array.from(
    new Set(
      str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ).slice(0, 8); // sanity cap
}

