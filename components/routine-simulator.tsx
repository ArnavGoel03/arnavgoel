"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CatalogItem = {
  kind: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  verdict?: "recommend" | "okay" | "bad";
  skinType: string[];
  goal: string[];
  price?: string | { in?: string; us?: string; uk?: string };
};

type SkinType = "any" | "oily" | "dry" | "sensitive" | "combination";
type Goal =
  | "anti-aging"
  | "acne"
  | "barrier"
  | "brightening"
  | "hydration"
  | "sun"
  | "muscle"
  | "sleep"
  | "energy";

const SKIN_TYPES: { id: SkinType; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "oily", label: "Oily" },
  { id: "dry", label: "Dry" },
  { id: "sensitive", label: "Sensitive" },
  { id: "combination", label: "Combination" },
];

const GOAL_OPTIONS: { id: Goal; label: string; tags: string[] }[] = [
  { id: "anti-aging", label: "Anti-aging", tags: ["anti aging", "anti-aging", "wrinkles", "fine lines", "retinol"] },
  { id: "acne", label: "Acne control", tags: ["acne", "blemishes", "breakouts", "salicylic"] },
  { id: "barrier", label: "Barrier repair", tags: ["barrier", "barrier repair", "ceramides", "soothing"] },
  { id: "brightening", label: "Brightening", tags: ["brightening", "dark spots", "hyperpigmentation", "vitamin c"] },
  { id: "hydration", label: "Hydration", tags: ["hydration", "moisture", "dry skin", "hyaluronic"] },
  { id: "sun", label: "UV protection", tags: ["uv protection", "sunscreen", "spf"] },
  { id: "muscle", label: "Strength + recovery", tags: ["muscle", "strength", "recovery", "creatine", "protein"] },
  { id: "sleep", label: "Sleep + stress", tags: ["sleep", "magnesium", "ashwagandha", "wind down", "stress"] },
  { id: "energy", label: "Energy + cognition", tags: ["energy", "cognition", "brain", "b12", "omega"] },
];

const PRICE_BUDGETS = [
  { id: "any", label: "Any" },
  { id: "tight", label: "Tight ($)" },
  { id: "mid", label: "Mid ($$)" },
  { id: "open", label: "Open ($$$)" },
] as const;
type Budget = (typeof PRICE_BUDGETS)[number]["id"];

const SKINCARE_ORDER: Record<string, number> = {
  "face wash": 10,
  cleanser: 11,
  "chemical exfoliant": 20,
  "chemical peel": 21,
  toner: 40,
  serum: 60,
  prescription: 70,
  "eye cream": 80,
  moisturizer: 90,
  sunscreen: 100,
};

