import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Photo } from "@/lib/types";

function fileExists(publicPath: string) {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function PhotoTile({ photo }: { photo: Photo }) {
  const exists = fileExists(photo.src);
  const aspect = `${photo.width} / ${photo.height}`;

  return (
    <figure className="group mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div
        className="relative w-full overflow-hidden bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100"
        style={{ aspectRatio: aspect }}
      >
        {exists ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <p className="font-mono text-xs text-stone-400">
              {photo.src}
            </p>
          </div>
        )}
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 p-4 text-sm">
        <span className="text-stone-700">{photo.caption}</span>
        <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-stone-400">
          {photo.location ? `${photo.location} · ` : ""}
          {formatDate(photo.date)}
        </span>
      </figcaption>
    </figure>
  );
}
