"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { onShelfChange, readShelf } from "@/components/bookmark-toggle";
import type { ReviewSummary } from "@/lib/types";

export function ShelfClient({ reviews }: { reviews: ReviewSummary[] }) {
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    setIds(readShelf());
    return onShelfChange((next) => setIds(next));
  }, []);

  if (ids === null) {
    return (
      <p className="mt-12 font-serif text-base italic text-stone-500 dark:text-stone-400">
        Loading your shelf…
      </p>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="mt-12 max-w-xl border-l border-stone-200 pl-6 dark:border-stone-800">
        <p className="font-serif text-lg italic leading-relaxed text-stone-500 dark:text-stone-400">
          Empty for now. As you read through the catalog, tap the small
          rose ❋ on any card to save it here. Nothing is uploaded —
          your shelf stays in this browser.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/skincare"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          >
            Browse skincare
          </Link>
          <Link
            href="/now"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 transition-colors hover:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-400"
          >
            What&apos;s on the shelf this month
          </Link>
        </div>
      </div>
    );
  }

  // Preserve the order the user saved items in (most recent first).
  const idSet = new Set(ids);
  const items = ids
    .slice()
    .reverse()
    .map((id) => reviews.find((r) => `${r.kind}/${r.slug}` === id))
    .filter((r): r is ReviewSummary => Boolean(r));
  // Drop any IDs whose review no longer exists (slug renamed, retired, etc.).
  const missing = ids.filter(
    (id) => !reviews.some((r) => `${r.kind}/${r.slug}` === id),
  );

  return (
    <>
      <div className="mt-10 flex items-baseline justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
          {items.length} saved
        </p>
        {missing.length > 0 && (
          <p className="text-xs italic text-stone-400 dark:text-stone-500">
            {missing.length} item{missing.length === 1 ? "" : "s"} no
            longer in catalog
          </p>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => (
          <ProductCard key={`${r.kind}-${r.slug}`} review={r} />
        ))}
      </div>
      {idSet.size > 0 && (
        <p className="mt-12 max-w-xl text-xs italic text-stone-400 dark:text-stone-500">
          Saved locally to your browser. Cleared if you wipe site data;
          not synced across devices.
        </p>
      )}
    </>
  );
}
