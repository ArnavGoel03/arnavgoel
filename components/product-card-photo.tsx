"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The photo well inside a listing-page product card.
 * One photo: behaves exactly like the old static well.
 * Multiple photos: cycles on hover (desktop) or via swipe (mobile),
 * with corner dots that show how many shots exist and which is active.
 */
export function ProductCardPhoto({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const multi = photos.length > 1;
  const hovering = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startCycle() {
    if (!multi || intervalRef.current) return;
    hovering.current = true;
    intervalRef.current = setInterval(() => {
      setActive((i) => (i + 1) % photos.length);
    }, 1200);
  }
  function stopCycle() {
    hovering.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActive(0);
  }
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Touch swipe: a horizontal drag advances or rewinds the active photo.
  const touchStart = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!multi || touchStart.current === null) return;
    const end = e.changedTouches[0]?.clientX ?? touchStart.current;
    const dx = end - touchStart.current;
    if (Math.abs(dx) > 30) {
      setActive((i) =>
        dx < 0 ? (i + 1) % photos.length : (i - 1 + photos.length) % photos.length,
      );
    }
    touchStart.current = null;
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
        {/* mix-blend-multiply makes the source white background blend
            into the cream well, so the product silhouette floats
            cleanly on the card instead of sitting on a hard
            rectangle. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photos[active]}
          src={photos[active]}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.03] animate-[fade-in_220ms_ease-out]"
        />
      </div>
      {/* Corner registration marks. Hidden by default; fade in on
          hover. Reads as a magazine-grid accent that doesn't fight the
          product photo when at rest. */}
      <span aria-hidden className="card-corner-mark left-3 top-3 border-l border-t" />
      <span aria-hidden className="card-corner-mark right-3 top-3 border-r border-t" />
      <span aria-hidden className="card-corner-mark bottom-3 left-3 border-b border-l" />
      <span aria-hidden className="card-corner-mark bottom-3 right-3 border-b border-r" />
      {multi && (
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 backdrop-blur dark:bg-stone-900/80">
          {photos.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={
                "h-1.5 w-1.5 rounded-full transition-colors " +
                (i === active
                  ? "bg-stone-800 dark:bg-stone-100"
                  : "bg-stone-300 dark:bg-stone-700")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
