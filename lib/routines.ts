import { getAllReviews } from "@/lib/content";
import type { ReviewSummary } from "@/lib/types";

export type RoutineSlug = "morning" | "evening" | "stack" | "shower" | "oral";

export const ROUTINE_LABELS: Record<RoutineSlug, string> = {
  morning: "Morning",
  evening: "Evening",
  stack: "Stack",
  shower: "Shower",
  oral: "Oral",
};

export const ROUTINE_DESCRIPTIONS: Record<RoutineSlug, string> = {
  morning:
    "Everything I put on, in, or near my body in the first hour of the day, cleansers, actives, moisturizers, the supplements I take with breakfast.",
  evening:
    "The night shift, retinoids and barrier repair for skin, magnesium and wind-down for the body.",
  stack:
    "Supplements I take daily, together, as one running protocol. Order, timing, and what they're for.",
  shower:
    "What is actually in the rotation right now, the bottles I reach for under running water this week, not every wash and scrub I have ever bought.",
  oral:
    "The brushing routine I run twice a day, morning and night, in the same order. Brush, floss, water-floss, rinse, same products, same sequence, no shortcuts.",
};

export function getRoutinesList(): RoutineSlug[] {
  return ["morning", "evening", "stack", "shower", "oral"];
}

export function getReviewsInRoutine(routine: RoutineSlug): ReviewSummary[] {
  return getAllReviews().filter((r) =>
    (r.routines as readonly string[]).includes(routine),
  );
}

// ────────────────────────────────────────────────────────────────────
// Subroutines: curated slices of a parent routine for a specific
// context (post-workout morning, active-day evening, travel days,
// recovery-day evening). Each subroutine names its parent and a
// hand-picked filter, either a goal-tag whitelist that subset the
// parent or an explicit slug list. Goal-based subroutines stay current
// as new products land; slug-based subroutines lock the curation.
// ────────────────────────────────────────────────────────────────────

export type SubroutineSlug =
  | "morning/post-workout"
  | "evening/active-day"
  | "morning/travel"
  | "evening/recovery"
  | "evening/occasional";

type Subroutine = {
  parent: RoutineSlug;
  child: string;
  label: string;
  description: string;
  /**
   * Filter mode. `goal` keeps everything in the parent routine that
   * also tags one of these goals; `slugs` is an explicit allow-list of
   * `kind/slug` pairs in display order.
   */
  filter:
    | { mode: "goal"; goals: string[] }
    | { mode: "slugs"; slugs: string[] };
  /** Application-order-aware boolean. Skincare always sorted, others kept in input order. */
  numberSteps?: boolean;
};

export const SUBROUTINES: Record<SubroutineSlug, Subroutine> = {
  "morning/post-workout": {
    parent: "morning",
    child: "post-workout",
    label: "Morning, post-workout",
    description:
      "What I reach for the moment I get back from the gym, before the morning skincare proper. Protein in, creatine in, sweat off, then the rest of the day starts.",
    filter: {
      mode: "goal",
      goals: [
        "muscle",
        "muscle building",
        "recovery",
        "post workout",
        "post-workout",
        "strength",
        "creatine",
        "protein",
      ],
    },
    numberSteps: true,
  },
  "evening/active-day": {
    parent: "evening",
    child: "active-day",
    label: "Evening, after an active day",
    description:
      "The night routine after a long day on my feet, in the sun, in chlorine, or all three. Heavier on barrier repair and recovery, lighter on actives, magnesium goes in early.",
    filter: {
      mode: "goal",
      goals: [
        "recovery",
        "sleep",
        "magnesium",
        "barrier",
        "barrier repair",
        "moisture",
        "hydration",
        "sun damage",
        "anti inflammatory",
      ],
    },
    numberSteps: true,
  },
  "morning/travel": {
    parent: "morning",
    child: "travel",
    label: "Morning, on the road",
    description:
      "The pared-down kit that fits in the dopp kit. SPF, the toothbrush, the supplements that survive a flight. No multi-step skincare, no powders.",
    filter: {
      mode: "goal",
      goals: [
        "travel",
        "uv protection",
        "sunscreen",
        "fresh breath",
        "primary computer",
      ],
    },
    numberSteps: true,
  },
  "evening/recovery": {
    parent: "evening",
    child: "recovery",
    label: "Evening, recovery night",
    description:
      "When I want to sleep deeper than usual, magnesium and ashwagandha lead, the rest of the routine stays minimal so it doesn't distract from the wind-down.",
    filter: {
      mode: "goal",
      goals: [
        "sleep",
        "magnesium",
        "ashwagandha",
        "stress",
        "wind down",
        "wind-down",
        "recovery",
      ],
    },
    numberSteps: true,
  },
  "evening/occasional": {
    parent: "evening",
    child: "occasional",
    label: "Evening, once a month",
    description:
      "Maintenance-cadence treatments that earn their slot precisely because they don't run every night. Dermaplaning the face smooth before bed, the once-a-month chemical peel, the tools that come out roughly every four weeks.",
    filter: {
      mode: "slugs",
      slugs: [
        "skincare/the-ordinary-aha-bha-peeling-solution",
        "skincare/tweezerman-stainless-steel-facial-razor",
      ],
    },
    numberSteps: true,
  },
};

export function getSubroutinesList(): SubroutineSlug[] {
  return Object.keys(SUBROUTINES) as SubroutineSlug[];
}

export function getSubroutine(slug: string): Subroutine | null {
  return SUBROUTINES[slug as SubroutineSlug] ?? null;
}

export function getSubroutinesForParent(parent: RoutineSlug): {
  slug: SubroutineSlug;
  label: string;
  description: string;
}[] {
  return getSubroutinesList()
    .filter((s) => SUBROUTINES[s].parent === parent)
    .map((s) => ({
      slug: s,
      label: SUBROUTINES[s].label,
      description: SUBROUTINES[s].description,
    }));
}

export function getReviewsInSubroutine(slug: SubroutineSlug): ReviewSummary[] {
  const def = SUBROUTINES[slug];
  if (!def) return [];
  const parentItems = getReviewsInRoutine(def.parent);
  if (def.filter.mode === "slugs") {
    const allow = new Set(def.filter.slugs);
    return parentItems.filter((r) => allow.has(`${r.kind}/${r.slug}`));
  }
  const goalSet = new Set(def.filter.goals.map((g) => g.toLowerCase().trim()));
  return parentItems.filter((r) =>
    (r.goal ?? []).some((g) => goalSet.has(g.toLowerCase().trim())),
  );
}
