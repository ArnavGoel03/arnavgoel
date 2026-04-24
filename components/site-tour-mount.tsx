"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  SiteTour,
  HOME_STEPS,
  HOME_TOUR_STORAGE_KEY,
} from "./site-tour";

/**
 * Auto-shows the first-visit home tour. Stays dismissed for repeat
 * visits via localStorage. `?tour=1` forces the tour open even after
 * dismissal, so 'Take the tour' links continue to work.
 */
export function SiteTourMount() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const forced = search.get("tour") === "1";
    if (!forced) {
      try {
        if (localStorage.getItem(HOME_TOUR_STORAGE_KEY) === "seen") return;
      } catch {
        // ignore storage errors
      }
    }
    // Keep the delay short. 600ms let the page fully settle before the
    // overlay appeared, which readers correctly read as "showing up
    // late". 200ms is enough for layout + font load on cached fonts.
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, [pathname, search]);

  if (!show) return null;
  return (
    <SiteTour
      steps={HOME_STEPS}
      storageKey={HOME_TOUR_STORAGE_KEY}
      onClose={() => setShow(false)}
    />
  );
}
