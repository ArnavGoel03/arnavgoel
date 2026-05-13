import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { headers } from "next/headers";
import Image from "next/image";
import type { Photo } from "@/lib/types";

/**
 * Per-session forensic identifier baked into the visible watermark. Derived
 * from the visitor's forwarded IP + the calendar day + a server-only salt.
 * The hash itself is non-reversible (6 hex chars), but if a watermarked
 * screenshot ever leaks publicly, comparing that ID against the access
 * log narrows the leak source to a small slice of traffic.
 *
 * The salt is read from `WATERMARK_SALT` env var with a fallback so dev
 * works without configuration. In production set the env var to a long
 * random string so the hash can't be brute-forced from a known IP.
 */
async function sessionId(): Promise<string> {
  const h = await headers();
  const fwd =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "0.0.0.0";
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.WATERMARK_SALT ?? "yashgoel-photos-default-salt";
  return crypto
    .createHash("sha256")
    .update(`${fwd}|${day}|${salt}`)
    .digest("hex")
    .slice(0, 6)
    .toUpperCase();
}

function fileExists(srcOrUrl: string) {
  if (/^https?:\/\//i.test(srcOrUrl)) return true;
  return fs.existsSync(path.join(process.cwd(), "public", srcOrUrl));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

/**
 * Anti-screenshot-fraud watermark: a small mark in the bottom-right
 * corner of every rendered photo. mix-blend-difference makes it adapt
 * to whatever's underneath, so it stays legible against pure white,
 * pure black, and everything between. Survives screenshots; combines
 * with the EXIF Copyright/Artist metadata baked into every JPEG and
 * the document-level right-click / drag / Cmd+S guard for layered
 * protection.
 *
 * The trailing 6-char hex is the per-session ID — if a leaked screenshot
 * surfaces somewhere, that ID + date narrows down which visitor session
 * originated the leak. Hash is one-way; nothing identifying is rendered.
 */
async function Watermark({ size = "sm" }: { size?: "sm" | "lg" }) {
  const id = await sessionId();
  const cls =
    size === "lg"
      ? "bottom-4 right-4 text-[11px] tracking-[0.28em]"
      : "bottom-2 right-2 text-[9px] tracking-[0.22em]";
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none font-mono uppercase text-white/85 mix-blend-difference ${cls}`}
    >
      ❋ yashgoel.vercel.app · {id}
    </span>
  );
}

/**
 * Standard image wrapper: watermark + native drag off. Shared between
 * PhotoTile and PhotoHero so the deterrents follow the photo at every
 * scale. (We can't add onContextMenu here because this module is a
 * Server Component; event handlers belong in a "use client" wrapper.
 * The CSS watermark + draggable=false + select-none cover the
 * realistic deterrent surface anyway.)
 */
const protectionProps = {
  draggable: false,
} as const;

export function PhotoTile({ photo, index }: { photo: Photo; index: number }) {
  const exists = fileExists(photo.src);
  const aspect = `${photo.width} / ${photo.height}`;
  const frameNumber = String(index + 1).padStart(2, "0");

  return (
    <figure className="group break-inside-avoid">
      <div className="mb-3 flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
        <span className="font-mono">№ {frameNumber}</span>
        {photo.location && (
          <span className="font-serif italic normal-case tracking-normal text-stone-500 dark:text-stone-400">
            {photo.location}
          </span>
        )}
      </div>

      <div
        className="relative w-full select-none overflow-hidden bg-stone-100 dark:bg-stone-900"
        style={{ aspectRatio: aspect }}
        {...protectionProps}
      >
        {exists ? (
          <>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4="
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.015]"
              draggable={false}
            />
            <Watermark size="sm" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-500">
              {photo.src}
            </p>
          </div>
        )}
      </div>

      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="font-serif text-base italic leading-snug text-stone-700 dark:text-stone-200 sm:text-lg">
          {photo.caption}
        </span>
        <time
          dateTime={photo.date}
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 tabular-nums dark:text-stone-500"
        >
          {formatDate(photo.date)}
        </time>
      </figcaption>
      <ExifLine photo={photo} />
    </figure>
  );
}

/**
 * Editorial side-caption variant: photo on the right ~65%, caption in
 * a quiet column on the left ~35%. Used sparingly so it stays special;
 * great for frames that earn an exhibition-label style presentation
 * rather than being lined up with everything else.
 */
export function PhotoSideCaption({
  photo,
  index,
  side = "left",
}: {
  photo: Photo;
  index: number;
  side?: "left" | "right";
}) {
  const exists = fileExists(photo.src);
  const aspect = `${photo.width} / ${photo.height}`;
  const frameNumber = String(index + 1).padStart(2, "0");
  const captionFirst = side === "left";

  const captionCol = (
    <div className="flex flex-col gap-6 sm:gap-8 sm:pt-12">
      <div className="flex items-baseline gap-3 text-[10px] uppercase tracking-[0.28em] text-stone-400 dark:text-stone-500">
        <span className="font-mono">№ {frameNumber}</span>
        <span aria-hidden className="text-stone-300 dark:text-stone-700">·</span>
        <time
          dateTime={photo.date}
          className="font-mono tabular-nums"
        >
          {formatDate(photo.date)}
        </time>
      </div>
      <p className="font-serif text-2xl italic leading-[1.2] text-stone-800 sm:text-3xl sm:leading-[1.18] dark:text-stone-100">
        {photo.caption}
      </p>
      {photo.location && (
        <p className="font-serif italic text-stone-500 dark:text-stone-400">
          {photo.location}
        </p>
      )}
      <ExifLine photo={photo} />
    </div>
  );

  return (
    <figure className="group">
      <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-12 sm:gap-x-8 sm:gap-y-0">
        {captionFirst && (
          <div className="sm:col-span-4 sm:pr-4">{captionCol}</div>
        )}
        <div className={captionFirst ? "sm:col-span-8" : "sm:col-span-8"}>
          <div
            className="relative w-full select-none overflow-hidden bg-stone-100 dark:bg-stone-900"
            style={{ aspectRatio: aspect }}
            {...protectionProps}
          >
            {exists && (
              <>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 66vw"
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4="
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.015]"
                  draggable={false}
                />
                <Watermark size="sm" />
              </>
            )}
          </div>
        </div>
        {!captionFirst && (
          <div className="sm:col-span-4 sm:pl-4">{captionCol}</div>
        )}
      </div>
    </figure>
  );
}

/**
 * Inline EXIF chip strip. Renders only the fields that exist; if
 * none do the whole row is skipped. Reads as a quiet caption rather
 * than a data dump.
 */
function ExifLine({ photo }: { photo: Photo }) {
  const parts: string[] = [];
  if (photo.camera) parts.push(photo.camera);
  if (photo.lens) parts.push(photo.lens);
  if (photo.focalLength) parts.push(photo.focalLength);
  if (photo.aperture) parts.push(photo.aperture);
  if (photo.shutter) parts.push(photo.shutter);
  if (photo.iso) parts.push(`ISO ${photo.iso}`);
  if (parts.length === 0) return null;
  return (
    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
      {parts.join(" · ")}
    </p>
  );
}

/**
 * Cover-frame treatment for the first photo in the roll. Bleeds to the
 * viewport edges on desktop, clamps height so portraits don't run off
 * screen, and pairs the image with a larger italic caption below.
 */
export function PhotoHero({ photo, index }: { photo: Photo; index: number }) {
  const exists = fileExists(photo.src);
  const aspect = `${photo.width} / ${photo.height}`;
  const frameNumber = String(index + 1).padStart(2, "0");

  return (
    <figure className="group">
      <div
        className="relative w-full select-none overflow-hidden bg-stone-100 dark:bg-stone-900"
        style={{ aspectRatio: aspect, maxHeight: "85vh" }}
        {...protectionProps}
      >
        {exists ? (
          <>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              quality={92}
              priority
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4="
              className="object-cover"
              draggable={false}
            />
            <Watermark size="lg" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
              {photo.src}
            </p>
          </div>
        )}
      </div>

      <figcaption className="mx-auto mt-6 flex max-w-5xl flex-col gap-3 px-6 sm:mt-8">
        <div className="flex items-baseline justify-between gap-4 text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
          <span className="flex items-baseline gap-3">
            <span className="font-mono">Frame № {frameNumber}</span>
            {photo.location && (
              <>
                <span aria-hidden className="text-stone-300 dark:text-stone-700">
                  ·
                </span>
                <span className="font-serif italic normal-case tracking-normal text-stone-500 dark:text-stone-400">
                  {photo.location}
                </span>
              </>
            )}
          </span>
          <time
            dateTime={photo.date}
            className="shrink-0 font-mono tabular-nums"
          >
            {formatDate(photo.date)}
          </time>
        </div>
        {photo.caption && (
          <p className="max-w-3xl font-serif text-xl italic leading-snug text-stone-700 dark:text-stone-200 sm:text-2xl">
            {photo.caption}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
