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
 * Group the post-hero gallery into editorial chapters — one per shoot.
 * Each section opens with a typographic header, an oversize anchor
 * frame, then a rhythm of full-bleed / contained / pair / offset
 * tiles so a single scroll moves through several scales.
 *
 * Section key is derived from the `location` field rather than a
 * separate `section` column: "Hotel St. James, San Diego" -> san-diego.
 * If a future shoot is in a place we haven't seen, it gets bucketed
 * under "Elsewhere" until the meta map is extended.
 */

type Slot =
  | { kind: "full"; photos: [Photo] }
  | { kind: "fullBleed"; photos: [Photo] }
  | { kind: "pair"; photos: [Photo, Photo] }
  | { kind: "left"; photos: [Photo] }
  | { kind: "right"; photos: [Photo] };

const SECTION_RHYTHM: Slot["kind"][] = [
  "pair",
  "full",
  "right",
  "pair",
  "fullBleed",
  "left",
  "pair",
  "full",
];

function buildSlots(input: Photo[]): Slot[] {
  const slots: Slot[] = [];
  let i = 0;
  let p = 0;
  while (i < input.length) {
    // Featured photos always break out into their own full-bleed slot
    // and do not advance the rhythm counter, so pairs/offsets keep their
    // intended cadence around them.
    if (input[i].featured) {
      slots.push({ kind: "fullBleed", photos: [input[i]] });
      i += 1;
      continue;
    }
    const kind = SECTION_RHYTHM[p % SECTION_RHYTHM.length];
    p++;
    if (kind === "pair") {
      // Don't pair a regular photo with a featured one, since the
      // featured photo wants its own spread.
      if (i + 1 < input.length && !input[i + 1].featured) {
        slots.push({ kind: "pair", photos: [input[i], input[i + 1]] });
        i += 2;
      } else {
        slots.push({ kind: "full", photos: [input[i]] });
        i += 1;
      }
    } else {
      slots.push({ kind, photos: [input[i]] } as Slot);
      i += 1;
    }
  }
  return slots;
}

type SectionKey = "san-diego" | "joshua-tree" | "elsewhere";

const SECTION_META: Record<SectionKey, { place: string; region: string }> = {
  "san-diego": { place: "San Diego", region: "California" },
  "joshua-tree": { place: "Joshua Tree", region: "California" },
  elsewhere: { place: "Elsewhere", region: "" },
};

function sectionKeyOf(photo: Photo): SectionKey {
  const loc = (photo.location ?? "").toLowerCase();
  if (loc.includes("joshua tree")) return "joshua-tree";
  if (loc.includes("san diego") || loc.includes("ucsd")) return "san-diego";
  return "elsewhere";
}

type Section = {
  key: SectionKey;
  number: string; // "01"
  place: string;
  region: string;
  monthLabel: string; // "December 2023"
  count: number;
  anchor: Photo;
  rest: Photo[];
};

function monthLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function buildSections(photos: Photo[]): Section[] {
  const groups = new Map<SectionKey, Photo[]>();
  for (const p of photos) {
    const k = sectionKeyOf(p);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(p);
  }
  const ordered: { key: SectionKey; photos: Photo[]; latest: number }[] = [];
  for (const [key, ps] of groups) {
    ps.sort((a, b) => b.date.localeCompare(a.date));
    const latest = new Date(ps[0].date).getTime();
    ordered.push({ key, photos: ps, latest });
  }
  ordered.sort((a, b) => b.latest - a.latest);
  return ordered.map((o, idx) => ({
    key: o.key,
    number: String(idx + 1).padStart(2, "0"),
    place: SECTION_META[o.key].place,
    region: SECTION_META[o.key].region,
    monthLabel: monthLabel(o.photos[0].date),
    count: o.photos.length,
    anchor: o.photos[0],
    rest: o.photos.slice(1),
  }));
}

