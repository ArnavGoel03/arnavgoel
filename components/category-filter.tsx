"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";
import { costPerDay, parsePrice } from "@/lib/cost";
import { defaultPrice, priceFor } from "@/lib/price";
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

// Short URL keys keep the query string compact when the user shares a
// link. `c` for category, `sort`, `region`, `brand`, `ing` for
// ingredient. Defaults are omitted entirely so a clean URL stays
// clean.
const URL_KEY = {
  category: "c",
  sort: "sort",
  region: "region",
  brand: "brand",
  ingredient: "ing",
} as const;

const VALID_SORTS = new Set<SortKey>([
  "recent",
  "verdict",
  "price",
  "cost-per-day",
]);
const VALID_REGIONS = new Set<RegionFilter>(["all", "india", "usa", "uk"]);

export function CategoryFilter({ reviews }: { reviews: ReviewSummary[] }) {
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [ingredient, setIngredient] = useState<string>("all");
  const [brand, setBrand] = useState<string>("all");
  const hydratedRef = useRef(false);

  // Hydrate filter state from the URL on mount, so a shared
  // /skincare?region=usa&sort=price link lands the reader on exactly
  // that filtered view. Only runs once; subsequent state changes are
  // pushed back out via the next effect.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get(URL_KEY.category);
    const s = sp.get(URL_KEY.sort);
    const r = sp.get(URL_KEY.region);
    const b = sp.get(URL_KEY.brand);
    const ing = sp.get(URL_KEY.ingredient);
    if (c) setActive(c);
    if (s && VALID_SORTS.has(s as SortKey)) setSort(s as SortKey);
    if (r && VALID_REGIONS.has(r as RegionFilter)) {
      setRegion(r as RegionFilter);
    }
    if (b) setBrand(b);
    if (ing) setIngredient(ing);
    hydratedRef.current = true;
  }, []);

  // Push filter state to the URL whenever it changes. Use
  // history.replaceState so we don't pollute the browser back-button
  // with one entry per chip click. Default values stay out of the URL
  // so a clean view has a clean URL.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const sp = new URLSearchParams();
    if (active !== "all") sp.set(URL_KEY.category, active);
    if (sort !== "recent") sp.set(URL_KEY.sort, sort);
    if (region !== "all") sp.set(URL_KEY.region, region);
    if (brand !== "all") sp.set(URL_KEY.brand, brand);
    if (ingredient !== "all") sp.set(URL_KEY.ingredient, ingredient);
    const qs = sp.toString();
    const next = qs
      ? `${window.location.pathname}?${qs}${window.location.hash}`
      : `${window.location.pathname}${window.location.hash}`;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, "", next);
    }
  }, [active, sort, region, brand, ingredient]);

  const categories = useMemo(() => {
    const set = new Set(reviews.map((r) => r.category));
    return ["all", ...Array.from(set).sort()];
  }, [reviews]);

  const ingredients = useMemo(() => {
    const set = new Set<string>();
    for (const r of reviews) for (const i of r.ingredients ?? []) set.add(i);
    return ["all", ...Array.from(set).sort()];
  }, [reviews]);

  const brands = useMemo(() => {
    const set = new Set(reviews.map((r) => r.brand));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
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
    if (brand !== "all") {
      base = base.filter((r) => r.brand === brand);
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
        // When a region filter is active, sort by that region's price so
        // shoppers see the cheapest in their own market on top. Otherwise
        // fall back to whichever region we have data for.
        const priceStr = (r: ReviewSummary) =>
          region === "all" ? defaultPrice(r.price) : priceFor(r.price, region);
        const pa = parsePrice(priceStr(a));
        const pb = parsePrice(priceStr(b));
        // Items without a price sink to the bottom.
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;
        return pa - pb;
      });
    }
    if (sort === "cost-per-day") {
      return [...base].sort((a, b) => {
        const ctx = region === "all" ? undefined : region;
        const ca = costPerDay(a, ctx);
        const cb = costPerDay(b, ctx);
        if (ca === null && cb === null) return 0;
        if (ca === null) return 1;
        if (cb === null) return -1;
        return ca - cb;
      });
    }
    return base;
  }, [reviews, active, sort, region, ingredient, brand]);

  // Anything beyond default sort = "recent" / region = "all" / brand =
  // "all" / ingredient = "all" counts as a non-default filter, used to
  // surface a "Reset" affordance and to gate the secondary toolbar's
  // visual emphasis. Category isn't included because it's already a
  // first-class row.
  const activeFilterCount =
    (sort !== "recent" ? 1 : 0) +
    (region !== "all" ? 1 : 0) +
    (brand !== "all" ? 1 : 0) +
    (ingredient !== "all" ? 1 : 0);

  function resetAll() {
    setActive("all");
    setSort("recent");
    setRegion("all");
    setBrand("all");
    setIngredient("all");
  }

  return (
    <div className="space-y-5">
      {/* Row 1: category pills, the primary filter. Everything else
          (sort / region / brand / ingredient) lives in the compact
          toolbar below. */}
      <div data-tour-listing="categories" className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm capitalize transition-colors",
              active === c
                ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:text-stone-100",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Row 2: secondary-filter toolbar. Single line at desktop width,
          wraps gracefully on mobile. Each pill group separated by a
          subtle divider so the four jobs (sort / region / brand /
          ingredient) read as four jobs, not one wall of pills. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-stone-200 py-3 text-sm dark:border-stone-800">
        <div
          data-tour-listing="sort"
          className="flex flex-wrap items-center gap-1 text-stone-500 dark:text-stone-400"
        >
          <span className="mr-1 text-xs uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
            Sort
          </span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSort(opt.id)}
              className={cn(
                "rounded-full px-2.5 py-0.5 transition-colors",
                sort === opt.id
                  ? "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100"
                  : "hover:text-stone-900 dark:hover:text-stone-100",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span aria-hidden className="hidden h-4 w-px bg-stone-200 dark:bg-stone-800 sm:inline" />

        <div
          data-tour-listing="region"
          className="flex flex-wrap items-center gap-1.5"
        >
          <span className="mr-1 text-xs uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
            Region
          </span>
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
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 transition-colors",
                region === r.id
                  ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:text-stone-100",
              )}
            >
              {r.label}
              <span
                className={cn(
                  "text-[10px] tabular-nums",
                  region === r.id
                    ? "text-stone-300 dark:text-stone-500"
                    : "text-stone-400 dark:text-stone-500",
                )}
              >
                {r.count}
              </span>
            </button>
          ))}
        </div>

        {brands.length > 2 && (
          <>
            <span aria-hidden className="hidden h-4 w-px bg-stone-200 dark:bg-stone-800 sm:inline" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                Brand
              </span>
              <IngredientPicker
                options={brands}
                value={brand}
                onChange={setBrand}
                placeholder="Any"
              />
            </div>
          </>
        )}

        {ingredients.length > 2 && (
          <>
            <span aria-hidden className="hidden h-4 w-px bg-stone-200 dark:bg-stone-800 sm:inline" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                Ingredient
              </span>
              <IngredientPicker
                options={ingredients}
                value={ingredient}
                onChange={setIngredient}
              />
            </div>
          </>
        )}

        {activeFilterCount > 0 && (
          <button
            onClick={resetAll}
            className="ml-auto inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400"
          >
            Reset
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] tabular-nums text-stone-700 dark:bg-stone-800 dark:text-stone-200">
              {activeFilterCount}
            </span>
          </button>
        )}
      </div>

      {/* Screen-reader-only live announcement of the filter result.
          Sighted users see the grid update; AT users get the count
          spoken when they tap a chip. */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {filtered.length === 0
          ? "No products match the current filters."
          : `${filtered.length} ${filtered.length === 1 ? "product" : "products"} shown.`}
      </p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-7xl font-light leading-none tracking-tight text-stone-200 dark:text-stone-800">
            00
          </p>
          <p className="mt-4 font-serif text-lg italic text-stone-500 dark:text-stone-400">
            Nothing matches that filter.
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="mt-5 inline-flex items-center gap-1 rounded-full border border-stone-200 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900 dark:border-stone-800 dark:text-stone-300 dark:hover:border-stone-400 dark:hover:text-stone-100"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <div
              key={`${r.kind}-${r.slug}`}
              className="card-stagger-in"
              style={
                {
                  "--stagger": `${Math.min(i * 28, 360)}ms`,
                } as React.CSSProperties
              }
            >
              <ProductCard review={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Editorial pill dropdown for ingredient filtering. Replaces the
 * native <select>, which jumped out visually against the site's
 * stone-on-rose pill vocabulary. Opens below on click, closes on
 * outside-click and on Escape.
 */
function IngredientPicker({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = value === "all" ? (placeholder ?? "Any") : value;

  return (
    <div className="relative inline-block" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
          value === "all"
            ? "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:text-stone-100"
            : "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900",
        )}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open ? "rotate-180" : "",
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-30 mt-2 max-h-64 w-56 overflow-y-auto rounded-2xl border border-stone-200 bg-white py-2 shadow-lg dark:border-stone-800 dark:bg-stone-900"
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-1.5 text-left text-sm transition-colors",
                    selected
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800",
                  )}
                >
                  <span>{opt === "all" ? (placeholder ?? "Any") : opt}</span>
                  {selected && <Check className="h-3.5 w-3.5" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
