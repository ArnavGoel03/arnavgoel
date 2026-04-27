"use client";

import { useEffect } from "react";

/**
 * Registers the service worker that ships in /public/sw.js. Production
 * only — in development the SW would aggressively cache HMR responses
 * and make every refresh confusing. Registration runs after the load
 * event so it never competes with the LCP fetch.
 *
 * The SW handles its own version-bumping via the cache name
 * (`yashgoel-shell-vN`); no client-side reload-on-update is needed.
 */
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {
          // Best-effort. A failed registration shouldn't block the page.
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
