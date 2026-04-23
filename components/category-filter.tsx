"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";
import { availableInRegion, type Region } from "@/lib/retailers";
import type { ReviewSummary } from "@/lib/types";

type RegionFilter = "all" | Region;

export function CategoryFilter({ reviews }: { reviews: ReviewSummary[] }) {
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<"recent" | "rating">("recent");
  const [region, setRegion] = useState<RegionFilter>("all");

  const categories = useMemo(() => {
    const set = new Set(reviews.map((r) => r.category));
    return ["all", ...Array.from(set).sort()];
  }, [reviews]);

  const counts = useMemo(
    () => ({
      india: reviews.filter((r) => availableInRegion(r, "india")).length,
      usa: reviews.filter((r) => availableInRegion(r, "usa")).length,
      uk: reviews.filter((r) => availableInRegion(r, "uk")).length,
    }),
    [reviews],
  );

  const filtered = useMemo(() => {
    let base = active === "all" ? reviews : reviews.filter((r) => r.category === active);
    if (region !== "all") {
      base = base.filter((r) => availableInRegion(r, region));
    }
    if (sort === "rating") return [...base].sort((a, b) => b.rating - a.rating);
    return base;
  }, [reviews, active, sort, region]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm capitalize transition-colors",
                active === c
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <span>Sort:</span>
          <button
            onClick={() => setSort("recent")}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              sort === "recent" ? "bg-stone-100 text-stone-900" : "hover:text-stone-900",
            )}
          >
            Recent
          </button>
          <button
            onClick={() => setSort("rating")}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              sort === "rating" ? "bg-stone-100 text-stone-900" : "hover:text-stone-900",
            )}
          >
            Rating
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-stone-500">Available in:</span>
        {(
          [
            { id: "all", label: "All", count: reviews.length },
            { id: "india", label: "India", count: counts.india },
            { id: "usa", label: "USA", count: counts.usa },
            { id: "uk", label: "UK", count: counts.uk },
          ] as const
        ).map((r) => (
          <button
            key={r.id}
            onClick={() => setRegion(r.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors",
              region === r.id
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900",
            )}
          >
            {r.label}
            <span
              className={cn(
                "text-xs",
                region === r.id ? "text-stone-300" : "text-stone-400",
              )}
            >
              {r.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-stone-500">
          Nothing matches that filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ProductCard key={`${r.kind}-${r.slug}`} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
