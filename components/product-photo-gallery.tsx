"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import type { Review } from "@/lib/types";

/**
 * Detail-page media well.
 *
 * Slides are pulled from, in order:
 *   1. main `review.photo`
 *   2. every entry in `review.photos` (additional product shots)
 *   3. every entry in `review.photoTimeline` (dated progress shots,
 *      sorted ascending by date)
 *   4. `review.video` (last slide, never first — the hero shot stays a
 *      still image so the LCP is fast)
 *
 * Video sources:
 *   - .mp4 / .webm / .mov / .ogg → native <video>, controls + lazy
 *     metadata + playsInline (so iOS doesn't fullscreen on tap).
 *   - YouTube / youtu.be / youtube-nocookie → privacy-mode iframe.
 *   - Vimeo → iframe.
 *
 * Single image: renders at the photo's natural aspect ratio (no fixed
 * square frame, no empty gutters).
 * Multi-slide: shows the active one + a clickable thumbnail strip;
 * video tiles in the strip render a play badge instead of <img>.
 */

type Slide = { kind: "image" | "video"; src: string };
type VideoEmbed =
  | { type: "file"; src: string }
  | { type: "youtube"; src: string; id: string }
  | { type: "vimeo"; src: string; id: string };

export function ProductPhotoGallery({ review }: { review: Review }) {
  const slides = collectSlides(review);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    function onKey(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        setActive((i) => (i + 1) % slides.length);
      } else if (e.key === "ArrowLeft") {
        setActive((i) => (i - 1 + slides.length) % slides.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const current = slides[active];
  const alt = `${review.brand} ${review.name}`;
  const multi = slides.length > 1;

  return (
    <figure className="relative mx-auto mt-8 w-full max-w-md sm:max-w-lg">
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 via-stone-50 to-stone-100 dark:border-stone-800">
        <div className="relative flex items-center justify-center p-4 sm:p-6">
          {current.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={current.src}
              src={current.src}
              alt={alt}
              fetchPriority={active === 0 ? "high" : "auto"}
              decoding="async"
              className="block max-h-[70vh] w-auto max-w-full object-contain mix-blend-multiply animate-[fade-in_220ms_ease-out]"
            />
          ) : (
            <VideoSlide src={current.src} title={alt} />
          )}
        </div>
        {multi && (
          <>
            <button
              type="button"
              onClick={() =>
                setActive((i) => (i - 1 + slides.length) % slides.length)
              }
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-stone-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-stone-900 dark:bg-stone-900/85 dark:text-stone-200 dark:hover:bg-stone-900"
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % slides.length)}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-stone-700 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-stone-900 dark:bg-stone-900/85 dark:text-stone-200 dark:hover:bg-stone-900"
            >
              <span aria-hidden>›</span>
            </button>
            <span className="absolute right-3 top-3 rounded-md bg-white/85 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500 backdrop-blur dark:bg-stone-900/85 dark:text-stone-400">
              {active + 1} / {slides.length}
            </span>
          </>
        )}
      </div>
      {multi && (
        <ol className="mt-3 flex flex-wrap justify-center gap-2">
          {slides.map((slide, i) => (
            <li key={`${slide.src}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={
                  slide.kind === "video"
                    ? "Show video"
                    : `Show photo ${i + 1}`
                }
                aria-current={i === active}
                className={
                  "relative block h-14 w-14 overflow-hidden rounded-md border bg-stone-50 transition-all sm:h-16 sm:w-16 " +
                  (i === active
                    ? "border-stone-900 ring-2 ring-rose-300 dark:border-stone-100"
                    : "border-stone-200 opacity-70 hover:opacity-100 dark:border-stone-800")
                }
              >
                {slide.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900">
                    <Play className="h-5 w-5" aria-hidden />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}

function VideoSlide({ src, title }: { src: string; title: string }) {
  const embed = parseVideo(src);
  if (!embed) return null;
  if (embed.type === "file") {
    return (
      <video
        key={embed.src}
        src={embed.src}
        controls
        playsInline
        preload="metadata"
        className="block max-h-[70vh] w-full max-w-full rounded-lg bg-black animate-[fade-in_220ms_ease-out]"
      />
    );
  }
  const url =
    embed.type === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${embed.id}`
      : `https://player.vimeo.com/video/${embed.id}`;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black animate-[fade-in_220ms_ease-out]">
      <iframe
        src={url}
        title={`${title} — video`}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

function parseVideo(input: string): VideoEmbed | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(trimmed)) {
    return { type: "file", src: trimmed };
  }
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.replace(/^\/+/, "").split("/")[0];
    if (id) return { type: "youtube", src: trimmed, id };
  }
  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    const v = url.searchParams.get("v");
    if (v) return { type: "youtube", src: trimmed, id: v };
    const m = url.pathname.match(/\/(embed|shorts|v)\/([a-zA-Z0-9_-]{6,})/);
    if (m) return { type: "youtube", src: trimmed, id: m[2] };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).pop();
    if (id && /^\d+$/.test(id)) return { type: "vimeo", src: trimmed, id };
  }
  return null;
}

function collectSlides(review: Review): Slide[] {
  const seen = new Set<string>();
  const out: Slide[] = [];
  if (review.photo) {
    seen.add(review.photo);
    out.push({ kind: "image", src: review.photo });
  }
  for (const src of review.photos ?? []) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push({ kind: "image", src });
  }
  const timeline = [...review.photoTimeline].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  for (const p of timeline) {
    if (!p.src || seen.has(p.src)) continue;
    seen.add(p.src);
    out.push({ kind: "image", src: p.src });
  }
  if (review.video && parseVideo(review.video)) {
    out.push({ kind: "video", src: review.video });
  }
  return out;
}
