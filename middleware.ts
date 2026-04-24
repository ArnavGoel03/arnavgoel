import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Protect /admin/* routes by requiring a valid Auth.js session.
 *
 * Skipped paths:
 *   - /admin/login  (the Google sign-in page itself, otherwise loop)
 *   - /api/auth/*   (Auth.js callback endpoints, handled by the matcher)
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin") && !req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
