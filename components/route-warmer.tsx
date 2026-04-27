"use client";

/// Bulk-prerender every tab in the background after first paint so subsequent
/// navigations feel instant. Two layers:
///   1. Next router.prefetch() — works in every modern browser (Safari/FF/Chrome)
///   2. <script type="speculationrules"> — Chrome/Edge actually *prerender*
///      pages in a hidden tab, so swaps are zero-cost.
///
/// Only mount this once at the app root.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ROUTES = [
  "/",
  "/about",
  "/now",
  "/links",
  "/routine",
  "/primers",
  "/library",
  "/reading",
  "/watching",
  "/supplements",
  "/body-care",
  "/oral-care",
  "/miscellaneous",
  "/best-of",
  "/stack-builder",
  "/search",
];

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
      // Stagger 50 ms per route so the browser doesn't hammer the network in
      // one burst — keeps the main thread responsive.
      ROUTES.forEach((path, i) => {
        window.setTimeout(() => {
          try {
            router.prefetch(path);
          } catch {
            // Ignore — prefetch is best-effort.
          }
        }, i * 50);
      });
    });
  }, [router]);

  return (
    <script
      type="speculationrules"
      // The Speculation Rules API tells supporting browsers (Chrome/Edge) to
      // actually prerender these pages in the background. Instant on click.
      // `eagerness: "moderate"` keeps it from prerendering everything on the
      // entire site — only the listed nav routes.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          prerender: [
            {
              source: "list",
              urls: ROUTES,
              eagerness: "moderate",
            },
          ],
        }),
      }}
    />
  );
}
