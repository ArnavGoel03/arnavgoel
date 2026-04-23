import { cn } from "@/lib/utils";

export type Verdict = "recommend" | "okay" | "bad";

const LABELS: Record<Verdict, string> = {
  recommend: "Would recommend",
  okay: "Okayish",
  bad: "Bad",
};

const DOTS: Record<Verdict, string> = {
  recommend: "bg-emerald-500",
  okay: "bg-amber-500",
  bad: "bg-rose-500",
};

const TEXT: Record<Verdict, string> = {
  recommend: "text-emerald-700",
  okay: "text-amber-700",
  bad: "text-rose-700",
};

export function VerdictPill({
  verdict,
  size = "md",
}: {
  verdict?: Verdict;
  size?: "sm" | "md" | "lg";
}) {
  const sizing = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-3xl sm:text-4xl",
  }[size];

  if (!verdict) {
    return (
      <span
        className="inline-flex items-baseline gap-1.5"
        aria-label="Still testing"
      >
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-amber-400",
            size === "lg" && "h-2 w-2",
          )}
        />
        <span
          className={cn(
            "font-serif italic leading-none text-stone-500",
            size === "lg"
              ? "text-2xl sm:text-3xl"
              : size === "md"
                ? "text-base"
                : "text-xs",
          )}
        >
          Still testing
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-baseline gap-1.5", TEXT[verdict])}
      aria-label={LABELS[verdict]}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          DOTS[verdict],
          size === "lg" && "h-2 w-2",
        )}
      />
      <span
        className={cn(
          "font-serif italic leading-none tracking-tight",
          sizing,
        )}
      >
        {LABELS[verdict]}
      </span>
    </span>
  );
}
