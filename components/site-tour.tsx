"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const TOUR_STORAGE_KEY = "yashgoel-tour-seen";

type Step = {
  selector?: string;
  title: string;
  body: string;
  placement?: "bottom" | "top" | "center";
};

const STEPS: Step[] = [
  {
    title: "Welcome in",
    body: "A personal review site: skincare, supplements, oral care. Every product has lived in my routine for at least a month before it earned a verdict. Quick tour, thirty seconds.",
    placement: "center",
  },
  {
    selector: "[data-tour='nav']",
    title: "The top nav",
    body: "Three review categories, plus Routines, Primers, Photos, Notes, Now, and About. Everything is one click from here.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='search']",
    title: "Search everything",
    body: "Click the magnifier, or press ⌘K (Ctrl+K on Windows) anywhere. Fuzzy-matches across reviews, notes, and primers.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='theme']",
    title: "Light or dark",
    body: "Sun or moon, pick the one you want. Your choice is remembered across sessions.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='stats']",
    title: "The honesty line",
    body: "Zero sponsored products. Nothing ever sent free by a brand. If I stopped using something, the review says that.",
    placement: "top",
  },
  {
    selector: "[data-tour='cta']",
    title: "Pick an entry point",
    body: "Latest reviews, or 'what's on the shelf' for the monthly snapshot of what I'm currently using.",
    placement: "top",
  },
];

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function SiteTour({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [viewport, setViewport] = useState({
    w: 0,
    h: 0,
  });

  const step = STEPS[index];

  const updateRect = useCallback(() => {
    if (!step.selector) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.selector) as HTMLElement | null;
    if (!el) {
      setRect(null);
      return;
    }
    // Bring the target into view before measuring. `nearest` avoids
    // aggressive scroll on already-visible targets.
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    // Measure after the scroll settles.
    const t = setTimeout(() => {
      setRect(el.getBoundingClientRect());
    }, 320);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    setViewport({ w: window.innerWidth, h: window.innerHeight });
    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      updateRect();
    };
    const onScroll = () => updateRect();
    updateRect();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [updateRect]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish(true);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function finish(saveSeen: boolean) {
    if (saveSeen) {
      try {
        localStorage.setItem(TOUR_STORAGE_KEY, "seen");
      } catch {
        // Private mode, quota, etc. Ignore.
      }
    }
    onClose();
  }

  function next() {
    if (index === STEPS.length - 1) finish(true);
    else setIndex(index + 1);
  }

  function back() {
    setIndex(Math.max(0, index - 1));
  }

  // Don't render on the server or before the portal target exists.
  if (typeof document === "undefined") return null;

  const CARD_W = Math.min(384, viewport.w - 32);
  const placement = step.placement ?? "bottom";

  // Card + highlight positioning + arrow geometry.
  let cardStyle: React.CSSProperties;
  let cardLeft = 0;
  let arrowDirection: "up" | "down" | null = null;
  let arrowOffsetPx = CARD_W / 2;

  const highlightStyle: React.CSSProperties | null =
    rect && placement !== "center"
      ? {
          position: "fixed",
          left: rect.left - 6,
          top: rect.top - 6,
          width: rect.width + 12,
          height: rect.height + 12,
          pointerEvents: "none",
        }
      : null;

  if (rect && placement === "bottom") {
    cardLeft = clamp(
      rect.left + rect.width / 2 - CARD_W / 2,
      16,
      viewport.w - CARD_W - 16,
    );
    cardStyle = {
      position: "fixed",
      left: cardLeft,
      top: Math.min(rect.bottom + 18, viewport.h - 220),
      width: CARD_W,
    };
    arrowDirection = "up";
    // Point the arrow at the horizontal center of the target, constrained
    // to sit within the card's width so it doesn't jut off the edge.
    arrowOffsetPx = clamp(
      rect.left + rect.width / 2 - cardLeft,
      20,
      CARD_W - 20,
    );
  } else if (rect && placement === "top") {
    cardLeft = clamp(
      rect.left + rect.width / 2 - CARD_W / 2,
      16,
      viewport.w - CARD_W - 16,
    );
    cardStyle = {
      position: "fixed",
      left: cardLeft,
      bottom: Math.min(viewport.h - rect.top + 18, viewport.h - 40),
      width: CARD_W,
    };
    arrowDirection = "down";
    arrowOffsetPx = clamp(
      rect.left + rect.width / 2 - cardLeft,
      20,
      CARD_W - 20,
    );
  } else {
    cardStyle = {
      position: "fixed",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: CARD_W,
    };
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      {/* Backdrop. Clicking dismisses the tour and marks it as seen. */}
      <button
        type="button"
        aria-label="Close tour"
        onClick={() => finish(true)}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-opacity dark:bg-black/70"
      />

      {/* Highlight ring around the current target (static) */}
      {highlightStyle && (
        <>
          <div
            style={highlightStyle}
            className="pointer-events-none rounded-xl ring-2 ring-rose-400 ring-offset-4 ring-offset-white transition-all duration-300 dark:ring-offset-stone-950"
          />
          {/* Pulse ring, draws the eye and says 'look here' */}
          <div
            style={highlightStyle}
            className="pointer-events-none animate-ping rounded-xl ring-2 ring-rose-400/70"
          />
        </>
      )}

      {/* The tour card */}
      <div
        style={cardStyle}
        className="relative rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl dark:border-stone-800 dark:bg-stone-900"
      >
        {/* Arrow pointing at the highlighted target */}
        {arrowDirection === "up" && (
          <>
            <span
              aria-hidden
              style={{ left: arrowOffsetPx }}
              className="absolute -top-[9px] -translate-x-1/2 border-x-[9px] border-b-[9px] border-x-transparent border-b-stone-200 dark:border-b-stone-800"
            />
            <span
              aria-hidden
              style={{ left: arrowOffsetPx }}
              className="absolute -top-[7px] -translate-x-1/2 border-x-[8px] border-b-[8px] border-x-transparent border-b-white dark:border-b-stone-900"
            />
          </>
        )}
        {arrowDirection === "down" && (
          <>
            <span
              aria-hidden
              style={{ left: arrowOffsetPx }}
              className="absolute -bottom-[9px] -translate-x-1/2 border-x-[9px] border-t-[9px] border-x-transparent border-t-stone-200 dark:border-t-stone-800"
            />
            <span
              aria-hidden
              style={{ left: arrowOffsetPx }}
              className="absolute -bottom-[7px] -translate-x-1/2 border-x-[8px] border-t-[8px] border-x-transparent border-t-white dark:border-t-stone-900"
            />
          </>
        )}

        <div className="mb-3 flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
          <span className="flex items-baseline gap-2">
            <span className="text-rose-400">❋</span>
            <span>Tour</span>
          </span>
          <span className="font-mono text-stone-400 dark:text-stone-500">
            № {String(index + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
          </span>
        </div>
        <h3
          id="tour-title"
          className="font-serif text-2xl leading-tight text-stone-900 dark:text-stone-100"
        >
          {step.title}
          <span className="text-rose-400">.</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          {step.body}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => finish(true)}
            className="text-[10px] uppercase tracking-[0.18em] text-stone-400 transition-colors hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={back}
                className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 transition-colors hover:border-stone-900 dark:border-stone-700 dark:text-stone-200 dark:hover:border-stone-400"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-stone-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              {index === STEPS.length - 1 ? "Done" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
