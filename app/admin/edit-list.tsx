import Link from "next/link";
import { getReviews } from "@/lib/content";
import type { Kind, ReviewSummary } from "@/lib/types";

const sections: { kind: Kind; label: string }[] = [
  { kind: "skincare", label: "Skincare" },
  { kind: "supplements", label: "Supplements" },
  { kind: "oral-care", label: "Oral care" },
];

function Row({ kind, review }: { kind: Kind; review: ReviewSummary }) {
  return (
    <Link
      href={`/admin/edit/${kind}/${review.slug}`}
      className="group flex items-center justify-between gap-4 border-b border-stone-100 px-4 py-3 last:border-none hover:bg-stone-50"
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-stone-900">
          {review.name}
        </div>
        <div className="mt-0.5 truncate text-xs text-stone-500">
          {review.brand} · {review.category} · ⭑ {review.rating.toFixed(1)}
        </div>
      </div>
      <span className="text-xs text-stone-400 transition-colors group-hover:text-stone-900">
        Edit →
      </span>
    </Link>
  );
}

export function EditList() {
  return (
    <div className="space-y-8">
      {sections.map(({ kind, label }) => {
        const items = getReviews(kind);
        return (
          <div key={kind}>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-serif text-xl text-stone-900">{label}</h3>
              <span className="text-xs text-stone-500">{items.length} reviews</span>
            </div>
            {items.length === 0 ? (
              <p className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-6 text-center text-sm text-stone-500">
                None yet.
              </p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                {items.map((r) => (
                  <Row key={r.slug} kind={kind} review={r} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
