import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "admin_auth";

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verify a signed cookie. Cookie format: `<expiryMs>.<hmac>`.
 * Uses timing-safe comparison to avoid leaking info via response latency.
 */
function verify(cookie: string | undefined, secret: string): boolean {
  if (!cookie) return false;
  const [payload, sig] = cookie.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload, secret);
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length === 0 || a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  const expiry = parseInt(payload, 10);
  if (!Number.isFinite(expiry)) return false;
  return Date.now() < expiry;
}

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  // Local-dev bypass: if ADMIN_PASSWORD isn't configured, let requests
  // through. Safer than locking yourself out of the dashboard during setup.
  if (!password) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Login + logout routes have to render for the auth flow to work.
  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (verify(cookie, password)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
