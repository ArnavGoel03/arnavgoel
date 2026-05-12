import { NextResponse } from "next/server";
import { DEVICE_COOKIE, mintDeviceCookieValue, verifySetupToken } from "@/lib/device-lock";

/**
 * One-shot device enrollment endpoint.
 *
 * GET /admin/setup-device?token=<ADMIN_DEVICE_SETUP_TOKEN>
 *   - On the MacBook: paste this URL once, the cookie sticks for 1 year.
 *   - Anywhere else: the token is the only way to mint the cookie, so a
 *     would-be intruder needs both the deployed URL AND the env var to
 *     get past the device gate.
 *
 * Returns a 404 if the token is wrong or missing, so this endpoint is
 * indistinguishable from a non-existent route in the wild.
 */
export const runtime = "nodejs";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? undefined;

  if (!verifySetupToken(token)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const value = await mintDeviceCookieValue();
  if (!value) {
    return new NextResponse(
      "Device lock not configured. ADMIN_DEVICE_SECRET env var is missing.",
      { status: 500 },
    );
  }

  // Stripping the token from the URL after success keeps the secret out
  // of browser history and the back button.
  const redirect = NextResponse.redirect(new URL("/admin/login", url.origin));
  redirect.cookies.set(DEVICE_COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
  return redirect;
}
