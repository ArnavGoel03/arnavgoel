import type { Review } from "@/lib/types";

const AXES: { key: "effect" | "value" | "tolerance"; label: string; hint: string }[] = [
  { key: "effect", label: "Effect", hint: "Does it work?" },
  { key: "value", label: "Value", hint: "Worth the price?" },
  { key: "tolerance", label: "Tolerance", hint: "Easy to live with?" },
];

export function RatingAxes({ review }: { review: Review }) {
  const r = review.ratings;
  if (!r) return null;
  const filled = AXES.filter((a) => typeof r[a.key] === "number");
  if (filled.length === 0) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <h3 className="mb-3 font-serif text-lg text-stone-900">
        By axis<span className="text-rose-400">.</span>
      </h3>
      <dl className="space-y-3">
        {filled.map((a) => {
          const score = r[a.key]!;
          return (
            <div key={a.key} className="flex items-baseline justify-between gap-4">
              <div>
                <dt className="font-serif text-sm text-stone-900">{a.label}</dt>
                <p className="text-xs italic text-stone-500">{a.hint}</p>
              </div>
              <dd className="flex items-baseline gap-1 font-display text-2xl font-light tabular-nums text-stone-900">
                {score.toFixed(1)}
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                  / 10
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-4 border-t border-stone-100 pt-3 text-xs italic leading-relaxed text-stone-500">
        Three axes, no average. The verdict up top is the shortcut;
        these explain why.
      </p>
    </div>
  );
}
