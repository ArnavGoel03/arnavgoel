"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SiteTour, TOUR_STORAGE_KEY } from "./site-tour";

/**
 * Auto-shows the first-visit tour on the home page only. Stays dismissed
 * for repeat visits via localStorage. Landing on a deep link (a review,
 * primer, note) doesn't trigger it, only the home route does.
 *
 * The `?tour=1` query param forces the tour to run, so users who skipped
 * it once can still reach it from, e.g., a footer "Take the tour" link.
 */
export function SiteTourMount() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    // Explicit ?tour=1 always re-opens the tour, regardless of the seen
    // flag. Watching searchParams here means clicking 'Take the tour'
    // from the footer works even when the user is already on the home
    // page (no full reload required).
    const forced = search.get("tour") === "1";
    if (!forced) {
      try {
        if (localStorage.getItem(TOUR_STORAGE_KEY) === "seen") return;
      } catch {
        // ignore storage errors
      }
    }
    // Short delay so the page has laid out and the header refs exist.
    const t = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(t);
  }, [pathname, search]);

  if (!show) return null;
  return <SiteTour onClose={() => setShow(false)} />;
}
