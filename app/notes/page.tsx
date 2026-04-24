import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { getNotes } from "@/lib/content";
import { site } from "@/lib/site";
import type { NoteSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "Notes",
  description: `Short writing from ${site.shortName}, rough, unfinished, occasionally useful.`,
  alternates: { canonical: "/notes" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function groupByYear(notes: NoteSummary[]): { year: string; items: NoteSummary[] }[] {
  const map = new Map<string, NoteSummary[]>();
  for (const n of notes) {
    const y = new Date(n.datePublished).getFullYear().toString();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(n);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, items]) => ({ year, items }));
}

export default function NotesPage() {
  const notes = getNotes();
  const groups = groupByYear(notes);
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="max-w-4xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>The Writing Room</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">
          {today}
        </span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 dark:text-stone-100 sm:text-8xl">
        Notes<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 dark:text-stone-300 sm:text-2xl">
        Rough, occasional, mine. Posted when I have something worth saying, never on a schedule.
      </p>

      {notes.length === 0 ? (
        <p className="mt-16 py-12 text-center text-stone-500 dark:text-stone-400">
          No notes yet. Come back soon.
        </p>
      ) : (
        <div className="mt-16 space-y-16 border-t border-stone-300 pt-10 dark:border-stone-800">
          {groups.map(({ year, items }) => (
            <section key={year}>
              <div className="mb-6 flex items-baseline justify-between border-b border-stone-200 pb-2 dark:border-stone-800">
                <h2 className="font-display text-5xl font-light tracking-tight tabular-nums text-stone-900 dark:text-stone-100 sm:text-6xl">
                  {year}
                </h2>
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                  {items.length} {items.length === 1 ? "entry" : "entries"}
                </span>
              </div>
              <ol className="divide-y divide-stone-100 dark:divide-stone-800">
                {items.map((n, i) => (
                  <li key={n.slug}>
                    <Link
                      href={`/notes/${n.slug}`}
                      className="group flex items-baseline gap-6 py-6 transition-colors"
                    >
                      <span className="hidden w-10 shrink-0 font-mono text-xs text-stone-400 tabular-nums dark:text-stone-500 sm:inline-block">
                        №&nbsp;{String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-2xl leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-rose-700 dark:text-stone-100 dark:group-hover:text-rose-400 sm:text-3xl">
                          {n.title}
                        </h3>
                        <p className="mt-2 font-serif text-base italic leading-relaxed text-stone-600 dark:text-stone-300">
                          {n.description}
                        </p>
                        {n.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-x-3 text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                            {n.tags.map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <time
                        dateTime={n.datePublished}
                        className="shrink-0 font-mono text-xs uppercase tracking-wider text-stone-400 tabular-nums dark:text-stone-500"
                      >
                        {formatDate(n.datePublished)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
