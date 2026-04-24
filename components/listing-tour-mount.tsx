"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  SiteTour,
  LISTING_STEPS,
  LISTING_TOUR_STORAGE_KEY,
} from "./site-tour";

/**
 * Auto-shows a one-time tour the first time a reader lands on a
 * category listing page (skincare, supplements, oral care). Drop this
 * into each listing page; the storage key is shared so the second and
 * third visits to sibling listings don't retrigger it.
 *
 * `?tour=1` forces the tour regardless of the seen flag, same contract
 * as the home tour.
 */
export function ListingTourMount() {
  const search = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const forced = search.get("tour") === "1";
    if (!forced) {
      try {
        if (localStorage.getItem(LISTING_TOUR_STORAGE_KEY) === "seen") return;
      } catch {
        // ignore
      }
    }
    // Slightly longer delay: listing pages render product cards below
    // the fold, the tour step that highlights a card needs it mounted.
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, [search]);

  if (!show) return null;
  return (
    <SiteTour
      steps={LISTING_STEPS}
      storageKey={LISTING_TOUR_STORAGE_KEY}
      onClose={() => setShow(false)}
    />
  );
}
