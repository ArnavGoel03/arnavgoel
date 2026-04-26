"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/types";

/**
 * Detail-page photo well.
 * Single photo: renders at the image's natural aspect ratio so landscape
 * shots don't sit in a fixed-square frame with empty gutters. Multiple
 * photos: shows the active one + a thumbnail strip you can click or
 * arrow-key through.
 *
 * Photos are pulled from `review.photo` (main shot, first) + every entry
 * in `review.photoTimeline` (additional shots). Sorted by date so the
 * earliest progress shot follows the hero. The dedicated "Week by week"
 * `<PhotoTimeline>` section stays alongside this for skincare progress.
 */
export function ProductPhotoGallery({ review }: { review: Review }) {
  const photos = collectPhotos(review);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        setActive((i) => (i + 1) % photos.length);
      } else if (e.key === "ArrowLeft") {
        setActive((i) => (i - 1 + photos.length) % photos.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photos.length]);

  if (photos.length === 0) return null;

  const current = photos[active];
  const alt = `${review.brand} ${review.name}`;
  const multi = photos.length > 1;

  return (
    <figure className="relative mx-auto mt-8 w-full max-w-md sm:max-w-lg">
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 via-stone-50 to-stone-100 dark:border-stone-800">
        <div className="relative flex items-center justify-center p-4 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current}
            src={current}
            alt={alt}
            fetchPriority={active === 0 ? "high" : "auto"}
            decoding="async"
            className="block max-h-[70vh] w-auto max-w-full object-contain mix-blend-multiply animate-[fade-in_220ms_ease-out]"
          />
        </div>
        {multi && (
          <>
            <button
              type="button"
              onClick={() =>
                setActive((i) => (i - 1 + photos.length) % photos.length)
              }
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-stone-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-stone-900 dark:bg-stone-900/85 dark:text-stone-200 dark:hover:bg-stone-900"
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % photos.length)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-stone-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-stone-900 dark:bg-stone-900/85 dark:text-stone-200 dark:hover:bg-stone-900"
            >
              <span aria-hidden>›</span>
            </button>
            <span className="absolute right-3 top-3 rounded-md bg-white/85 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500 backdrop-blur dark:bg-stone-900/85 dark:text-stone-400">
              {active + 1} / {photos.length}
            </span>
          </>
        )}
      </div>
      {multi && (
        <ol className="mt-3 flex flex-wrap justify-center gap-2">
          {photos.map((src, i) => (
            <li key={`${src}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
                className={
                  "block h-14 w-14 overflow-hidden rounded-md border bg-stone-50 transition-all sm:h-16 sm:w-16 " +
                  (i === active
                    ? "border-stone-900 ring-2 ring-rose-300 dark:border-stone-100"
                    : "border-stone-200 opacity-70 hover:opacity-100 dark:border-stone-800")
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </button>
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}

function collectPhotos(review: Review): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  if (review.photo) {
    seen.add(review.photo);
    out.push(review.photo);
  }
  const timeline = [...review.photoTimeline].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  for (const p of timeline) {
    if (!p.src || seen.has(p.src)) continue;
    seen.add(p.src);
    out.push(p.src);
  }
  return out;
}
