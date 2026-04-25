import { Check, X } from "lucide-react";

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  // Don't render two empty boxes when the review hasn't filled them in
  // yet. Detail page still shows the prose body + meta panel; the
  // pros/cons block is only meaningful once at least one bullet
  // exists.
  if (pros.length === 0 && cons.length === 0) return null;
  // Render only the side(s) with content. When both have content the
  // grid stacks them side-by-side at sm+; when only one has content it
  // takes the full width.
  const both = pros.length > 0 && cons.length > 0;
  return (
    <div className={"grid gap-6 " + (both ? "sm:grid-cols-2" : "")}>
      {pros.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <h3 className="mb-3 font-serif text-lg text-emerald-900 dark:text-emerald-200">
            What works
          </h3>
          <ul className="space-y-2">
            {pros.map((p) => (
              <li
                key={p}
                className="flex gap-2 text-sm text-stone-700 dark:text-stone-300"
              >
                <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600 dark:text-emerald-400" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 dark:border-rose-900/50 dark:bg-rose-950/20">
          <h3 className="mb-3 font-serif text-lg text-rose-900 dark:text-rose-200">
            What doesn&apos;t
          </h3>
          <ul className="space-y-2">
            {cons.map((c) => (
              <li
                key={c}
                className="flex gap-2 text-sm text-stone-700 dark:text-stone-300"
              >
                <X className="mt-0.5 h-4 w-4 flex-none text-rose-600 dark:text-rose-400" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
