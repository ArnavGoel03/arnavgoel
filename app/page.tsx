import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { SocialIconLink } from "@/components/social-link";
import { NoteRow } from "@/components/note-card";
import { SectionTile } from "@/components/section-tile";
import { SpotifyEmbed } from "@/components/spotify-embed";
import { PersonJsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";
import { socials } from "@/lib/socials";
import { getNotes, getReviews } from "@/lib/content";
import { photos } from "@/lib/photos";

export default function HomePage() {
  const recentNotes = getNotes().slice(0, 4);
  const skincareCount = getReviews("skincare").length;
  const supplementsCount = getReviews("supplements").length;
  const notesCount = getNotes().length;
  const photosCount = photos.length;

  return (
    <>
      <PersonJsonLd />
      <section className="border-b border-stone-200/70 bg-gradient-to-b from-stone-50 to-white">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-stone-500">
              {site.location}
            </p>
            <h1 className="font-serif text-5xl leading-[1.05] text-stone-900 sm:text-7xl">
              {site.name}.
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-stone-600 sm:text-2xl">
              {site.bio}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {socials.map((s) => (
                <SocialIconLink key={s.label} social={s} />
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                More about me
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/now"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition-colors hover:border-stone-900"
              >
                What I&apos;m doing now
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mb-8">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500">
            Sections
          </p>
          <h2 className="font-serif text-3xl text-stone-900">Poke around.</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SectionTile
            href="/notes"
            eyebrow={`${notesCount} entries`}
            title="Notes"
            description="Short writing — thoughts, essays, whatever's on my mind."
          />
          <SectionTile
            href="/photos"
            eyebrow={`${photosCount} photos`}
            title="Photos"
            description="DSLR shots from wherever I happened to be carrying the camera."
          />
          <SectionTile
            href="/skincare"
            eyebrow={`${skincareCount} reviews`}
            title="Skincare"
            description="Every skincare product I've tried, rated and reviewed honestly."
          />
          <SectionTile
            href="/supplements"
            eyebrow={`${supplementsCount} reviews`}
            title="Supplements"
            description="Vitamins, minerals, nootropics — what I took and what I felt."
          />
        </div>
      </Container>

      <Container className="pb-16">
        <div className="mb-6">
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500">
            Listening to
          </p>
          <h2 className="font-serif text-3xl text-stone-900">
            On repeat right now.
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Press play — it opens right here.
          </p>
        </div>
        <SpotifyEmbed
          playlistId="37i9dQZF1EIhvQz3p7tStL"
          title="Ibiza Club Mix — my favorite playlist"
        />
      </Container>

      {recentNotes.length > 0 && (
        <Container className="pb-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                Notes
              </p>
              <h2 className="font-serif text-3xl text-stone-900">Recently written</h2>
            </div>
            <Link
              href="/notes"
              className="text-sm text-stone-500 transition-colors hover:text-stone-900"
            >
              All notes →
            </Link>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white px-6">
            {recentNotes.map((note) => (
              <NoteRow key={note.slug} note={note} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
