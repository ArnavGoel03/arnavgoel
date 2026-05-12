import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PhotoHero, PhotoSideCaption, PhotoTile } from "@/components/photo-tile";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import type { Photo } from "@/lib/types";

export const metadata: Metadata = {
  title: "Photos",
  description: `DSLR photography by ${site.name}.`,
  alternates: { canonical: "/photos" },
};

/**
 * Editorial chapters with mixed-scale rhythm. Each chapter opens with
 * a typographic header, an oversize anchor frame, and then cycles a
 * pattern of full / fullBleed / asymmetric diptych / right / left /
 * sideCaption slots so the eye keeps recalibrating instead of falling
 * into a feed cadence. Chapter closes with a quiet ❋ glyph that
 * stamps the section like a printed photo essay.
 */

type Slot =
  | { kind: "full"; photos: [Photo] }
  | { kind: "fullBleed"; photos: [Photo] }
  | { kind: "diptych"; photos: [Photo, Photo] }
  | { kind: "sideCaptionLeft"; photos: [Photo] }
  | { kind: "sideCaptionRight"; photos: [Photo] }
  | { kind: "left"; photos: [Photo] }
  | { kind: "right"; photos: [Photo] };

const SECTION_RHYTHM: Slot["kind"][] = [
  "diptych",
  "sideCaptionLeft",
  "right",
  "diptych",
  "fullBleed",
  "left",
  "sideCaptionRight",
  "diptych",
  "full",
];

function buildSlots(input: Photo[]): Slot[] {
  const slots: Slot[] = [];
  let i = 0;
  let p = 0;
  while (i < input.length) {
    if (input[i].featured) {
      slots.push({ kind: "fullBleed", photos: [input[i]] });
      i += 1;
      continue;
    }
    const kind = SECTION_RHYTHM[p % SECTION_RHYTHM.length];
    p++;
    if (kind === "diptych") {
      if (i + 1 < input.length && !input[i + 1].featured) {
        slots.push({ kind: "diptych", photos: [input[i], input[i + 1]] });
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
  number: string;
  place: string;
  region: string;
  monthLabel: string;
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

  let frame = 1;

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

      {hero && (
        <div className="mt-16 mb-32 sm:mt-24 sm:mb-44">
          <PhotoHero photo={hero} index={0} />
        </div>
      )}

      {sections.map((section, sectionIdx) => {
        const slots = buildSlots(section.rest);
        const anchorIdx = frame++;
        const isLast = sectionIdx === sections.length - 1;
        return (
          <section
            key={section.key}
            className="border-t border-stone-200 pt-20 pb-24 sm:pt-28 sm:pb-32 dark:border-stone-800"
          >
            {/* Chapter header — more typography-led */}
            <Container className="max-w-5xl">
              <div className="mb-12 flex items-baseline gap-4 sm:mb-20">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-rose-400">
                  Chapter {section.number}
                </span>
                <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-400 tabular-nums dark:text-stone-500">
                  {String(section.count).padStart(2, "0")} frames
                </span>
              </div>
              <h2 className="font-serif text-7xl italic leading-[0.95] tracking-tight text-stone-900 sm:text-[9rem] dark:text-stone-100">
                {section.place}
                <span className="not-italic text-rose-400">.</span>
              </h2>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-serif text-lg italic text-stone-500 sm:text-xl dark:text-stone-400">
                <span>{section.monthLabel}</span>
                {section.region && (
                  <>
                    <span aria-hidden className="text-stone-300 not-italic dark:text-stone-700">
                      —
                    </span>
                    <span className="not-italic font-mono text-[11px] uppercase tracking-[0.25em] text-stone-400 dark:text-stone-500">
                      {section.region}
                    </span>
                  </>
                )}
              </p>
            </Container>

            {/* Section anchor */}
            <div className="mt-16 mb-24 sm:mt-24 sm:mb-36">
              <PhotoHero photo={section.anchor} index={anchorIdx - 1} />
            </div>

            {/* Rhythm slots */}
            <div className="space-y-28 sm:space-y-40">
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
                if (slot.kind === "diptych") {
                  const a = frame++;
                  const b = frame++;
                  // Asymmetric 7/5 with vertical offset on the smaller one.
                  // Alternate which side is the big one based on slot index
                  // to keep the rhythm from feeling templated.
                  const bigOnLeft = (slotIdx % 2) === 0;
                  return (
                    <Container key={`d-${sectionIdx}-${slotIdx}`} className="max-w-6xl">
                      <div className="grid grid-cols-1 gap-y-16 sm:grid-cols-12 sm:gap-x-8 sm:gap-y-0">
                        {bigOnLeft ? (
                          <>
                            <div className="sm:col-span-7">
                              <PhotoTile photo={slot.photos[0]} index={a} />
                            </div>
                            <div className="sm:col-span-5 sm:mt-32">
                              <PhotoTile photo={slot.photos[1]} index={b} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="sm:col-span-5 sm:mt-32">
                              <PhotoTile photo={slot.photos[0]} index={a} />
                            </div>
                            <div className="sm:col-span-7">
                              <PhotoTile photo={slot.photos[1]} index={b} />
                            </div>
                          </>
                        )}
                      </div>
                    </Container>
                  );
                }
                if (slot.kind === "sideCaptionLeft") {
                  const idx = frame++;
                  return (
                    <Container key={`sl-${sectionIdx}-${slotIdx}`} className="max-w-6xl">
                      <PhotoSideCaption
                        photo={slot.photos[0]}
                        index={idx}
                        side="left"
                      />
                    </Container>
                  );
                }
                if (slot.kind === "sideCaptionRight") {
                  const idx = frame++;
                  return (
                    <Container key={`sr-${sectionIdx}-${slotIdx}`} className="max-w-6xl">
                      <PhotoSideCaption
                        photo={slot.photos[0]}
                        index={idx}
                        side="right"
                      />
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

            {/* Chapter closer — quiet typographic stamp */}
            <div
              aria-hidden
              className="mx-auto mt-28 flex max-w-5xl flex-col items-center gap-4 px-6 text-center sm:mt-36"
            >
              <span className="text-2xl text-rose-400">❋</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-stone-400 dark:text-stone-500">
                End of Chapter {section.number}
                {!isLast && (
                  <>
                    <span aria-hidden className="mx-3 text-stone-300 dark:text-stone-700">·</span>
                    <span>Turn the page</span>
                  </>
                )}
              </span>
            </div>
          </section>
        );
      })}
    </>
  );
}
