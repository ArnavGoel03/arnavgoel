import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PhotoHero, PhotoTile } from "@/components/photo-tile";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import type { Photo } from "@/lib/types";

export const metadata: Metadata = {
  title: "Photos",
  description: `DSLR photography by ${site.name}.`,
  alternates: { canonical: "/photos" },
};

/**
 * Group the gallery (everything after the hero) into magazine-style
 * slots so the page does not read as one identical column. The pattern
 * cycles full / pair / right-offset / pair / left-offset / pair, which
 * gives the eye a left-right rhythm and three different scales without
 * ever feeling random.
 */
type Slot =
  | { kind: "full"; photos: [Photo] }
  | { kind: "pair"; photos: [Photo, Photo] }
  | { kind: "left"; photos: [Photo] }
  | { kind: "right"; photos: [Photo] };

const RHYTHM: Slot["kind"][] = [
  "full",
  "pair",
  "right",
  "pair",
  "left",
  "pair",
  "full",
];

function buildSlots(input: Photo[]): Slot[] {
  const slots: Slot[] = [];
  let i = 0;
  let p = 0;
  while (i < input.length) {
    const kind = RHYTHM[p % RHYTHM.length];
    p++;
    if (kind === "pair" && i + 1 < input.length) {
      slots.push({ kind: "pair", photos: [input[i], input[i + 1]] });
      i += 2;
    } else if (kind === "pair") {
      slots.push({ kind: "full", photos: [input[i]] });
      i += 1;
    } else {
      slots.push({ kind, photos: [input[i]] } as Slot);
      i += 1;
    }
  }
  return slots;
}

export default function PhotosPage() {
  const earliest = photos.length
    ? new Date(Math.min(...photos.map((p) => new Date(p.date).getTime())))
    : null;
  const latest = photos.length
    ? new Date(Math.max(...photos.map((p) => new Date(p.date).getTime())))
    : null;

  // Hero: explicit `hero: true` wins, fallback to first (newest by date).
  const heroIdx = photos.findIndex((p) => p.hero);
  const hero = heroIdx >= 0 ? photos[heroIdx] : photos[0];
  const rest = photos.filter((p) => p.src !== hero?.src);
  const slots = buildSlots(rest);

  let frame = 1; // 1-indexed counter that flows through every slot

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
        <div className="mt-16 mb-32 sm:mt-24 sm:mb-40">
          <PhotoHero photo={hero} index={0} />
        </div>
      )}

      {/* Rhythm gallery: full / pair / offset slots interleave so no
          two screens-worth read the same. */}
      {slots.length > 0 && (
        <div className="space-y-24 pb-32 sm:space-y-32">
          {slots.map((slot, slotIdx) => {
            if (slot.kind === "full") {
              const idx = frame++;
              return (
                <Container key={`s-${slotIdx}`} className="max-w-5xl">
                  <PhotoTile photo={slot.photos[0]} index={idx} />
                </Container>
              );
            }
            if (slot.kind === "pair") {
              const a = frame++;
              const b = frame++;
              return (
                <Container key={`s-${slotIdx}`} className="max-w-6xl">
                  <div className="grid grid-cols-1 gap-y-16 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-0">
                    <PhotoTile photo={slot.photos[0]} index={a} />
                    <div className="sm:mt-24">
                      <PhotoTile photo={slot.photos[1]} index={b} />
                    </div>
                  </div>
                </Container>
              );
            }
            if (slot.kind === "right") {
              const idx = frame++;
              return (
                <div key={`s-${slotIdx}`} className="px-6">
                  <div className="ml-auto max-w-3xl">
                    <PhotoTile photo={slot.photos[0]} index={idx} />
                  </div>
                </div>
              );
            }
            // left
            const idx = frame++;
            return (
              <div key={`s-${slotIdx}`} className="px-6">
                <div className="mr-auto max-w-3xl">
                  <PhotoTile photo={slot.photos[0]} index={idx} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
