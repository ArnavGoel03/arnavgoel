import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { SocialIconLink } from "@/components/social-link";
import { NoteRow } from "@/components/note-card";
import { SectionTile } from "@/components/section-tile";
import { ProductCard } from "@/components/product-card";
import { SpotifyEmbed } from "@/components/spotify-embed";
import { PersonJsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";
import { socials } from "@/lib/socials";
import { getAllReviews, getNotes, getReviews } from "@/lib/content";
import { photos } from "@/lib/photos";

export default function HomePage() {
  const recentNotes = getNotes().slice(0, 4);
  const allReviews = getAllReviews();
  const recentReviews = allReviews.slice(0, 3);
  const skincareCount = getReviews("skincare").length;
  const supplementsCount = getReviews("supplements").length;
  const oralCareCount = getReviews("oral-care").length;
  const hairCareCount = getReviews("hair-care").length;
  const bodyCareCount = getReviews("body-care").length;
  const totalReviews =
    skincareCount + supplementsCount + oralCareCount + hairCareCount + bodyCareCount;
  const notesCount = getNotes().length;
  const photosCount = photos.length;
  // Hero strip stats: every value comes from the actual content set so
  // the line stays honest as the catalog grows. No more hardcoded
  // "0 sponsored / ∞ unfiltered" placeholders.
  const recommendCount = allReviews.filter(
    (r) => r.verdict === "recommend",
  ).length;
  const testingCount = allReviews.filter((r) => !r.verdict).length;

  return (
    <>
      <PersonJsonLd />

      {/* Hero, magazine cover. `bg-paper-grain` overlays a 1 KB SVG
          noise so the rose wash reads as printed paper, not a flat
          gradient — the analog texture is what separates editorial
          from generic. */}
      <section className="bg-paper-grain relative overflow-hidden border-b border-stone-300 bg-gradient-to-b from-stone-50 via-stone-50 to-white dark:border-stone-800 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900">
        <Container className="relative z-10 pt-12 pb-20 sm:pt-16 sm:pb-28">
          {/* Masthead rule: location · issue · date */}
          <div className="mb-10 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
            <span className="flex items-baseline gap-2">
              {/* Hero rose drifts on a 60s loop — ambient, not a
                  spinner. Reduced-motion sees a still mark. */}
              <span className="rose-drift text-rose-400">❋</span>
              <span>{site.location}</span>
            </span>
            <span className="font-mono text-stone-400 dark:text-stone-500">
              Issue №{" "}
              {String(totalReviews + photosCount + notesCount).padStart(2, "0")}
            </span>
          </div>

          <div className="max-w-3xl">
            {/* Italic editorial label */}
            <p className="font-serif text-xl italic text-stone-500 dark:text-stone-400 sm:text-2xl">
              An honest catalog of
            </p>

            <h1 className="mt-2 font-serif text-[14vw] leading-[0.92] tracking-[-0.045em] text-stone-900 dark:text-stone-100 sm:text-8xl">
              {site.name}
              <span className="text-rose-400">.</span>
            </h1>

            <p className="mt-8 max-w-2xl font-serif text-xl leading-snug text-stone-600 dark:text-stone-300 sm:text-2xl">
              {site.bio}
            </p>

            {/* Trust strip, newsstand-style. All counts derive from the
                live content set, so the line stays accurate as products
                are added or move between verdict states. */}
            <div
              data-tour="stats"
              className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-stone-200 py-5 dark:border-stone-800"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-light tabular-nums text-stone-900 dark:text-stone-100">
                  {totalReviews}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                  reviews
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-light tabular-nums text-stone-900 dark:text-stone-100">
                  {recommendCount}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                  recommend
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-light tabular-nums text-stone-900 dark:text-stone-100">
                  {testingCount}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                  still testing
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {socials.map((s) => (
                <SocialIconLink key={s.label} social={s} />
              ))}
            </div>

            <div data-tour="cta" className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/skincare"
                className="group inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                Read the latest reviews
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/now"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition-colors hover:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-400"
              >
                What&apos;s on the shelf this month
              </Link>
            </div>
          </div>
        </Container>
        {/* Editorial rose wash. Sits behind the content (z-0) so the
            soft tint never crawls over the headline or stats — that
            was the contrast hit reported on light mode. Top-right blob
            runs in both modes; the bottom-left companion is light-only
            because the user did not want dark mode touched.
            dark:hidden removes the second blob entirely at night. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 z-0 h-[34rem] w-[34rem] rounded-full bg-rose-200/45 blur-3xl dark:bg-rose-900/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 z-0 h-[22rem] w-[22rem] rounded-full bg-rose-100/40 blur-3xl dark:hidden"
        />
      </section>

      {/* Currently on the shelf */}
      {recentReviews.length > 0 && (
        <Container className="py-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                <span className="text-rose-400">★</span>{" "}
                Just added
              </p>
              <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100 sm:text-4xl">
                On the shelf right now.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-stone-500 dark:text-stone-400">
                The most recent products through the routine. Each one used
                long enough to have an honest opinion.
              </p>
            </div>
            <Link
              href="/skincare"
              className="hidden whitespace-nowrap text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 sm:inline-flex"
            >
              All reviews →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentReviews.map((r) => (
              <ProductCard key={`${r.kind}-${r.slug}`} review={r} />
            ))}
          </div>
        </Container>
      )}

      {/* Sections */}
      <Container className="border-t border-stone-200/70 py-20 dark:border-stone-900/40">
        <div className="mb-10">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
            <span className="text-rose-400">✷</span> Sections
          </p>
          <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100 sm:text-4xl">
            Poke around.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { index: 1, href: "/skincare", eyebrow: `${skincareCount} reviews`, title: "Skincare", description: "Cleansers, serums, moisturizers, sunscreens, every product that's lived on my face for a month." },
            { index: 2, href: "/supplements", eyebrow: `${supplementsCount} reviews`, title: "Supplements", description: "Vitamins, minerals, nootropics. What I took, how long, and what I actually felt." },
            { index: 3, href: "/oral-care", eyebrow: `${oralCareCount} reviews`, title: "Oral care", description: "Electric brushes, pastes, mouthwash, for teeth, breath, and gums." },
            { index: 4, href: "/hair-care", eyebrow: `${hairCareCount} reviews`, title: "Hair care", description: "Conditioners, masks, treatments, what lives in the shower for hair, scalp, and ends." },
            { index: 5, href: "/body-care", eyebrow: `${bodyCareCount} reviews`, title: "Body care", description: "Body washes, lotions, scrubs, the everyday cleanse-and-moisturise from the neck down." },
            { index: 6, href: "/photos", eyebrow: `${photosCount} photos`, title: "Photos", description: "DSLR shots from wherever I happened to be carrying the camera." },
            { index: 7, href: "/notes", eyebrow: `${notesCount} entries`, title: "Notes", description: "Slow writing, essays, stray thoughts, half-formed ideas." },
            { index: 8, href: "/now", eyebrow: "this month", title: "Now", description: "What I'm currently working on, listening to, thinking about, and consciously not doing." },
          ].map((tile, i) => (
            <div
              key={tile.href}
              className="card-stagger-in"
              style={{ "--stagger": `${i * 35}ms` } as React.CSSProperties}
            >
              <SectionTile {...tile} />
            </div>
          ))}
        </div>
      </Container>

      {/* Listening */}
      <Container className="border-t border-stone-200/70 py-20 dark:border-stone-900/40">
        <div className="mb-6">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
            <span className="text-rose-400">♪</span> Listening to
          </p>
          <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100 sm:text-4xl">
            On repeat right now.
          </h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Press play, it opens right here.
          </p>
        </div>
        <SpotifyEmbed
          playlistId="37i9dQZF1EIhvQz3p7tStL"
          title="Ibiza Club Mix, my favorite playlist"
        />
      </Container>

      {/* Recent notes */}
      {recentNotes.length > 0 && (
        <Container className="border-t border-stone-200/70 py-20 dark:border-stone-900/40">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                <span className="text-rose-400">¶</span> Notes
              </p>
              <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100 sm:text-4xl">
                Recently written.
              </h2>
            </div>
            <Link
              href="/notes"
              className="inline-flex items-center gap-1 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
              All notes
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white px-6 dark:border-stone-800 dark:bg-stone-900">
            {recentNotes.map((note) => (
              <NoteRow key={note.slug} note={note} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
