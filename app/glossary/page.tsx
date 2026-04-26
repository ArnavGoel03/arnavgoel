import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { GLOSSARY } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Quick definitions for the skincare and supplement terms that show up across the reviews. Active vs occlusive, AHA vs BHA, magnesium glycinate vs L-threonate, the lot.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  const sorted = [...GLOSSARY].sort((a, b) =>
    a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
  );
  const grouped = new Map<string, typeof sorted>();
  for (const e of sorted) {
    const letter = e.term.charAt(0).toUpperCase();
    if (!grouped.has(letter)) grouped.set(letter, []);
    grouped.get(letter)!.push(e);
  }

  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Quick definitions</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">
          {sorted.length} entries
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Glossary<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        The terms readers keep encountering across the reviews, defined in
        one paragraph each. Different from the primers (which go deep);
        this is the quick-reference card.
      </p>

      <nav className="mt-12 flex flex-wrap gap-2" aria-label="Jump to letter">
        {[...grouped.keys()].map((letter) => (
          <a
            key={letter}
            href={`#${letter}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 font-mono text-xs text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-400 dark:hover:text-stone-100"
          >
            {letter}
          </a>
        ))}
      </nav>

      <dl className="mt-12 space-y-12">
        {[...grouped.entries()].map(([letter, entries]) => (
          <section key={letter} id={letter}>
            <h2 className="mb-6 border-b border-stone-200 pb-2 font-display text-3xl font-light tracking-tight text-stone-300 dark:border-stone-800 dark:text-stone-700">
              {letter}
            </h2>
            <div className="space-y-8">
              {entries.map((e) => (
                <div key={e.term}>
                  <dt className="flex flex-wrap items-baseline gap-3">
                    <span className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                      {e.term}
                    </span>
                    {e.also && e.also.length > 0 && (
                      <span className="font-serif italic text-stone-400 dark:text-stone-500">
                        also: {e.also.join(", ")}
                      </span>
                    )}
                    <span
                      className={
                        "ml-auto rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] " +
                        (e.domain === "skincare"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                          : e.domain === "supplement"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400")
                      }
                    >
                      {e.domain}
                    </span>
                  </dt>
                  <dd className="mt-3 max-w-prose leading-relaxed text-stone-700 dark:text-stone-300">
                    {e.body}
                  </dd>
                  {e.seeAlso && e.seeAlso.length > 0 && (
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                      See also:{" "}
                      {e.seeAlso.map((s, i) => (
                        <span key={s.href}>
                          {i > 0 && " · "}
                          <Link
                            href={s.href}
                            className="text-stone-600 underline-offset-4 transition-colors hover:text-rose-700 hover:underline dark:text-stone-300 dark:hover:text-rose-400"
                          >
                            {s.label}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </dl>
    </Container>
  );
}
