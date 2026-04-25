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
  recommend: "text-emerald-700 dark:text-emerald-400",
  okay: "text-amber-700 dark:text-amber-400",
  bad: "text-rose-700 dark:text-rose-400",
};

const STAMP_BORDER: Record<Verdict, string> = {
  recommend: "border-emerald-300 dark:border-emerald-800",
  okay: "border-amber-300 dark:border-amber-800",
  bad: "border-rose-300 dark:border-rose-800",
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

  // Large size renders as an editorial stamp — bordered card, two-line
  // composition, dot acts as a seal mark. Used on the product detail
  // header where it carries the page's whole verdict in one element.
  if (size === "lg") {
    if (!verdict) {
      return (
        <span
          aria-label="Still testing"
          className="inline-flex flex-col items-end gap-1 rounded-md border border-amber-200 bg-amber-50/40 px-3 py-1.5 dark:border-amber-900/50 dark:bg-amber-950/20"
        >
          <span className="text-[9px] uppercase tracking-[0.22em] text-amber-700/80 dark:text-amber-400/80">
            Verdict
          </span>
          <span className="flex items-baseline gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 dark:bg-amber-500"
            />
            <span className="font-serif text-2xl italic leading-none text-amber-800 dark:text-amber-300 sm:text-3xl">
              Still testing
            </span>
          </span>
        </span>
      );
    }
    return (
      <span
        aria-label={LABELS[verdict]}
        className={cn(
          "inline-flex flex-col items-end gap-1 rounded-md border px-3 py-1.5",
          STAMP_BORDER[verdict],
          verdict === "recommend"
            ? "bg-emerald-50/50 dark:bg-emerald-950/20"
            : verdict === "okay"
              ? "bg-amber-50/50 dark:bg-amber-950/20"
              : "bg-rose-50/50 dark:bg-rose-950/20",
        )}
      >
        <span
          className={cn(
            "text-[9px] uppercase tracking-[0.22em]",
            TEXT[verdict],
            "opacity-80",
          )}
        >
          Verdict
        </span>
        <span className="flex items-baseline gap-2">
          <span
            aria-hidden
            className={cn(
              "inline-block h-1.5 w-1.5 rounded-full",
              DOTS[verdict],
            )}
          />
          <span
            className={cn(
              "font-serif italic leading-none tracking-tight text-3xl sm:text-4xl",
              TEXT[verdict],
            )}
          >
            {LABELS[verdict]}
          </span>
        </span>
      </span>
    );
  }

  if (!verdict) {
    return (
      <span
        className="inline-flex items-baseline gap-1.5"
        aria-label="Still testing"
      >
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 dark:bg-amber-500"
        />
        <span className="font-serif italic leading-none text-stone-500 dark:text-stone-400 text-xs sm:text-base">
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
          "inline-block h-1.5 w-1.5 rounded-full",
          DOTS[verdict],
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
