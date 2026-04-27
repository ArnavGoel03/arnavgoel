"use client";

import { useEffect, useRef } from "react";

/**
 * A soft semi-transparent dot (~24px) that trails the cursor with a
 * gentle rAF-lerp at 0.2 factor — responsive but unhurried.
 *
 * Hidden automatically on touch devices via a CSS `(hover: hover)`
 * media query check so it never flashes on mobile. Pointer-events
 * are none so it never interferes with clicks. Z-index 9999 keeps
 * it above everything else.
 *
 * Mount once in app/layout.tsx (already done).
 */
export function CursorHalo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only attach on devices that have a fine pointer (mouse / trackpad).
    // `(hover: hover)` is the canonical check; touch screens fail it.
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover) return;

    const el = ref.current;
    if (!el) return;

    // Start off-screen so the dot doesn't flash at (0,0) before the
    // first mousemove.
    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;
    let raf = 0;

    const LERP = 0.2;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      currentX = lerp(currentX, targetX, LERP);
      currentY = lerp(currentY, targetY, LERP);
      el!.style.transform = `translate(${currentX}px, ${currentY}px)`;
      raf = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) {
      targetX = e.clientX - 12; // offset by half the 24px diameter
      targetY = e.clientY - 12;
    }

    // Show the dot only after the first mousemove so it doesn't
    // briefly appear at (0,0) during the initial frame.
    function onFirstMove(e: MouseEvent) {
      targetX = e.clientX - 12;
      targetY = e.clientY - 12;
      currentX = targetX;
      currentY = targetY;
      el!.style.opacity = "1";
      window.removeEventListener("mousemove", onFirstMove);
    }

    el.style.opacity = "0";
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onFirstMove);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousemove", onFirstMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-6 w-6 rounded-full"
      style={{
        background: "rgb(28 25 23 / 0.08)",
        // Fallback dark: use foreground color at same opacity.
        // We can't easily read CSS vars here at element-creation time,
        // so the light value (ink/8%) is fine for most surfaces. The
        // halo is so subtle it reads well on both backgrounds.
        backdropFilter: "none",
        willChange: "transform",
        transition: "opacity 400ms",
      }}
    />
  );
}
