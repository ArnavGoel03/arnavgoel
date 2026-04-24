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
    // Kept short so the tour doesn't appear after the reader has
    // already started scanning. 250ms is enough for the product-card
    // grid to mount on most connections.
    const t = setTimeout(() => setShow(true), 250);
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
