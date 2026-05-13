import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { DEVICE_COOKIE, verifyDeviceCookie } from "@/lib/device-lock";

/**
 * Three-layer gate for /admin/* + hot-link / bot-scraper guard on
 * /_next/image:
 *
 *   /admin:
 *     1. Device cookie  : a one-time HMAC-signed cookie minted by
 *                         /admin/setup-device?token=<ADMIN_DEVICE_SETUP_TOKEN>.
 *                         Missing/invalid means 404, the surface is hidden.
 *     2. Google OAuth   : standard Auth.js session.
 *     3. Email allow    : actions.ts cross-checks the session email against
 *                         ALLOWED_ADMIN_EMAIL before any write.
 *
 *   /_next/image:
 *     1. Bot block      : known AI training crawlers / mass scrapers get
 *                         403'd before they reach the image optimizer.
 *     2. Referer check  : in production, the Referer header must come from
 *                         the canonical site origin. Cross-origin hot-links
 *                         from other sites get 403'd. Empty Referer is OK
 *                         (direct hits / shared deep links shouldn't break).
 *
 * /admin/setup-device is exempt from the device check (it is the device
 * check). /admin/login is exempt from the session check (otherwise it
 * would loop redirecting itself).
 */

const ALLOWED_ORIGINS = [
  "yashgoel.vercel.app",
  "yashgoel.com",
  "www.yashgoel.com",
  "localhost",
  "localhost:3000",
];

// Lowercased substring match — catches User-Agent variants (GPTBot/1.2,
// ClaudeBot/1.0, etc.) without per-version maintenance.
const BLOCKED_UA_TOKENS = [
  "gptbot",
  "chatgpt-user",
  "oai-searchbot",
  "claudebot",
  "claude-web",
  "anthropic-ai",
  "ccbot",
  "google-extended",
  "facebookbot",
  "meta-externalagent",
  "bytespider",
  "perplexitybot",
  "applebot-extended",
  "amazonbot",
  "cohere-ai",
  "diffbot",
  "imagesiftbot",
  "omgilibot",
  "omgili",
  "youbot",
  "mistralai-user",
  "ai2bot",
  "duckassistbot",
  "timpibot",
  "webzio-extended",
  // Generic mass-scrape signals
  "headlesschrome",
  "puppeteer",
  "playwright",
  "phantomjs",
];

function isBlockedUA(ua: string): boolean {
  const lower = ua.toLowerCase();
  return BLOCKED_UA_TOKENS.some((tok) => lower.includes(tok));
}

function isCrossOriginHotlink(referer: string | null, host: string): boolean {
  // Same-origin or no Referer (privacy-conscious browsers, shared links) → OK.
  if (!referer) return false;
  try {
    const url = new URL(referer);
    const refHost = url.host.toLowerCase();
    if (refHost === host.toLowerCase()) return false;
    return !ALLOWED_ORIGINS.includes(refHost);
  } catch {
    return false;
  }
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // ---- /_next/image hot-link + scraper guard ----
  if (pathname.startsWith("/_next/image")) {
    const ua = req.headers.get("user-agent") ?? "";
    if (ua && isBlockedUA(ua)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    // Only enforce Referer check in production. Local dev / preview can
    // legitimately have cross-origin Referers.
    if (process.env.NODE_ENV === "production") {
      const referer = req.headers.get("referer");
      const host = req.headers.get("host") ?? "";
      if (isCrossOriginHotlink(referer, host)) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
    // Fall through to the image optimizer.
    return NextResponse.next();
  }

  // ---- /admin gate ----

  // Always allow the device enrollment route through, otherwise there is
  // no way to bootstrap a fresh browser.
  if (pathname === "/admin/setup-device") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    // Layer 1: device-bound cookie. Anyone without the cookie sees a
    // generic 404 so the admin surface is invisible to scanners.
    const cookieValue = req.cookies.get(DEVICE_COOKIE)?.value;
    if (!(await verifyDeviceCookie(cookieValue))) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Layer 2: Auth.js session.
    if (pathname === "/admin/login") return NextResponse.next();
    if (!req.auth) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/_next/image"],
};
