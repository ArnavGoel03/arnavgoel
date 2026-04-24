import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Photo } from "@/lib/types";

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

export function PhotoTile({ photo, index }: { photo: Photo; index: number }) {
  const exists = fileExists(photo.src);
  const aspect = `${photo.width} / ${photo.height}`;
  const frameNumber = String(index + 1).padStart(2, "0");

  return (
    <figure className="group mb-10 break-inside-avoid">
      <div className="mb-2 flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
        <span className="font-mono">№ {frameNumber}</span>
        {photo.location && (
          <span className="font-serif italic normal-case tracking-normal text-stone-500 dark:text-stone-400">
            {photo.location}
          </span>
        )}
      </div>

      <div
        className="relative w-full overflow-hidden border border-stone-300 bg-stone-50 dark:border-stone-800 dark:bg-stone-900"
        style={{ aspectRatio: aspect }}
      >
        {exists ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500">
              {photo.src}
            </p>
          </div>
        )}
      </div>

      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="font-serif italic leading-snug text-stone-700 dark:text-stone-300">
          {photo.caption}
        </span>
        <time
          dateTime={photo.date}
          className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-stone-400 tabular-nums dark:text-stone-500"
        >
          {formatDate(photo.date)}
        </time>
      </figcaption>
    </figure>
  );
}
