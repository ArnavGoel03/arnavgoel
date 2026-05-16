import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { commitRepoFile, readRepoFile } from "@/lib/github";
import { createLimiter } from "@/lib/rate-limit";

// Reuse for commit-message email pseudonymization.
function emailFingerprint(email: string): string {
  return createHash("sha256").update(email).digest("hex").slice(0, 12);
}

// Vercel guarantees the real client IP is in `x-real-ip`, or as the
// RIGHTMOST entry in `x-forwarded-for` (Vercel appends it). Reading the
// leftmost entry trusts the caller and lets a bot rotate fake IPs to
// bypass rate-limiting.
function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const tail = xff.split(",").at(-1)?.trim();
    if (tail) return tail;
  }
  return "0.0.0.0";
}

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
  // `ip` and `ua` fields were removed in the red-team pass — they were
  // PII committed to git history. Older entries in the repo may still
  // carry them and that's fine; the JSON parse keeps unknown fields.
};

// Upstash-backed when KV_REST_API_* / UPSTASH_REDIS_REST_* env vars are
// set in prod; per-instance Map fallback otherwise. 4 requests/min/IP.
const limit = createLimiter({ name: "subscribe", max: 4, windowSeconds: 60 });

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

  // Honeypot: any value at all on this field is a bot. Previous check
  // only fired on non-empty strings, so JSON clients sending booleans,
  // numbers, or arrays trivially bypassed it.
  if (body.companion != null && body.companion !== "") {
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
      ? // Strip CR/LF/TAB so user-supplied source can't inject extra lines
        // (Co-Authored-By trailers, Signed-off-by) into the commit message.
        body.source.trim().replace(/[\r\n\t]/g, " ")
      : "site";

  const ip = clientIp(req);
  const gate = await limit(ip);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Slow down a moment, then try again." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } },
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
  // IP + UA are PII; do NOT persist them to the repo (where they end up
  // in commit history forever). Log to stderr for abuse investigation —
  // Vercel function logs are visible only to the project owner.
  console.info("subscribe", { ip, ua, emailFp: emailFingerprint(emailRaw) });

  const entry: Subscriber = {
    id: crypto.randomUUID(),
    email: emailRaw,
    source,
    confirmed: false,
    unsubscribed: false,
    unsubscribeToken: crypto.randomUUID(),
    confirmToken: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...existing].slice(0, 50_000);

  try {
    await commitRepoFile({
      path: SUBSCRIBERS_PATH,
      content: JSON.stringify(next, null, 2) + "\n",
      // Commit messages are public if the repo is public, so use a hash
      // instead of the raw email. The fingerprint is stable across
      // re-subscribes for the same email but isn't reversible.
      message: `subscribe: ${emailFingerprint(emailRaw)} via ${source}`,
    });
  } catch (err) {
    console.error("subscribe commit failed:", err);
    return NextResponse.json(
      { error: "Could not save. Try again later." },
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
