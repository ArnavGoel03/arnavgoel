import type { ReviewSummary } from "@/lib/types";

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function SectionMasthead({
  volume,
  title,
  intro,
  reviews,
}: {
  volume: string;
  title: string;
  intro: string;
  reviews: ReviewSummary[];
}) {
  const avg = average(reviews.map((r) => r.rating));
  const repurchaseRate = reviews.length
    ? Math.round((reviews.filter((r) => r.repurchase).length / reviews.length) * 100)
    : 0;
  const today = new Date();
  const issueDate = today.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="border-b border-stone-300 py-12 sm:py-16">
      {/* Top rule with volume marker */}
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>{volume}</span>
        </span>
        <span className="font-mono text-stone-400">{issueDate}</span>
      </div>

      {/* Title — full bleed serif */}
      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-8xl">
        {title}.
      </h1>

      {/* Italic editorial subhead */}
      <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl">
        {intro}
      </p>

      {/* Stats strip — newspaper masthead style */}
      <dl className="mt-10 grid grid-cols-3 gap-x-6 border-t border-stone-200 pt-6 sm:max-w-xl sm:grid-cols-3 sm:gap-x-12">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
            Reviews
          </dt>
          <dd className="mt-1 font-display text-3xl font-light leading-none tracking-tight tabular-nums text-stone-900 sm:text-4xl">
            {reviews.length}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
            Avg rating
          </dt>
          <dd className="mt-1 font-display text-3xl font-light leading-none tracking-tight tabular-nums text-stone-900 sm:text-4xl">
            {avg ? avg.toFixed(1) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
            Repurchase
          </dt>
          <dd className="mt-1 font-display text-3xl font-light leading-none tracking-tight tabular-nums text-stone-900 sm:text-4xl">
            {repurchaseRate}
            <span className="text-stone-400">%</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
