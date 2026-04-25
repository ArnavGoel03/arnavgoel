"use client";

import { useState } from "react";
import { PhotoLightbox } from "./photo-lightbox";

/**
 * Single photo-timeline cell. Owns the click-to-enlarge lightbox
 * state; the parent server component lays out the grid and date
 * captions. Tapping the image opens the full-resolution lightbox;
 * Esc or backdrop-tap closes it.
 */
export function PhotoTimelineItem({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={`Enlarge: ${alt}`}
        onClick={() => setOpen(true)}
        className="group block aspect-[3/4] w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100 transition-all hover:border-stone-400 hover:shadow-sm dark:border-stone-800 dark:bg-stone-800 dark:hover:border-stone-600"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </button>
      {open && (
        <PhotoLightbox
          src={src}
          alt={alt}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
