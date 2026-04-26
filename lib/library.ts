import fs from "node:fs";
import path from "node:path";

/**
 * /library data: books and films/series the user is currently in,
 * has finished, or has abandoned. Stored in content/_library.json so
 * the user owns and edits the data directly (or via /admin) instead
 * of it living in a TypeScript constant that drifts out of sync with
 * what they're actually reading and watching.
 *
 * Status meanings:
 *   "current"   — actively reading / watching now
 *   "finished"  — done, with a one-line verdict
 *   "abandoned" — gave up partway, with a reason
 */

export type LibraryItem = {
  title: string;
  by: string;
  status: "current" | "finished" | "abandoned";
  rating?: "loved" | "liked" | "okay" | "skip";
  date?: string;
  note?: string;
  link?: string;
};

export type LibraryData = {
  reading: LibraryItem[];
  watching: LibraryItem[];
};

const DATA_PATH = path.join(process.cwd(), "content", "_library.json");

export function getLibrary(): LibraryData {
  try {
    if (!fs.existsSync(DATA_PATH)) return { reading: [], watching: [] };
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<LibraryData>;
    return {
      reading: parsed.reading ?? [],
      watching: parsed.watching ?? [],
    };
  } catch {
    return { reading: [], watching: [] };
  }
}
