import { execSync } from "node:child_process";

/**
 * Pulls the last N commits and shapes them into release-notes-style
 * entries for /changelog. Conventional-prefix detection (Add, Fix,
 * Update, Drop, Refactor, Move, Group, Build, Style, etc.) routes the
 * commit into a labelled bucket; everything else falls through as
 * "Misc".
 *
 * Read at build time. Failures (e.g., running outside a git checkout)
 * are caught and an empty list is returned so the page never crashes.
 */

export type ChangelogEntry = {
  hash: string;
  shortHash: string;
  date: string; // ISO
  title: string;
  body: string;
  bucket: ChangelogBucket;
};

export type ChangelogBucket =
  | "feature"
  | "fix"
  | "polish"
  | "content"
  | "refactor"
  | "chore"
  | "misc";

export const BUCKET_LABEL: Record<ChangelogBucket, string> = {
  feature: "Added",
  fix: "Fixed",
  polish: "Polished",
  content: "Content",
  refactor: "Refactored",
  chore: "Behind the scenes",
  misc: "Other",
};

export const BUCKET_COLOR: Record<ChangelogBucket, string> = {
  feature: "text-emerald-700 dark:text-emerald-400",
  fix: "text-rose-700 dark:text-rose-400",
  polish: "text-sky-700 dark:text-sky-400",
  content: "text-amber-700 dark:text-amber-400",
  refactor: "text-violet-700 dark:text-violet-400",
  chore: "text-stone-500 dark:text-stone-400",
  misc: "text-stone-500 dark:text-stone-400",
};

function classify(title: string): ChangelogBucket {
  const t = title.toLowerCase();
  if (/^(add|introduce|wire|ship|launch)\b/.test(t)) return "feature";
  if (/^(fix|patch|repair|resolve)\b/.test(t)) return "fix";
  if (/^(polish|tidy|improve|refine|tweak|tune|nudge)\b/.test(t)) return "polish";
  if (/^(rename|refactor|restructure|reorg|move|consolidate|merge|split|extract|drop|remove|delete|trim|group)\b/.test(t))
    return "refactor";
  if (/^(content|copy|review|listing|note|photo|update.*review|update.*listing)\b/.test(t))
    return "content";
  if (/^(bump|deps?|chore|build|ci|workflow|cron)\b/.test(t)) return "chore";
  return "misc";
}

export function getChangelog(limit = 100): ChangelogEntry[] {
  try {
    const sep = "<<<COMMIT>>>";
    const fieldSep = "<<<F>>>";
    const fmt = `%H${fieldSep}%h${fieldSep}%aI${fieldSep}%s${fieldSep}%b${sep}`;
    const raw = execSync(
      `git log --no-merges -n ${limit} --pretty=format:'${fmt}' --no-color`,
      { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
    );
    const out: ChangelogEntry[] = [];
    for (const block of raw.split(sep)) {
      const trimmed = block.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(fieldSep);
      if (parts.length < 4) continue;
      const [hash, shortHash, date, title, ...rest] = parts;
      const body = rest.join(fieldSep).trim();
      // Strip Claude trailer noise from body so it never leaks to the
      // public page.
      const cleanedBody = body
        .replace(/Co-Authored-By:[^\n]*\n?/g, "")
        .trim();
      out.push({
        hash,
        shortHash,
        date,
        title,
        body: cleanedBody,
        bucket: classify(title),
      });
    }
    return out;
  } catch {
    return [];
  }
}

export function groupByMonth(entries: ChangelogEntry[]): {
  month: string;
  label: string;
  entries: ChangelogEntry[];
}[] {
  const groups = new Map<string, ChangelogEntry[]>();
  for (const e of entries) {
    const d = new Date(e.date);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => {
      const [y, m] = key.split("-");
      const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" },
      );
      return { month: key, label, entries: items };
    });
}
