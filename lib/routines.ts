import { getAllReviews } from "@/lib/content";
import type { ReviewSummary } from "@/lib/types";

export type RoutineSlug = "morning" | "evening" | "stack" | "shower";

export const ROUTINE_LABELS: Record<RoutineSlug, string> = {
  morning: "Morning",
  evening: "Evening",
  stack: "Stack",
  shower: "Shower",
};

export const ROUTINE_DESCRIPTIONS: Record<RoutineSlug, string> = {
  morning:
    "Everything I put on, in, or near my body in the first hour of the day, cleansers, actives, moisturizers, the supplements I take with breakfast.",
  evening:
    "The night shift, retinoids and barrier repair for skin, magnesium and wind-down for the body.",
  stack:
    "Supplements I take daily, together, as one running protocol. Order, timing, and what they're for.",
  shower:
    "Everything that lives next to the showerhead, body washes, scrubs, shampoos, conditioners, in-shower treatments. The wash-rinse-repeat layer of the routine.",
};

export function getRoutinesList(): RoutineSlug[] {
  return ["morning", "evening", "stack", "shower"];
}

export function getReviewsInRoutine(routine: RoutineSlug): ReviewSummary[] {
  return getAllReviews().filter((r) => r.routines.includes(routine));
}