export default function PhotosPage() {
  const earliest = photos.length
    ? new Date(Math.min(...photos.map((p) => new Date(p.date).getTime())))
    : null;
  const latest = photos.length
    ? new Date(Math.max(...photos.map((p) => new Date(p.date).getTime())))
    : null;

  const heroIdx = photos.findIndex((p) => p.hero);
  const hero = heroIdx >= 0 ? photos[heroIdx] : photos[0];
  const rest = photos.filter((p) => p.src !== hero?.src);
  const sections = buildSections(rest);

  let frame = 1; // page-wide frame counter

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
            <span>
              {sections.length}{" "}
              {sections.length === 1 ? "chapter" : "chapters"}
            </span>
            <span aria-hidden className="text-stone-300 dark:text-stone-700">·</span>
            <span>originals kept at full resolution</span>
          </div>
        </div>
      </Container>

      {/* Page-level cover frame. Full-bleed on mobile, framed inside a wide
          container on desktop so the opening shot commands attention. */}
      {hero && (
        <div className="mt-16 mb-32 sm:mt-24 sm:mb-40">
          <PhotoHero photo={hero} index={0} />
        </div>
      )}

      {/* Editorial sections — one per shoot. */}
      {sections.map((section, sectionIdx) => {
        const slots = buildSlots(section.rest);
        const anchorIdx = frame++;
        return (
          <section
            key={section.key}
            className="border-t border-stone-200 pt-16 pb-32 sm:pt-24 sm:pb-40 dark:border-stone-800"
          >
            {/* Chapter header */}
            <Container className="max-w-5xl">
              <div className="mb-12 flex flex-wrap items-baseline justify-between gap-y-4 sm:mb-16">
                <div className="flex items-baseline gap-6 sm:gap-8">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-rose-400">
                    Chapter {section.number}
                  </span>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-400 tabular-nums dark:text-stone-500">
                  {String(section.count).padStart(2, "0")} frames
                </span>
              </div>
              <h2 className="font-serif text-6xl leading-[0.95] tracking-tight text-stone-900 sm:text-8xl dark:text-stone-100">
                {section.place}
                <span className="text-rose-400">.</span>
              </h2>
              <p className="mt-4 font-serif text-lg italic text-stone-500 sm:text-xl dark:text-stone-400">
                {section.monthLabel}
                {section.region && (
                  <>
                    <span aria-hidden className="mx-3 text-stone-300 dark:text-stone-700">
                      ·
                    </span>
                    <span className="not-italic font-mono text-[11px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                      {section.region}
                    </span>
                  </>
                )}
              </p>
            </Container>

            {/* Section anchor — oversize full-bleed moment */}
            <div className="mt-16 mb-24 sm:mt-20 sm:mb-32">
              <PhotoHero photo={section.anchor} index={anchorIdx - 1} />
            </div>

            {/* Rhythm slots */}
            <div className="space-y-24 sm:space-y-32">
              {slots.map((slot, slotIdx) => {
                if (slot.kind === "fullBleed") {
                  const idx = frame++;
                  return (
                    <div key={`fb-${sectionIdx}-${slotIdx}`}>
                      <PhotoHero photo={slot.photos[0]} index={idx - 1} />
                    </div>
                  );
                }
                if (slot.kind === "full") {
                  const idx = frame++;
                  return (
                    <Container key={`f-${sectionIdx}-${slotIdx}`} className="max-w-5xl">
                      <PhotoTile photo={slot.photos[0]} index={idx} />
                    </Container>
                  );
                }
                if (slot.kind === "pair") {
                  const a = frame++;
                  const b = frame++;
                  return (
                    <Container key={`p-${sectionIdx}-${slotIdx}`} className="max-w-6xl">
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
                    <div key={`r-${sectionIdx}-${slotIdx}`} className="px-6">
                      <div className="ml-auto max-w-3xl">
                        <PhotoTile photo={slot.photos[0]} index={idx} />
                      </div>
                    </div>
                  );
                }
                const idx = frame++;
                return (
                  <div key={`l-${sectionIdx}-${slotIdx}`} className="px-6">
                    <div className="mr-auto max-w-3xl">
                      <PhotoTile photo={slot.photos[0]} index={idx} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
