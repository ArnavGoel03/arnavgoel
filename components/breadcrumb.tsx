import Link from "next/link";
import { BreadcrumbJsonLd } from "./json-ld";

export type Crumb = { name: string; href: string };

/**
 * Editorial breadcrumb. Renders a semantic <nav> + JSON-LD structured
 * data in one go, pass the full trail ending with the current page.
 */
export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  if (trail.length === 0) return null;
  return (
    <>
      <BreadcrumbJsonLd trail={trail} />
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500"
      >
        {trail.map((c, i) => {
          const isLast = i === trail.length - 1;
          return (
            <span key={c.href} className="inline-flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden className="text-stone-300 dark:text-stone-700">
                  ·
                </span>
              )}
              {isLast ? (
                <span className="text-stone-700 dark:text-stone-300">
                  {c.name}
                </span>
              ) : (
                <Link
                  href={c.href}
                  className="transition-colors hover:text-stone-900 dark:hover:text-stone-100"
                >
                  {c.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
