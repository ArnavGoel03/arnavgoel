import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { MdxContent } from "@/components/mdx-content";
import { NoteJsonLd } from "@/components/json-ld";
import { getAdjacentNotes, getNote, getNotes } from "@/lib/content";
import { formatReadingTime } from "@/lib/reading-time";
import { PrevNext } from "@/components/prev-next";
import { CopyLink } from "@/components/copy-link";
import { Breadcrumb } from "@/components/breadcrumb";
import { ReadingProgress } from "@/components/reading-progress";

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
  const { prev, next } = getAdjacentNotes(note.slug);

  const date = new Date(note.datePublished).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article>
      <ReadingProgress />
      <NoteJsonLd note={note} />
      <Container className="max-w-2xl py-10">
        <Breadcrumb
          trail={[
            { name: "Home", href: "/" },
            { name: "Notes", href: "/notes" },
            { name: note.title, href: `/notes/${note.slug}` },
          ]}
        />
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            <ArrowLeft className="h-4 w-4" />
            All notes
          </Link>
          <CopyLink path={`/notes/${note.slug}`} />
        </div>

        <header className="mt-8 border-b border-stone-200 pb-8 dark:border-stone-800">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
            <time dateTime={note.datePublished}>{date}</time>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="font-mono text-stone-400 dark:text-stone-500">
              {formatReadingTime(note.body)}
            </span>
            {note.tags.map((t) => (
              <span key={t}>· {t}</span>
            ))}
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 dark:text-stone-100 sm:text-5xl">
            {note.title}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-stone-600 dark:text-stone-300">
            {note.description}
          </p>
        </header>

        <div className="mt-10">
          <MdxContent source={note.body} />
        </div>

        <PrevNext
          prev={
            prev
              ? {
                  title: prev.title,
                  subtitle: prev.tags.join(", "),
                  href: `/notes/${prev.slug}`,
                }
              : null
          }
          next={
            next
              ? {
                  title: next.title,
                  subtitle: next.tags.join(", "),
                  href: `/notes/${next.slug}`,
                }
              : null
          }
          label="Notes pagination"
        />
      </Container>
    </article>
  );
}
