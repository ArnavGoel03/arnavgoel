import { NextResponse } from "next/server";
import { commitRepoFile, readRepoFile } from "@/lib/github";

/**
 * Private reader-feedback inbox. Submissions land in
 * content/_inbox.json (a single append-only JSON array) via a GitHub
 * commit so the inbox is durable even if the runtime KV layer changes.
 *
 * Public form -> POST /api/inbox -> commitRepoFile -> /admin/inbox.
 *
 * Reasons for the JSON-in-repo design over a database:
 *   - the dataset is tiny and infrequent;
 *   - the author already has a GitHub commit pipeline wired (admin
 *     uses the same primitive);
 *   - keeping content in the repo means it survives any redeploy or
 *     project move without a separate backup story.
 *
 * Spam controls:
 *   - honeypot field "companion" (bots fill every input);
 *   - hard cap on note length (2000 chars) and name length (120);
 *   - per-IP, per-minute throttle via an in-memory map (resets across
 *     deploys, which is fine for the volume this site sees).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INBOX_PATH = "content/_inbox.json";

type InboxEntry = {
  id: string;
  kind: string;
  slug: string;
  name?: string;
  note: string;
  createdAt: string;
  read: boolean;
  ip?: string;
  ua?: string;
};

type Body = {
  kind?: unknown;
  slug?: unknown;
  name?: unknown;
  note?: unknown;
  companion?: unknown;
};

const VALID_KINDS = new Set([
  "skincare",
  "supplements",
  "oral-care",
  "hair-care",
  "body-care",
  "essentials",
  "miscellaneous",
]);

// Per-IP rate-limit: max 4 submissions per 60s.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 4;
const ipHits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) {
    ipHits.set(ip, arr);
    return true;
  }
  arr.push(now);
  ipHits.set(ip, arr);
  return false;
}

function asString(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }

  // Honeypot: any non-empty value is a bot.
  if (typeof body.companion === "string" && body.companion.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const note = asString(body.note, 2000);
  if (!note || note.length < 4) {
    return NextResponse.json(
      { error: "Notes need to be between 4 and 2000 characters." },
      { status: 400 },
    );
  }

  const kind = typeof body.kind === "string" ? body.kind : "";
  const slug = typeof body.slug === "string" ? body.slug : "";
  if (!VALID_KINDS.has(kind) || !/^[a-z0-9-]{2,120}$/.test(slug)) {
    return NextResponse.json(
      { error: "Unknown product reference." },
      { status: 400 },
    );
  }

  const name = asString(body.name, 120) ?? undefined;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Slow down a moment, then try again." },
      { status: 429 },
    );
  }

  const ua = req.headers.get("user-agent") ?? undefined;

  const entry: InboxEntry = {
    id: crypto.randomUUID(),
    kind,
    slug,
    name,
    note,
    createdAt: new Date().toISOString(),
    read: false,
    ip,
    ua,
  };

  let existing: InboxEntry[] = [];
  try {
    const raw = await readRepoFile(INBOX_PATH);
    if (raw) existing = JSON.parse(raw) as InboxEntry[];
  } catch {
    // First write, file does not exist yet.
  }
  const next = [entry, ...existing].slice(0, 5000); // hard cap

  try {
    await commitRepoFile({
      path: INBOX_PATH,
      content: JSON.stringify(next, null, 2) + "\n",
      message: `inbox: note on ${kind}/${slug}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not save: ${(err as Error).message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
