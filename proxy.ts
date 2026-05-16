import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { DEVICE_COOKIE, verifyDeviceCookie } from "@/lib/device-lock";
import { themeInitScriptCspSource } from "@/lib/theme-script";

/**
 * Three things this middleware does on every request:
 *
 *   1. /admin/* gate — device cookie + Auth.js session + (downstream)
 *      ALLOWED_ADMIN_EMAIL email allow-list.
 *
 *   2. CSP nonce — generates a per-request nonce and stamps it into the
 *      response's Content-Security-Policy. Next.js reads the nonce from
 *      the forwarded `x-nonce` request header and applies it to every
 *      inline `<script>` it renders during SSR. With `'strict-dynamic'`,
 *      trust propagates to any external script loaded by a nonced
 *      script (Vercel Analytics, GA, Speed Insights), so we don't need
 *      to maintain a host-allowlist for those.
 *
 *   3. Other security headers (HSTS, X-Frame-Options, Referrer-Policy,
 *      Permissions-Policy, COOP/CORP/etc.) — these are static and live
 *      in next.config.ts. Only the CSP is dynamic per request.
 *
 * /admin/setup-device is exempt from the device check (it IS the device
 * check). /admin/login is exempt from the session check (otherwise it
 * loops redirecting itself).
 */

// Non-script CSP directives. These don't change per request, so they
// stay as a single map and get serialized alongside the per-request
// script-src below.
const CSP_BASE: Record<string, string[]> = {
  "default-src": ["'self'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'", "https:"],
  // Spotify embeds for the listening section + YouTube/Vimeo for any
  // product walkthrough video in the detail-page gallery.
  "frame-src": [
    "https://open.spotify.com",
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
  ],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": [],
};

function buildCsp(nonce: string): string {
  // 'strict-dynamic' transfers trust to scripts loaded BY a nonced
  // script — Next.js stamps the nonce on its inline bootstrap, which
  // then loads Vercel Analytics / SpeedInsights / GA dynamically.
  // Modern browsers ignore `'self'` + host-allowlists when
  // 'strict-dynamic' is present, so we can drop the host list.
  // 'unsafe-eval' is retained for libraries that still rely on it
  // (some analytics, Sentry stacktrace processing). Removing it later
  // is a follow-up audit, not a security regression versus current.
  const script = [
    "'self'",
    `'nonce-${nonce}'`,
    // Hash for the inline theme-init script rendered by app/layout.tsx.
    // It runs before React hydrates and used to ride on the per-request
    // nonce; reading `headers()` in the root layout broke /_not-found
    // prerender under Next 16 cacheComponents, so we authorize the
    // (static) script body via SHA-256 instead.
    themeInitScriptCspSource,
    "'strict-dynamic'",
    "'unsafe-eval'",
  ];
  const directives: Record<string, string[]> = {
    "script-src": script,
    ...CSP_BASE,
  };
  return Object.entries(directives)
    .map(([k, v]) => (v.length === 0 ? k : `${k} ${v.join(" ")}`))
    .join("; ");
}

function passthrough(
  req: NextRequest,
  nonce: string,
  csp: string,
): NextResponse {
  // Forward the nonce to the React render via the request header.
  // Next.js detects `x-nonce` automatically and uses it on its inline
  // bootstrap scripts.
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-nonce", nonce);
  reqHeaders.set("Content-Security-Policy", csp);
  const res = NextResponse.next({ request: { headers: reqHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // Per-request CSP nonce. Base64-encoded UUID gives ~122 bits of
  // entropy; the browser only needs ~128 bits to make guessing
  // infeasible within a single response's lifetime.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  // ---- /admin gate ----

  // /admin/setup-device is the device enrollment route — anyone needs
  // to be able to call it (the token in the query is the gate). Pass
  // through with CSP only.
  if (pathname === "/admin/setup-device") {
    return passthrough(req, nonce, csp);
  }

  if (pathname.startsWith("/admin")) {
    // Layer 1: device-bound cookie. Missing/invalid → 404 so the
    // admin surface is invisible to scanners.
    const cookieValue = req.cookies.get(DEVICE_COOKIE)?.value;
    if (!(await verifyDeviceCookie(cookieValue))) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Layer 2: Auth.js session. /admin/login is exempt to avoid loops.
    if (pathname === "/admin/login") {
      return passthrough(req, nonce, csp);
    }
    if (!req.auth) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return passthrough(req, nonce, csp);
});

export const config = {
  // Match every path EXCEPT static assets and the image optimizer (no
  // HTML, no CSP needed; running middleware on /_next/image also breaks
  // Vercel's optimizer protocol).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|feed.xml).*)",
  ],
};
