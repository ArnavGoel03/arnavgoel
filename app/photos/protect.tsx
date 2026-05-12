"use client";

import { useEffect } from "react";

/**
 * Anti-theft client guard for /photos. Mounted once at the top of the
 * page; installs document-level listeners so it covers tiles, hero,
 * lightbox, and chapter covers without per-image wiring (which Server
 * Components can't accept anyway).
 *
 * It cannot make images uncopyable — a determined viewer can always
 * screenshot or DevTools the network response — but it removes the
 * casual save/copy/drag/print paths most theft uses.
 */
export function ImageProtection() {
  useEffect(() => {
    const isImageTarget = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      if (!el) return false;
      if (el.tagName === "IMG" || el.tagName === "PICTURE") return true;
      return !!el.closest?.("img, picture, [data-protect]");
    };

    const onContext = (e: MouseEvent) => {
      if (isImageTarget(e.target)) e.preventDefault();
    };
    const onDrag = (e: DragEvent) => {
      if (isImageTarget(e.target)) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && (k === "s" || k === "p" || k === "u")) {
        e.preventDefault();
      }
      // Block Cmd+Shift+S (Save As variants) too
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && k === "s") {
        e.preventDefault();
      }
    };
    const onSelect = (e: Event) => {
      if (isImageTarget(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContext);
    document.addEventListener("dragstart", onDrag);
    document.addEventListener("keydown", onKey);
    document.addEventListener("selectstart", onSelect);
    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("dragstart", onDrag);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("selectstart", onSelect);
    };
  }, []);
  return null;
}
