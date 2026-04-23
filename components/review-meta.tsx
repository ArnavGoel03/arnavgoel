import { ArrowUpRight } from "lucide-react";
import type { Review } from "@/lib/types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-stone-100 py-3 text-sm last:border-none">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right font-medium text-stone-900">{value}</dd>
    </div>
  );
}

export function ReviewMeta({ review }: { review: Review }) {
  const tags = review.skinType ?? review.goal ?? [];
  return (
    <div className="space-y-4">
      <dl className="rounded-2xl border border-stone-200 bg-white p-6">
        <Row label="Brand" value={review.brand} />
        <Row label="Category" value={<span className="capitalize">{review.category}</span>} />
        {review.price && <Row label="Price" value={review.price} />}
        {tags.length > 0 && (
          <Row
            label={review.skinType ? "Skin type" : "Best for"}
            value={<span className="capitalize">{tags.join(", ")}</span>}
          />
        )}
        <Row
          label="Repurchase"
          value={
            review.repurchase ? (
              <span className="text-emerald-700">Yes</span>
            ) : (
              <span className="text-rose-700">No</span>
            )
          }
        />
        <Row
          label="Reviewed"
          value={new Date(review.datePublished).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </dl>
      {review.productUrl && (
        <a
          href={review.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-full items-center justify-between gap-2 rounded-2xl border border-stone-900 bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
        >
          Where to buy
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </div>
  );
}
