import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PhotoHero, PhotoTile } from "@/components/photo-tile";
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

  const [hero, ...rest] = photos;

  return (
    <>
      {/* Masthead */}
      <Container className="max-w-5xl">
        <div className="pt-12 sm:pt-16">
          <div className="mb-6 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
            <span className="flex items-baseline gap-2">
              <span className="text-rose-400">❋</span>
              <span>Contact Sheet, DSLR</span>
            </span>
            {earliest && latest && (
              <span className="font-mono text-stone-400 dark:text-stone-500">
                {earliest.getFullYear()} / {latest.getFullYear()}
              </span>
            )}
          </div>

          <h1 className="font-serif text-[14vw] leading-[0.88] tracking-[-0.05em] text-stone-900 sm:text-[10rem] dark:text-stone-100">
            Photos<span className="text-rose-400">.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl dark:text-stone-300">
            A slow-growing roll. Shot when the camera was in the bag and the
            light was doing something. No filter presets, nothing pushed in
            post beyond a soft curve and a dust spot or two.
          </p>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y border-stone-200 py-4 text-[11px] uppercase tracking-[0.2em] text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <span className="flex items-baseline gap-2">
              <span className="font-display text-lg font-light tabular-nums text-stone-900 dark:text-stone-100">
                {String(photos.length).padStart(2, "0")}
              </span>
              frames in the roll
            </span>
            <span aria-hidden className="text-stone-300 dark:text-stone-700">·</span>
            <span>one camera, one body, no rental kit</span>
            <span aria-hidden className="text-stone-300 dark:text-stone-700">·</span>
            <span>originals kept at full resolution</span>
          </div>
        </div>
      </Container>

      {/* Hero frame. Full-bleed on mobile, framed inside a wide container
         on desktop so the opening shot commands attention the way a
         magazine cover does. */}
      {hero && (
        <div className="mt-16 mb-24 sm:mt-20 sm:mb-32">
          <PhotoHero photo={hero} index={0} />
        </div>
      )}

      {/* Remaining frames. Two-column on desktop with generous gaps so
         each photo has room to breathe, single column on mobile. */}
      {rest.length > 0 && (
        <Container className="max-w-5xl pb-32">
          {/* One column at every width — bigger frames read as
              portfolio prints rather than thumbnails, and the
              inline EXIF strip below each one wants the room. */}
          <div className="grid grid-cols-1 gap-y-24 sm:gap-y-32">
            {rest.map((p, i) => (
              <PhotoTile key={p.src} photo={p} index={i + 1} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
