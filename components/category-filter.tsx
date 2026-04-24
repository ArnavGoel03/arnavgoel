"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";
import { costPerDay, parsePrice } from "@/lib/cost";
import { availableInRegion, type Region } from "@/lib/retailers";
import type { ReviewSummary } from "@/lib/types";

type RegionFilter = "all" | Region;
type SortKey = "recent" | "verdict" | "price" | "cost-per-day";

const verdictRank: Record<string, number> = {
  recommend: 0,
  okay: 1,
  bad: 2,
};

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "recent", label: "Recent" },
  { id: "verdict", label: "Verdict" },
  { id: "price", label: "Price" },
  { id: "cost-per-day", label: "Cost / day" },
];

export function CategoryFilter({ reviews }: { reviews: ReviewSummary[] }) {
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [ingredient, setIngredient] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(reviews.map((r) => r.category));
    return ["all", ...Array.from(set).sort()];
  }, [reviews]);

  const ingredients = useMemo(() => {
    const set = new Set<string>();
    for (const r of reviews) for (const i of r.ingredients ?? []) set.add(i);
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
    if (ingredient !== "all") {
      base = base.filter((r) => (r.ingredients ?? []).includes(ingredient));
    }
    if (sort === "verdict") {
      return [...base].sort(
        (a, b) =>
          (verdictRank[a.verdict ?? "z"] ?? 3) -
          (verdictRank[b.verdict ?? "z"] ?? 3),
      );
    }
    if (sort === "price") {
      return [...base].sort((a, b) => {
        const pa = parsePrice(a.price);
        const pb = parsePrice(b.price);
        // Items without a price sink to the bottom.
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;
        return pa - pb;
      });
    }
    if (sort === "cost-per-day") {
      return [...base].sort((a, b) => {
        const ca = costPerDay(a);
        const cb = costPerDay(b);
        if (ca === null && cb === null) return 0;
        if (ca === null) return 1;
        if (cb === null) return -1;
        return ca - cb;
      });
    }
    return base;
  }, [reviews, active, sort, region, ingredient]);

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
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <span>Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSort(opt.id)}
              className={cn(
                "rounded-full px-3 py-1 transition-colors",
                sort === opt.id
                  ? "bg-stone-100 text-stone-900"
                  : "hover:text-stone-900",
              )}
            >
              {opt.label}
            </button>
          ))}
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

      {ingredients.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label className="text-stone-500" htmlFor="ingredient-filter">
            Ingredient:
          </label>
          <select
            id="ingredient-filter"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-stone-700 transition-colors hover:border-stone-400 focus:border-stone-900 focus:outline-none"
          >
            {ingredients.map((i) => (
              <option key={i} value={i}>
                {i === "all" ? "Any" : i}
              </option>
            ))}
          </select>
        </div>
      )}

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
