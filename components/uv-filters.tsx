import { findUVFilter } from "@/lib/uv-filters";

/**
 * Renders the UV filter audit for a sunscreen as a small editorial
 * table: each filter labelled organic/inorganic, modern/legacy, with
 * the spectrum coverage and a one-line note. Auto-derives from the
 * `uvFilters` frontmatter array; if a filter isn't in the lookup
 * table, it shows the raw INCI with a small "unrecognised" tag so
 * the author knows to extend lib/uv-filters.ts.
 */
export function UVFilters({ filters }: { filters: string[] }) {
  if (!filters || filters.length === 0) return null;

  const rows = filters.map((name) => {
    const cleaned = name.replace(/\s*\d+(\.\d+)?%\s*$/, "").trim();
    const entry = findUVFilter(cleaned);
    return { raw: name, cleaned, entry };
  });

  const counts = {
    organic: rows.filter((r) => r.entry?.type === "organic").length,
    inorganic: rows.filter((r) => r.entry?.type === "inorganic").length,
    modern: rows.filter((r) => r.entry?.generation === "modern").length,
    legacy: rows.filter((r) => r.entry?.generation === "legacy").length,
  };

  return (
    <section className="my-8 rounded-2xl border border-stone-200 bg-stone-50/60 p-5 dark:border-stone-800 dark:bg-stone-900/40">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-stone-200 pb-3 dark:border-stone-800">
        <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100">
          UV filters
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
          {counts.organic > 0 && <span>{counts.organic} organic</span>}
          {counts.organic > 0 && counts.inorganic > 0 && (
            <span className="mx-1.5 text-stone-300 dark:text-stone-700">·</span>
          )}
          {counts.inorganic > 0 && <span>{counts.inorganic} mineral</span>}
          {(counts.modern > 0 || counts.legacy > 0) && (
            <span className="mx-1.5 text-stone-300 dark:text-stone-700">·</span>
          )}
          {counts.modern > 0 && <span>{counts.modern} modern</span>}
          {counts.modern > 0 && counts.legacy > 0 && (
            <span className="mx-1.5 text-stone-300 dark:text-stone-700">·</span>
          )}
          {counts.legacy > 0 && <span>{counts.legacy} legacy</span>}
        </p>
      </header>
      <ul className="divide-y divide-stone-200 dark:divide-stone-800">
        {rows.map((row, i) => (
          <li
            key={`${row.cleaned}-${i}`}
            className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-serif text-base leading-tight text-stone-900 dark:text-stone-100">
                {row.entry?.alias ?? row.cleaned}
              </p>
              {row.entry?.alias && (
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                  {row.entry.inci}
                </p>
              )}
              {row.entry && (
                <p className="mt-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                  {row.entry.note}
                </p>
              )}
              {!row.entry && (
                <p className="mt-1 text-xs italic text-stone-400 dark:text-stone-500">
                  Not yet in lookup — add to <code className="font-mono">lib/uv-filters.ts</code>.
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.16em]">
              {row.entry && (
                <span
                  className={
                    "rounded-full px-2 py-0.5 " +
                    (row.entry.type === "organic"
                      ? "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300")
                  }
                >
                  {row.entry.type === "organic" ? "Chemical" : "Mineral"}
                </span>
              )}
              {row.entry && (
                <span
                  className={
                    "rounded-full px-2 py-0.5 " +
                    (row.entry.generation === "modern"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300")
                  }
                >
                  {row.entry.generation === "modern" ? "Modern" : "Legacy"}
                </span>
              )}
              {row.entry?.coverage.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-stone-300 px-2 py-0.5 text-stone-600 dark:border-stone-700 dark:text-stone-400"
                >
                  {c}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
