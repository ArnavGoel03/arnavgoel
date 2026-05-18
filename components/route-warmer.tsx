"use client";

/// Background-prefetch the most-trafficked tabs after first paint so
/// subsequent navigations feel instant. We keep this small on purpose:
/// every prefetched route is a real network round-trip, and the goal
/// is "first hop feels free" not "every conceivable route is warm."
///
/// The inline <script type="speculationrules"> was removed in
/// 2026-05-18 — it's a script tag for CSP purposes, has no nonce, and
/// was being blocked by the strict-dynamic CSP. router.prefetch() on
/// the same set delivers most of the perceived speed at zero CSP risk.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Top routes by analytics. Anything past this list pays its own
// network cost on first hit and that's fine.
const ROUTES = ["/", "/about", "/now", "/photos", "/routine", "/primers"];

export function RouteWarmer() {
  const router = useRouter();

  useEffect(() => {
    const schedule =
      typeof window !== "undefined" &&
      typeof window.requestIdleCallback === "function"
        ? (cb: () => void) =>
            window.requestIdleCallback(cb, { timeout: 2000 })
        : (cb: () => void) => window.setTimeout(cb, 1200);

    schedule(() => {
      // Stagger so the prefetch burst doesn't starve user-initiated
      // navigation requests when the click happens mid-warmup.
      ROUTES.forEach((path, i) => {
        window.setTimeout(() => {
          try {
            router.prefetch(path);
          } catch {
            // Best-effort; prefetch failure must never break the page.
          }
        }, i * 80);
      });
    });
  }, [router]);

  return null;
}
