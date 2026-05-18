import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { DEVICE_COOKIE, verifyDeviceCookie } from "@/lib/device-lock";

/**
 * Edge middleware. Job: gate /admin/* with a device-bound HMAC cookie
 * + Auth.js session + ALLOWED_ADMIN_EMAIL allow-list. Everything else
 * passes through with no middleware overhead.
 *
 * CSP and all other security headers live in next.config.ts as static
 * headers — per-request CSP nonces are incompatible with Next 16
 * cacheComponents prerender (the framework streams inline scripts from
 * the cached shell that can't carry a per-request nonce).
 */

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Fast path: anything that isn't /admin skips the middleware entirely.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // /admin/setup-device is the device enrollment route — anyone needs
  // to be able to call it (the token in the query is the gate).
  if (pathname === "/admin/setup-device") {
    return NextResponse.next();
  }

  // Layer 1: device-bound cookie. Missing/invalid → 404 so the admin
  // surface is invisible to scanners.
  const cookieValue = req.cookies.get(DEVICE_COOKIE)?.value;
  if (!(await verifyDeviceCookie(cookieValue))) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Layer 2: Auth.js session. /admin/login is exempt to avoid loops.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }
  const session = await auth();
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Only run on /admin/*. Everything else is served by the edge / origin
  // with no middleware in the path.
  matcher: ["/admin/:path*"],
};
