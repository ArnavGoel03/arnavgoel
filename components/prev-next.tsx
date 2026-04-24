import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type PrevNextItem = {
  title: string;
  subtitle?: string;
  href: string;
};

/**
 * Pagination footer for detail pages. Renders two cards side by side
 * (prev on the left, next on the right). If only one exists, the other
 * slot is an empty spacer so alignment holds.
 */
export function PrevNext({
  prev,
  next,
  label,
}: {
  prev: PrevNextItem | null;
  next: PrevNextItem | null;
  label?: string;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label={label ?? "Pagination"}
      className="mt-16 border-t border-stone-200 pt-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex flex-col items-start gap-1 rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-900"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-stone-400">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Older
            </span>
            {prev.subtitle && (
              <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
                {prev.subtitle}
              </span>
            )}
            <span className="font-serif text-lg leading-snug text-stone-900 transition-colors group-hover:text-rose-700">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden />
        )}

        {next ? (
          <Link
            href={next.href}
            className="group flex flex-col items-end gap-1 rounded-xl border border-stone-200 bg-white p-5 text-right transition-colors hover:border-stone-900"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-stone-400">
              Newer
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
            {next.subtitle && (
              <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
                {next.subtitle}
              </span>
            )}
            <span className="font-serif text-lg leading-snug text-stone-900 transition-colors group-hover:text-rose-700">
              {next.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden />
        )}
      </div>
    </nav>
  );
}
