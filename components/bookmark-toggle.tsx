"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "yashgoel-shelf-v1";
const EVENT_NAME = "shelf:change";

/**
 * Read the saved shelf from localStorage, defensively. Used by the
 * toggle, the listing card glyph, and the /shelf page client.
 */
export function readShelf(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function writeShelf(items: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: items.slice() }),
    );
  } catch {
    // ignore quota errors
  }
}

/**
 * Subscribe to shelf changes from any component on the page.
 * Returns an unsubscribe function.
 */
export function onShelfChange(cb: (items: string[]) => void): () => void {
  function handler(e: Event) {
    const detail = (e as CustomEvent<string[]>).detail;
    if (Array.isArray(detail)) cb(detail);
  }
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

/**
 * The save-to-shelf control on every listing card. A small rose
 * asterisk that fills when the product is on the reader's shelf
 * (a localStorage-backed wishlist visible at /shelf).
 *
 * Sits inside the card's <Link> wrapper, so the click handler
 * stops propagation to avoid navigating when the toggle fires.
 */
export function BookmarkToggle({ id }: { id: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBookmarked(readShelf().includes(id));
    setHydrated(true);
    return onShelfChange((items) => {
      setBookmarked(items.includes(id));
    });
  }, [id]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const current = readShelf();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    writeShelf(next);
    setBookmarked(next.includes(id));
  }

  // Render the unfilled state until hydration to avoid SSR/CSR
  // mismatch (server can't read localStorage). After hydrate the
  // state snaps to the real value with a quick fade.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={bookmarked ? "Remove from shelf" : "Save to shelf"}
      title={bookmarked ? "On the shelf" : "Save to shelf"}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm backdrop-blur transition-all",
        hydrated && bookmarked
          ? "bg-rose-100/95 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300"
          : "bg-white/80 text-stone-400 hover:bg-white hover:text-rose-500 dark:bg-stone-900/80 dark:text-stone-500 dark:hover:text-rose-300",
      )}
    >
      <span aria-hidden>❋</span>
    </button>
  );
}
