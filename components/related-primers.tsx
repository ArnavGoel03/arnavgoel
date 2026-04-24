import Link from "next/link";
import type { PrimerSummary } from "@/lib/types";

export function RelatedPrimers({ primers }: { primers: PrimerSummary[] }) {
  if (primers.length === 0) return null;
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
      <h3 className="mb-3 flex items-baseline gap-2 font-serif text-lg text-stone-900 dark:text-stone-100">
        <span className="text-rose-400">❋</span>
        Relevant primers
      </h3>
      <p className="mb-4 text-xs italic text-stone-500 dark:text-stone-400">
        Background on what this product is trying to do.
      </p>
      <ul className="space-y-3">
        {primers.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/primers/${p.slug}`}
              className="group block border-l-2 border-stone-200 pl-3 transition-colors hover:border-rose-400 dark:border-stone-700 dark:hover:border-rose-500"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
                {p.domain} · {p.kind}
              </p>
              <p className="mt-0.5 font-serif text-base leading-snug text-stone-900 transition-colors group-hover:text-rose-700 dark:text-stone-100 dark:group-hover:text-rose-400">
                {p.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
