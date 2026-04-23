import { cn } from "@/lib/utils";

function ratingColor(rating: number) {
  if (rating >= 8.5) return "bg-emerald-100 text-emerald-900 ring-emerald-200";
  if (rating >= 7) return "bg-amber-100 text-amber-900 ring-amber-200";
  if (rating >= 5) return "bg-orange-100 text-orange-900 ring-orange-200";
  return "bg-rose-100 text-rose-900 ring-rose-200";
}

export function RatingPill({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizing = {
    sm: "h-6 min-w-6 px-1.5 text-xs",
    md: "h-8 min-w-8 px-2 text-sm",
    lg: "h-12 min-w-12 px-3 text-lg",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-mono font-semibold tabular-nums ring-1 ring-inset",
        sizing,
        ratingColor(rating),
      )}
      aria-label={`Rating ${rating} out of 10`}
    >
      {rating.toFixed(1)}
    </span>
  );
}
