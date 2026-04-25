import { NextResponse } from "next/server";
import { commitRepoFile, readRepoFile } from "@/lib/github";

/**
 * Email-subscription endpoint.
 *
 * Storage is content/_subscribers.json, append-only via GitHub commit
 * (same primitive admin uses). Each entry holds the email, the source
 * page that captured it, an unsubscribe token, and confirmed/unsubbed
 * flags. Double-opt-in via Resend hooks in once RESEND_API_KEY is set;
 * until then the entry is created with `confirmed: false` and the
 * weekly digest sender skips unconfirmed addresses.
 *
 * Spam controls:
 *   - honeypot field "companion" (always-empty visually-hidden input);
 *   - per-IP, per-minute throttle (4/min);
 *   - email regex + length cap;
 *   - existing-email idempotent (returns ok without re-committing).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUBSCRIBERS_PATH = "content/_subscribers.json";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254; // RFC 5321 limit

type Subscriber = {
  id: string;
  email: string;
  source: string;
  confirmed: boolean;
  unsubscribed: boolean;
  unsubscribeToken: string;
  confirmToken: string;
  createdAt: string;
  ip?: string;
  ua?: string;
};

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

async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await readRepoFile(SUBSCRIBERS_PATH);
    if (!raw) return [];
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: { email?: unknown; source?: unknown; companion?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }

  if (typeof body.companion === "string" && body.companion.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!emailRaw || emailRaw.length > MAX_EMAIL_LEN || !EMAIL_RE.test(emailRaw)) {
    return NextResponse.json(
      { error: "That email looks off. Try again." },
      { status: 400 },
    );
  }

  const source =
    typeof body.source === "string" && body.source.length <= 60
      ? body.source.trim()
      : "site";

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

  const existing = await loadSubscribers();
  const dup = existing.find((s) => s.email === emailRaw && !s.unsubscribed);
  if (dup) {
    // Treat as success so the form does not leak which addresses are
    // already on the list.
    return NextResponse.json({ ok: true });
  }

  const ua = req.headers.get("user-agent") ?? undefined;
  const entry: Subscriber = {
    id: crypto.randomUUID(),
    email: emailRaw,
    source,
    confirmed: false,
    unsubscribed: false,
    unsubscribeToken: crypto.randomUUID(),
    confirmToken: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ip,
    ua,
  };
  const next = [entry, ...existing].slice(0, 50_000);

  try {
    await commitRepoFile({
      path: SUBSCRIBERS_PATH,
      content: JSON.stringify(next, null, 2) + "\n",
      message: `subscribe: ${emailRaw} via ${source}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not save: ${(err as Error).message}` },
      { status: 500 },
    );
  }

  // Resend hook lands here when RESEND_API_KEY is configured. Until
  // then, the address is on the list with confirmed:false and the
  // weekly sender will skip it gracefully.
  if (process.env.RESEND_API_KEY) {
    try {
      const confirmUrl = `${new URL(req.url).origin}/api/subscribe/confirm?token=${entry.confirmToken}`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.RESEND_FROM ??
            "Yash <hello@yashgoel.com>",
          to: emailRaw,
          subject: "Confirm your subscription",
          text:
            `Tap to confirm you want new reviews from yashgoel.com:\n\n${confirmUrl}\n\n` +
            `If this was not you, ignore this email; nothing happens until you tap.`,
        }),
      });
    } catch {
      // Subscription is already saved; failing to send the confirm
      // email is recoverable (we can resend later).
    }
  }

  return NextResponse.json({ ok: true });
}
