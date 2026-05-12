import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { DEVICE_COOKIE, verifyDeviceCookie } from "@/lib/device-lock";

/**
 * Three-layer gate for /admin/*:
 *
 *   1. Device cookie  : a one-time HMAC-signed cookie minted by
 *                       /admin/setup-device?token=<ADMIN_DEVICE_SETUP_TOKEN>.
 *                       Missing/invalid means 404, the surface is hidden.
 *   2. Google OAuth   : standard Auth.js session.
 *   3. Email allow    : actions.ts cross-checks the session email against
 *                       ALLOWED_ADMIN_EMAIL before any write.
 *
 * /admin/setup-device is exempt from the device check (it is the device
 * check). /admin/login is exempt from the session check (otherwise it
 * would loop redirecting itself).
 */
export default auth(async (req) => {
  const { pathname } = req.nextUrl;

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
  matcher: ["/admin/:path*"],
};
