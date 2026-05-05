"use client";

import { useEffect, useRef } from "react";

/**
 * Thin rose-accent progress bar pinned to the very top of the viewport
 * that fills as the reader scrolls through the article. Only visible
 * once they've scrolled past a threshold, so it doesn't show up on
 * short pages where the article fits on one screen.
 *
 * Writes the transform directly to the DOM inside requestAnimationFrame
 * (no React state, no CSS transition) so the bar tracks the scroll
 * position frame-perfectly. The previous implementation re-rendered on
 * every scroll tick and eased the transform over 80 ms, which read as
 * a stepwise lag against the user's actual scroll.
 */
export function ReadingProgress() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const bar = barRef.current;
    if (!wrap || !bar) return;

    let raf = 0;
    let queued = false;
    let lastVisible = false;

    const tick = () => {
      queued = false;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
      const visible = p > 0.02;
      if (visible !== lastVisible) {
        wrap.style.opacity = visible ? "1" : "0";
        lastVisible = visible;
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]"
      style={{ opacity: 0, transition: "opacity 200ms" }}
    >
      <div
        ref={barRef}
        // Rose-accent progress fill: matches the site's signature
        // mark in both modes. The previous oklch-from-foreground
        // hack rendered the bar near-white in dark mode, which read
        // as a cream/yellow streak against the stone-950 background.
        className="h-full origin-left bg-rose-500/80 dark:bg-rose-400/80"
        style={{
          transform: "scaleX(0)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
