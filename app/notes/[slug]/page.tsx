import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { MdxContent } from "@/components/mdx-content";
import { NoteJsonLd } from "@/components/json-ld";
import { getNote, getNotes } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.description,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.description,
      publishedTime: note.datePublished,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const date = new Date(note.datePublished).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article>
      <NoteJsonLd note={note} />
      <Container className="max-w-2xl py-10">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          All notes
        </Link>

        <header className="mt-8 border-b border-stone-200 pb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
            <time dateTime={note.datePublished}>{date}</time>
            {note.tags.map((t) => (
              <span key={t}>· {t}</span>
            ))}
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
            {note.title}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-stone-600">
            {note.description}
          </p>
        </header>

        <div className="mt-10">
          <MdxContent source={note.body} />
        </div>
      </Container>
    </article>
  );
}
