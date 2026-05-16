/**
 * Sliding-window rate limiter, Upstash Redis when available, in-memory
 * fallback when not.
 *
 * Why Upstash: the previous in-memory `ipHits` map reset on every Vercel
 * cold start and didn't share state across regions or warm instances —
 * which meant the rate limiter was a deterrent at best. Upstash via
 * the Vercel Marketplace is a sub-200ms HTTP API with global
 * replication, perfect for per-IP counters.
 *
 * To enable, provision Upstash Redis from the Vercel Marketplace:
 *   https://vercel.com/marketplace/upstash
 * Then `vercel env pull .env.local` to pick up `KV_REST_API_URL` and
 * `KV_REST_API_TOKEN` (or the new `UPSTASH_REDIS_REST_*` names — both
 * naming schemes are supported here).
 *
 * Without those env vars the limiter falls back to the per-instance
 * in-memory Map so dev/preview deployments still throttle a bit and
 * the build never fails. Production should always have Upstash wired.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export type Limiter = (ip: string) => Promise<RateLimitResult>;

/**
 * Build a limiter that allows `max` requests per `windowSeconds` per IP.
 * Returns `{ ok: false, retryAfterSeconds }` when exceeded.
 */
export function createLimiter(opts: {
  name: string;
  max: number;
  windowSeconds: number;
}): Limiter {
  const upstash = tryUpstash(opts);
  if (upstash) return upstash;

  // ── In-memory fallback ────────────────────────────────────────────
  // Per-instance Map — survives across calls inside the same Vercel
  // function instance but resets on cold start. Good enough for dev /
  // preview and as a soft deterrent if Upstash ever returns errors.
  const hits = new Map<string, number[]>();
  const windowMs = opts.windowSeconds * 1000;
  return async (ip: string): Promise<RateLimitResult> => {
    const now = Date.now();
    const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    if (arr.length >= opts.max) {
      hits.set(ip, arr);
      const oldest = arr[0]!;
      return { ok: false, retryAfterSeconds: Math.ceil((oldest + windowMs - now) / 1000) };
    }
    arr.push(now);
    hits.set(ip, arr);
    return { ok: true };
  };
}

function tryUpstash(opts: {
  name: string;
  max: number;
  windowSeconds: number;
}): Limiter | null {
  // Accept either the Vercel-KV naming or the canonical Upstash naming.
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(opts.max, `${opts.windowSeconds} s`),
    prefix: `rl:${opts.name}`,
    analytics: false,
  });
  return async (ip: string): Promise<RateLimitResult> => {
    try {
      const r = await limiter.limit(ip);
      if (r.success) return { ok: true };
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((r.reset - Date.now()) / 1000),
      );
      return { ok: false, retryAfterSeconds };
    } catch (err) {
      // If Upstash itself errors, fail OPEN so a Redis outage doesn't
      // take down sign-ups. The honeypot + email regex still block the
      // common bot cases.
      console.error(`rate-limit ${opts.name} upstash error:`, err);
      return { ok: true };
    }
  };
}
