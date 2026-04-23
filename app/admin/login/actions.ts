"use server";

import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_auth";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function isSafeInternalPath(p: string): boolean {
  return p.startsWith("/") && !p.startsWith("//") && !p.includes("://");
}

export async function loginAction(formData: FormData) {
  const password = (formData.get("password") ?? "").toString();
  const fromRaw = (formData.get("from") ?? "/admin").toString();
  const from = isSafeInternalPath(fromRaw) ? fromRaw : "/admin";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) redirect("/admin");

  if (password !== expected) {
    redirect(
      `/admin/login?err=1&from=${encodeURIComponent(from)}`,
    );
  }

  const expiry = Date.now() + SEVEN_DAYS;
  const payload = expiry.toString();
  const sig = createHmac("sha256", expected).update(payload).digest("hex");

  const jar = await cookies();
  jar.set(COOKIE_NAME, `${payload}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiry),
  });

  redirect(from);
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect("/admin/login");
}
