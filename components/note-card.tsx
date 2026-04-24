import Link from "next/link";
import type { NoteSummary } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function NoteCard({ note }: { note: NoteSummary }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-600"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
        <time dateTime={note.datePublished}>{formatDate(note.datePublished)}</time>
        {note.tags.length > 0 && <span>·</span>}
        {note.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <h3 className="font-serif text-xl leading-snug text-stone-900 transition-colors group-hover:text-stone-700 dark:text-stone-100 dark:group-hover:text-stone-300">
        {note.title}
      </h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
        {note.description}
      </p>
    </Link>
  );
}

export function NoteRow({ note }: { note: NoteSummary }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group flex items-baseline justify-between gap-6 border-b border-stone-100 py-4 last:border-none dark:border-stone-800"
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg leading-snug text-stone-900 transition-colors group-hover:text-stone-500 dark:text-stone-100 dark:group-hover:text-stone-400">
          {note.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-stone-500 dark:text-stone-400">
          {note.description}
        </p>
      </div>
      <time
        dateTime={note.datePublished}
        className="shrink-0 font-mono text-xs tabular-nums text-stone-400 dark:text-stone-500"
      >
        {formatDate(note.datePublished)}
      </time>
    </Link>
  );
}
