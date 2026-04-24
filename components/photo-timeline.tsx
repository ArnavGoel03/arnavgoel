import type { Review } from "@/lib/types";

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Chronological image grid, progress photos laid out left-to-right,
 * earliest first. Primarily for skincare reviews where week-to-week
 * change is the whole point.
 */
export function PhotoTimeline({ review }: { review: Review }) {
  if (review.photoTimeline.length === 0) return null;
  const photos = [...review.photoTimeline].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return (
    <section className="border-t border-stone-200 pt-10">
      <header className="mb-6">
        <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-stone-500">
          <span className="mr-1.5 text-rose-400">❋</span>
          Progress
        </p>
        <h2 className="font-serif text-2xl text-stone-900 sm:text-3xl">
          Week by week<span className="text-rose-400">.</span>
        </h2>
        <p className="mt-2 max-w-2xl font-serif text-base italic leading-relaxed text-stone-500">
          Same angle, same light, same time of day where possible. No retouch.
        </p>
      </header>

      <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={`${p.date}-${i}`} className="flex flex-col gap-2">
            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.note ?? `Progress photo from ${fmt(p.date)}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-mono text-[11px] text-stone-500 tabular-nums">
                {fmt(p.date)}
              </p>
              {p.note && (
                <p className="mt-0.5 font-serif text-sm italic leading-snug text-stone-600">
                  {p.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
