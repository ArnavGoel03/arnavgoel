import type { Metadata } from "next";
import { Container } from "@/components/container";
import {
  BUCKET_COLOR,
  BUCKET_LABEL,
  getChangelog,
  groupByMonth,
} from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Release notes for the site itself, generated from git log. What changed, when, and why.",
  alternates: { canonical: "/changelog" },
};

export const dynamic = "force-static";
export const revalidate = 3600;

function dayLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ChangelogPage() {
  const entries = getChangelog(150);
  const grouped = groupByMonth(entries);

  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>What changed, when</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">
          {entries.length} commits
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Changelog<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        Auto-generated from <code>git log</code>. Every commit on{" "}
        <code>main</code> ends up here. Routed into buckets by the leading
        verb of the commit title.
      </p>

      {entries.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center font-serif italic text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
          Could not read git log at build time.
        </p>
      ) : (
        <div className="mt-16 space-y-16">
          {grouped.map((group) => (
            <section key={group.month} aria-labelledby={`m-${group.month}`}>
              <h2
                id={`m-${group.month}`}
                className="mb-6 border-b border-stone-200 pb-3 font-display text-3xl font-light tracking-tight text-stone-900 dark:border-stone-800 dark:text-stone-100"
              >
                {group.label}
                <span className="ml-3 text-sm uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                  {group.entries.length} change{group.entries.length === 1 ? "" : "s"}
                </span>
              </h2>
              <ol className="space-y-5">
                {group.entries.map((e) => (
                  <li
                    key={e.hash}
                    className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[6.5rem_1fr]"
                  >
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                        {dayLabel(e.date)}
                      </span>
                      <span
                        className={
                          "rounded-full bg-stone-100 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] " +
                          BUCKET_COLOR[e.bucket] +
                          " dark:bg-stone-800"
                        }
                      >
                        {BUCKET_LABEL[e.bucket]}
                      </span>
                    </div>
                    <div>
                      <p className="font-serif text-base text-stone-900 dark:text-stone-100">
                        {e.title}
                      </p>
                      {e.body && (
                        <p className="mt-1 max-w-prose whitespace-pre-wrap text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                          {e.body}
                        </p>
                      )}
                      <p className="mt-1 font-mono text-[10px] text-stone-300 dark:text-stone-700">
                        {e.shortHash}
                      </p>
                    </div>
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
