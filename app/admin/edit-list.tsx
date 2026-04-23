import Link from "next/link";
import { getAllReviewsIncludingHidden } from "@/lib/content";
import type { Kind, ReviewSummary } from "@/lib/types";

const SECTIONS: { kind: Kind; label: string }[] = [
  { kind: "skincare", label: "Skincare" },
  { kind: "supplements", label: "Supplements" },
  { kind: "oral-care", label: "Oral care" },
];

function ratingDisplay(review: ReviewSummary): string {
  if (typeof review.rating === "number" && review.rating > 0) {
    return `⭑ ${review.rating.toFixed(1)}`;
  }
  return "still testing";
}

function Row({ kind, review }: { kind: Kind; review: ReviewSummary }) {
  const hidden = review.hidden === true;
  return (
    <Link
      href={`/admin/edit/${kind}/${review.slug}`}
      className={
        "group flex items-center justify-between gap-4 border-b border-stone-100 px-4 py-3 last:border-none hover:bg-stone-50 " +
        (hidden ? "opacity-55" : "")
      }
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 truncate text-sm font-medium text-stone-900">
          {review.name}
          {hidden && (
            <span className="rounded-sm bg-stone-200 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-stone-600">
              Hidden
            </span>
          )}
        </div>
        <div className="mt-0.5 truncate text-xs text-stone-500">
          {review.brand} · {review.category} · {ratingDisplay(review)}
        </div>
      </div>
      <span className="text-xs text-stone-400 transition-colors group-hover:text-stone-900">
        Edit →
      </span>
    </Link>
  );
}

function Group({ kind, label }: { kind: Kind; label: string }) {
  const items = getAllReviewsIncludingHidden(kind);
  const visibleCount = items.filter((r) => !r.hidden).length;
  const hiddenCount = items.length - visibleCount;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-serif text-xl text-stone-900">{label}</h3>
        <span className="text-xs text-stone-500">
          {visibleCount} live
          {hiddenCount > 0 && (
            <span className="text-stone-400"> · {hiddenCount} hidden</span>
          )}
        </span>
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
}

export function EditList() {
  return (
    <div className="space-y-8">
      {SECTIONS.map((s) => (
        <Group key={s.kind} kind={s.kind} label={s.label} />
      ))}
    </div>
  );
}
