import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PhotoTile } from "@/components/photo-tile";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photos",
  description: `DSLR photography by ${site.name}.`,
  alternates: { canonical: "/photos" },
};

export default function PhotosPage() {
  const earliest = photos.length
    ? new Date(Math.min(...photos.map((p) => new Date(p.date).getTime())))
    : null;
  const latest = photos.length
    ? new Date(Math.max(...photos.map((p) => new Date(p.date).getTime())))
    : null;

  return (
    <>
      <Container className="max-w-5xl">
        <div className="py-12 sm:py-16">
          <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
            <span className="flex items-baseline gap-2">
              <span className="text-rose-400">❋</span>
              <span>Contact Sheet, DSLR</span>
            </span>
            {earliest && latest && (
              <span className="font-mono text-stone-400">
                {earliest.getFullYear()}, {latest.getFullYear()}
              </span>
            )}
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-8xl">
            Photos<span className="text-rose-400">.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl">
            A small, slow-growing roll. Shot when I remembered to bring the
            camera and felt like pointing it at something.
          </p>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y border-stone-200 py-4 text-[11px] uppercase tracking-[0.18em] text-stone-500">
            <span className="flex items-baseline gap-2">
              <span className="font-display text-lg font-light tabular-nums text-stone-900">
                {photos.length}
              </span>
              frames
            </span>
            <span aria-hidden className="text-stone-300">·</span>
            <span>shot on DSLR</span>
            <span aria-hidden className="text-stone-300">·</span>
            <span>originals stored at full resolution</span>
          </div>
        </div>
      </Container>

      <Container className="max-w-5xl pb-24">
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {photos.map((p, i) => (
            <PhotoTile key={p.src} photo={p} index={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
