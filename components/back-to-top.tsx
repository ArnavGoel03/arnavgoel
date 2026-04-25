"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * A small "back to top" affordance that materialises after the reader
 * has scrolled past the masthead block (~600px). Anchored to the
 * bottom-right of the viewport, sits inside the safe-area inset so it
 * doesn't collide with the iOS home indicator. Hidden when reduced
 * motion is preferred? — kept; the affordance itself is motion-light
 * (a single fade), which respects the spirit of the preference.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf: number | null = null;
    function check() {
      raf = null;
      setVisible(window.scrollY > 600);
    }
    function onScroll() {
      if (raf !== null) return;
      raf = requestAnimationFrame(check);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className={
        "fixed bottom-6 right-5 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-700 shadow-sm backdrop-blur transition-all duration-300 hover:border-stone-900 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-300 dark:hover:border-stone-400 dark:hover:text-stone-100 " +
        (visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0")
      }
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
