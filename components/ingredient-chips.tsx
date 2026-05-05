import { GlossaryTerm } from "./glossary-term";
import { findGlossaryEntry } from "@/lib/glossary";

/**
 * "Key ingredients" sidebar block on every product detail page.
 * Each ingredient that has a glossary entry is wrapped in a
 * GlossaryTerm so a hover (or tap on mobile) reveals the canonical
 * definition without leaving the page. Unknown ingredients render
 * as plain chips so the read isn't broken.
 *
 * Server-rendered shell, client-side popover only on the chips that
 * have a known glossary match — keeps the JS payload off pages that
 * have only generic ingredient names.
 */
export function IngredientChips({
  ingredients,
  label = "Key ingredients",
}: {
  ingredients: string[];
  label?: string;
}) {
  if (ingredients.length === 0) return null;
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
      <h3 className="mb-3 font-serif text-lg text-stone-900 dark:text-stone-100">
        {label}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {ingredients.map((i) => {
          const known = !!findGlossaryEntry(i);
          return (
            <li
              key={i}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300"
            >
              {known ? <GlossaryTerm name={i}>{i}</GlossaryTerm> : i}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
