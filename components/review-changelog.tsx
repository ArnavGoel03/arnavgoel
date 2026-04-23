import type { Review } from "@/lib/types";

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewChangelog({ review }: { review: Review }) {
  if (review.changelog.length === 0) return null;
  const entries = [...review.changelog].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return (
    <details className="group rounded-2xl border border-stone-200 bg-white p-6">
      <summary className="cursor-pointer list-none text-[11px] uppercase tracking-[0.22em] text-stone-500 transition-colors hover:text-stone-900">
        <span className="inline-flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Changelog</span>
          <span className="ml-2 font-mono text-stone-400">
            {entries.length} entr{entries.length === 1 ? "y" : "ies"}
          </span>
        </span>
      </summary>
      <ol className="mt-4 space-y-3 border-t border-stone-100 pt-4">
        {entries.map((e, i) => (
          <li key={`${e.date}-${i}`} className="flex gap-4 text-sm">
            <span className="w-28 shrink-0 font-mono text-xs text-stone-500 tabular-nums">
              {fmt(e.date)}
            </span>
            <span className="flex-1 text-stone-700">{e.note}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}
