"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { findGlossaryEntry, type GlossaryEntry } from "@/lib/glossary";

/**
 * Inline glossary tooltip. Pulls a term's canonical one-paragraph
 * definition from `lib/glossary.ts` and shows it on hover (desktop)
 * or tap (mobile / keyboard) without leaving the review.
 *
 * Usage from MDX:
 *   <Term>niacinamide</Term>
 *   <Term name="aha">AHAs</Term>     // override the lookup key
 *
 * If no glossary entry is found the children render unchanged so a
 * typo never produces a broken affordance — the term just reads as
 * normal prose.
 *
 * For mobile we don't fire on hover (no real :hover state); a tap
 * toggles the popover, an outside-tap closes it. The visual marker
 * is a quiet rose underline so the affordance is visible without
 * relying on hover.
 */
export function GlossaryTerm({
  children,
  name,
}: {
  children: React.ReactNode;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const popoverId = useId();

  // Resolve the term — prefer explicit `name`, else use the visible
  // text content. Children that aren't a single string fall back to
  // a plain span (unsupported lookup case).
  const lookup =
    typeof name === "string"
      ? name
      : typeof children === "string"
        ? children
        : null;
  const entry: GlossaryEntry | null = lookup ? findGlossaryEntry(lookup) : null;

  // Outside-click + escape close.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!entry) {
    // Unsupported term: render plain so the read isn't broken.
    return <span>{children}</span>;
  }

  return (
    <span ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="not-prose cursor-help border-b border-dotted border-rose-400/60 bg-transparent p-0 font-[inherit] text-[inherit] leading-[inherit] text-stone-900 underline-offset-4 transition-colors hover:border-rose-500 dark:text-stone-100 dark:border-rose-400/60"
      >
        {children}
      </button>
      {open && (
        <span
          id={popoverId}
          role="tooltip"
          // pointer-events-auto so the popover itself stays open
          // when the cursor enters it; closes on mouseleave of the
          // whole wrapper (button + popover).
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="not-prose absolute left-1/2 top-full z-30 mt-2 w-72 max-w-[88vw] -translate-x-1/2 rounded-lg border border-stone-200 bg-white p-4 text-left text-[13px] leading-relaxed text-stone-700 shadow-lg dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        >
          <span className="mb-1 block font-serif text-base font-medium tracking-tight text-stone-900 dark:text-stone-100">
            {entry.term}
          </span>
          <span className="block font-serif">{entry.body}</span>
          <Link
            href={`/glossary#${entry.slug}`}
            onClick={() => setOpen(false)}
            className="mt-3 inline-block text-[11px] uppercase tracking-[0.18em] text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
          >
            Open in glossary →
          </Link>
        </span>
      )}
    </span>
  );
}