function priceNum(price: CatalogItem["price"]): number {
  if (!price) return 0;
  const flat =
    typeof price === "string"
      ? price
      : price.us || price.uk || price.in || "";
  const n = parseFloat(flat.replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function priceTier(price: CatalogItem["price"]): "tight" | "mid" | "open" {
  const n = priceNum(price);
  if (n === 0 || n <= 25) return "tight";
  if (n <= 75) return "mid";
  return "open";
}

const SKINCARE_CATEGORIES = new Set([
  "face wash",
  "cleanser",
  "toner",
  "serum",
  "moisturizer",
  "sunscreen",
  "chemical exfoliant",
  "chemical peel",
  "eye cream",
  "prescription",
]);

function lower(s: string): string {
  return s.toLowerCase().trim();
}

function score(
  item: CatalogItem,
  goalTags: Set<string>,
  skin: SkinType,
  budget: Budget,
): number {
  let s = 0;
  if (item.verdict === "recommend") s += 5;
  else if (item.verdict === "okay") s += 1;
  else if (item.verdict === "bad") return -1;
  for (const g of item.goal.map(lower)) if (goalTags.has(g)) s += 4;
  if (skin !== "any") {
    const types = item.skinType.map(lower);
    if (types.includes(skin)) s += 3;
    if (types.includes("normal") || types.length === 0) s += 0.5;
  }
  const tier = priceTier(item.price);
  if (budget === "any") s += 0;
  else if (tier === budget) s += 1.5;
  else if (
    (budget === "open" && tier === "mid") ||
    (budget === "mid" && (tier === "tight" || tier === "open"))
  )
    s += 0.5;
  return s;
}

function pickPerCategory(
  items: CatalogItem[],
  goalTags: Set<string>,
  skin: SkinType,
  budget: Budget,
): { category: string; item: CatalogItem; score: number }[] {
  const groups = new Map<string, { item: CatalogItem; score: number }[]>();
  for (const it of items) {
    const sc = score(it, goalTags, skin, budget);
    if (sc <= 0) continue;
    const cat = lower(it.category);
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push({ item: it, score: sc });
  }
  const out: { category: string; item: CatalogItem; score: number }[] = [];
  for (const [cat, arr] of groups) {
    arr.sort((a, b) => b.score - a.score);
    out.push({ category: cat, item: arr[0].item, score: arr[0].score });
  }
  return out;
}

export function RoutineSimulator({ catalog }: { catalog: CatalogItem[] }) {
  const [skin, setSkin] = useState<SkinType>("any");
  const [goals, setGoals] = useState<Set<Goal>>(new Set(["hydration"]));
  const [budget, setBudget] = useState<Budget>("any");

  const result = useMemo(() => {
    const goalTagSet = new Set<string>();
    for (const g of goals) {
      const def = GOAL_OPTIONS.find((o) => o.id === g);
      if (def) for (const t of def.tags) goalTagSet.add(t.toLowerCase());
    }
    const skincarePicks = pickPerCategory(
      catalog.filter(
        (c) => c.kind === "skincare" && SKINCARE_CATEGORIES.has(lower(c.category)),
      ),
      goalTagSet,
      skin,
      budget,
    ).sort(
      (a, b) =>
        (SKINCARE_ORDER[a.category] ?? 999) -
        (SKINCARE_ORDER[b.category] ?? 999),
    );
    const supplementPicks = pickPerCategory(
      catalog.filter((c) => c.kind === "supplements"),
      goalTagSet,
      skin,
      budget,
    ).sort((a, b) => b.score - a.score).slice(0, 5);
    const oralPicks = pickPerCategory(
      catalog.filter((c) => c.kind === "oral-care"),
      goalTagSet,
      skin,
      budget,
    ).slice(0, 3);

    return { skincarePicks, supplementPicks, oralPicks };
  }, [catalog, skin, goals, budget]);

  const totalPicks =
    result.skincarePicks.length +
    result.supplementPicks.length +
    result.oralPicks.length;

  return (
    <div className="mt-12 space-y-12">
      <fieldset className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <legend className="px-2 text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
          Your inputs
        </legend>

        <div className="mt-2 space-y-6">
          <div>
            <p className="mb-3 font-serif text-sm italic text-stone-600 dark:text-stone-400">
              Skin type
            </p>
            <div className="flex flex-wrap gap-2">
              {SKIN_TYPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSkin(s.id)}
                  className={chipClass(skin === s.id)}
                  aria-pressed={skin === s.id}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-serif text-sm italic text-stone-600 dark:text-stone-400">
              Goals (pick any number)
            </p>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((g) => {
                const on = goals.has(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      const next = new Set(goals);
                      if (on) next.delete(g.id);
                      else next.add(g.id);
                      setGoals(next);
                    }}
                    className={chipClass(on)}
                    aria-pressed={on}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 font-serif text-sm italic text-stone-600 dark:text-stone-400">
              Budget
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICE_BUDGETS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudget(b.id)}
                  className={chipClass(budget === b.id)}
                  aria-pressed={budget === b.id}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <div>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100">
            Your routine
            <span className="text-rose-400">.</span>
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
            {totalPicks} pick{totalPicks === 1 ? "" : "s"}
          </span>
        </div>

        {totalPicks === 0 ? (
          <p className="rounded-2xl border border-stone-200 bg-stone-50 px-6 py-12 text-center font-serif italic text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
            No matching products in the catalog yet for that combination.
            Loosen the budget or add another goal.
          </p>
        ) : (
          <div className="space-y-10">
            {result.skincarePicks.length > 0 && (
              <ResultSection
                label="Skincare"
                caption="In application order. Each step waits ~30 seconds before the next."
                picks={result.skincarePicks}
                numbered
              />
            )}
            {result.supplementPicks.length > 0 && (
              <ResultSection
                label="Supplements"
                caption="Daily stack. Take with food unless the listing says otherwise."
                picks={result.supplementPicks}
              />
            )}
            {result.oralPicks.length > 0 && (
              <ResultSection
                label="Oral care"
                caption="Brush, paste, plus the spray that handles the rest."
                picks={result.oralPicks}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function chipClass(on: boolean): string {
  return (
    "rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 " +
    (on
      ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600")
  );
}

function ResultSection({
  label,
  caption,
  picks,
  numbered = false,
}: {
  label: string;
  caption: string;
  picks: { category: string; item: CatalogItem; score: number }[];
  numbered?: boolean;
}) {
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-stone-200 pb-2 dark:border-stone-800">
        <h3 className="font-display text-2xl font-light tracking-tight text-stone-900 dark:text-stone-100">
          {label}
        </h3>
        <p className="hidden text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:block dark:text-stone-400">
          {caption}
        </p>
      </div>
      <ol className="divide-y divide-stone-100 dark:divide-stone-800">
        {picks.map(({ item }, i) => (
          <li key={`${item.kind}-${item.slug}`} className="py-4">
            <Link
              href={`/${item.kind}/${item.slug}`}
              className="group flex items-center gap-4"
            >
              {numbered && (
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white font-mono text-[11px] tabular-nums text-stone-500 transition-colors group-hover:border-rose-300 group-hover:text-rose-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:group-hover:border-rose-700 dark:group-hover:text-rose-400"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                  {item.brand} · {item.category}
                </p>
                <h4 className="mt-0.5 font-serif text-lg text-stone-900 transition-colors group-hover:text-rose-700 dark:text-stone-100 dark:group-hover:text-rose-400">
                  {item.name}
                </h4>
              </div>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] italic text-stone-400 dark:text-stone-500">
                {item.verdict ?? "testing"}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
