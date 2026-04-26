import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { USES } from "@/lib/uses";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "Hardware, software, and services I actually use. Updated when something changes, not on a schedule.",
  alternates: { canonical: "/uses" },
};

const linkClass =
  "group inline-flex items-baseline gap-1 font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400 dark:text-stone-100 dark:decoration-stone-700 dark:hover:decoration-rose-400";

export default function UsesPage() {
  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>What I actually use</span>
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Uses<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        Inspired by{" "}
        <a
          href="https://uses.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400 dark:decoration-stone-700"
        >
          uses.tech
        </a>
        . Hardware, software, and services I actually run, with the why
        behind each. Updated when something changes; never just for the
        sake of churn.
      </p>

      <div className="mt-16 space-y-16">
        {USES.map((section, i) => (
          <section key={section.label} aria-labelledby={`uses-${i}`}>
            <div className="mb-6 flex items-baseline gap-3 border-b border-stone-200 pb-3 dark:border-stone-800">
              <span className="font-display text-base font-light tabular-nums text-stone-300 dark:text-stone-700">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <h2
                id={`uses-${i}`}
                className="font-serif text-3xl text-stone-900 dark:text-stone-100"
              >
                {section.label}
                <span className="text-rose-400">.</span>
              </h2>
            </div>
            {section.blurb && (
              <p className="mb-6 max-w-2xl font-serif text-base italic leading-relaxed text-stone-600 dark:text-stone-400">
                {section.blurb}
              </p>
            )}
            <ul className="space-y-5">
              {section.items.map((it) => (
                <li key={it.name} className="flex flex-col gap-1">
                  <span className="flex items-baseline gap-2">
                    {it.reviewHref ? (
                      <Link href={it.reviewHref} className={linkClass}>
                        {it.name}
                      </Link>
                    ) : it.link ? (
                      <a
                        href={it.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {it.name}
                        <ArrowUpRight className="h-3 w-3 self-center transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ) : (
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {it.name}
                      </span>
                    )}
                  </span>
                  {it.detail && (
                    <span className="max-w-prose text-stone-600 dark:text-stone-400">
                      {it.detail}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-20 border-t border-stone-200 pt-8 text-center dark:border-stone-800">
        <p className="font-serif italic text-stone-500 dark:text-stone-400">
          The list shifts. The reasons rarely do.
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
          ❋ /uses
        </p>
      </div>
    </Container>
  );
}
