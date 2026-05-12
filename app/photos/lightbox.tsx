"use client";

import { useCallback, useEffect, useState } from "react";

type LightboxPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  location?: string;
  date: string;
};

/**
 * Build a Next/Image-optimized URL for the lightbox. The browser gets
 * an AVIF/WebP at the requested width instead of the full camera JPG
 * (~5-7 MB) which keeps the open-on-click feel snappy. The /_next/image
 * proxy already lives on the same origin and is responsible for the
 * actual transcode + caching.
 */
function optimized(src: string, w = 2400, q = 88): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;
}

/**
 * Click-to-open lightbox for /photos.
 *
 * - Click any element with `data-lightbox-index={N}` (where N is the
 *   index into the photos array passed in) to open the lightbox at
 *   that frame.
 * - Arrow keys move between frames. Escape closes. Click backdrop or
 *   the close button to close.
 * - URL hash updates to `#lightbox-N` for shareable deep links.
 */
export function LightboxRoot({ photos }: { photos: LightboxPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i === null || i <= 0 ? i : i - 1)),
    [],
  );
  const next = useCallback(
    () =>
      setOpen((i) =>
        i === null || i >= photos.length - 1 ? i : i + 1,
      ),
    [photos.length],
  );

  // Trigger from any [data-lightbox-index] click on the page.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest(
        "[data-lightbox-index]",
      ) as HTMLElement | null;
      if (!el) return;
      // Don't hijack clicks inside the lightbox overlay itself
      if (el.closest("[data-lightbox-overlay]")) return;
      const idx = Number(el.dataset.lightboxIndex);
      if (!Number.isFinite(idx) || idx < 0 || idx >= photos.length)
        return;
      e.preventDefault();
      setOpen(idx);
    };
    document.addEventListener("click", handler, { capture: true });
    return () =>
      document.removeEventListener("click", handler, { capture: true });
  }, [photos.length]);

  // Keyboard navigation while open
  useEffect(() => {
    if (open === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft" || e.key === "k") prev();
      else if (e.key === "ArrowRight" || e.key === "j") next();
    };
    window.addEventListener("keydown", handler);
    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  // Preload adjacent photos so prev/next is instant
  useEffect(() => {
    if (open === null) return;
    const adjacent = [open - 1, open + 1, open - 2, open + 2].filter(
      (i) => i >= 0 && i < photos.length && i !== open,
    );
    const tags: HTMLLinkElement[] = [];
    for (const i of adjacent) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = optimized(photos[i].src);
      document.head.appendChild(link);
      tags.push(link);
    }
    return () => {
      tags.forEach((t) => t.remove());
    };
  }, [open, photos]);

  if (open === null) return null;
  const photo = photos[open];
  if (!photo) return null;

  return (
    <div
      data-lightbox-overlay
      onClick={close}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
    >
      {/* Close + frame number */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-5 text-stone-300">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em]">
          {String(open + 1).padStart(3, "0")} / {String(photos.length).padStart(3, "0")}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          className="font-mono text-xs uppercase tracking-[0.22em] text-stone-300 hover:text-white"
          aria-label="Close"
        >
          Close ✕
        </button>
      </div>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        disabled={open <= 0}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 select-none text-4xl text-stone-300 transition-opacity hover:text-white disabled:opacity-20 sm:left-8 sm:text-5xl"
        aria-label="Previous photo"
      >
        ‹
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        disabled={open >= photos.length - 1}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 select-none text-4xl text-stone-300 transition-opacity hover:text-white disabled:opacity-20 sm:right-8 sm:text-5xl"
        aria-label="Next photo"
      >
        ›
      </button>

      {/* Image */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col items-center justify-center px-4 py-16 sm:px-16 sm:py-20"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.src}
          src={optimized(photo.src, 2400, 88)}
          alt={photo.alt}
          draggable={false}
          loading="eager"
          decoding="async"
          className="max-h-[78vh] max-w-full select-none object-contain"
        />
        <figcaption className="mt-5 max-w-3xl px-6 text-center">
          {photo.caption && (
            <p className="font-serif text-lg italic text-stone-100 sm:text-xl">
              {photo.caption}
            </p>
          )}
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400">
            {photo.date}
            {photo.location && (
              <>
                <span aria-hidden className="mx-2 text-stone-600">·</span>
                <span>{photo.location}</span>
              </>
            )}
          </p>
        </figcaption>
      </figure>

      {/* Keyboard hints */}
      <div className="absolute bottom-4 right-4 hidden text-[10px] uppercase tracking-[0.22em] text-stone-500 sm:block">
        ← → arrows · esc to close
      </div>
    </div>
  );
}
