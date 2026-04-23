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
  );
}
