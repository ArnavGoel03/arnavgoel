import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NoteCard } from "@/components/note-card";
import { getNotes } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notes",
  description: `Short writing from ${site.shortName} — rough, unfinished, occasionally useful.`,
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  const notes = getNotes();
  return (
    <Container className="max-w-3xl py-16 sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
        Notes
      </p>
      <h1 className="font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        Writing.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-stone-600">
        Short pieces — rough, unfinished, occasionally useful. I post when I
        have something worth saying, not on a schedule.
      </p>

      <div className="mt-12 grid gap-4">
        {notes.length === 0 ? (
          <p className="py-12 text-center text-stone-500">
            No notes yet. Come back soon.
          </p>
        ) : (
          notes.map((note) => <NoteCard key={note.slug} note={note} />)
        )}
      </div>
    </Container>
  );
}
