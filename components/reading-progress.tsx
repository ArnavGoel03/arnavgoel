"use client";

import { useEffect, useState } from "react";

/**
 * Thin rose-accent progress bar pinned to the very top of the viewport
 * that fills as the reader scrolls through the article. Only visible
 * once they've scrolled past a threshold, so it doesn't show up on
 * short pages where the article fits on one screen.
 */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setPct(0);
        return;
      }
      const p = Math.max(0, Math.min(1, window.scrollY / max));
      setPct(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Hide until the reader has made meaningful progress.
  const visible = pct > 0.02;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms" }}
    >
      <div
        className="h-full origin-left bg-rose-400"
        style={{ transform: `scaleX(${pct})`, transition: "transform 80ms linear" }}
      />
    </div>
  );
}
