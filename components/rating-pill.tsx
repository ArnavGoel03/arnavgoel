import { cn } from "@/lib/utils";

function ratingDot(rating: number) {
  if (rating >= 8.5) return "bg-emerald-500";
  if (rating >= 7) return "bg-amber-500";
  if (rating >= 5) return "bg-orange-500";
  return "bg-rose-500";
}

export function RatingPill({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizing = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-6xl sm:text-7xl",
  }[size];

  const slashSize = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  }[size];

  return (
    <span
      className="inline-flex items-baseline gap-1.5"
      aria-label={`Rating ${rating} out of 10`}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          ratingDot(rating),
          size === "lg" && "h-2 w-2",
        )}
      />
      <span
        className={cn(
          "font-display font-light leading-none tabular-nums tracking-tight text-stone-900",
          sizing,
        )}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className={cn(
          "font-mono uppercase tracking-wider text-stone-400",
          slashSize,
        )}
      >
        / 10
      </span>
    </span>
  );
}
