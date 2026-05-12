"use client";

import { useEffect, useState } from "react";

type Chapter = { id: string; label: string };

/**
 * Sticky chapter quick-jump bar. Highlights the currently-on-screen
 * chapter via IntersectionObserver, and lets you click any chapter
 * name to smooth-scroll to it.
 */
export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState<string>(chapters[0]?.id ?? "");

  useEffect(() => {
    if (chapters.length === 0) return;
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Most-visible entry wins
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  function jump(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.replaceState(null, "", url.toString());
  }

  return (
    <nav
      aria-label="Chapter navigation"
      className="sticky top-0 z-40 -mx-6 border-b border-stone-200/80 bg-white/85 px-6 py-2 backdrop-blur sm:py-2.5 dark:border-stone-800/80 dark:bg-stone-950/85"
    >
      <ul className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto text-[10px] uppercase tracking-[0.22em] sm:gap-2 sm:text-[11px]">
        {chapters.map((c) => {
          const isActive = c.id === active;
          return (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                onClick={(e) => jump(e, c.id)}
                className={`block rounded-full px-3 py-1 transition-colors sm:px-4 sm:py-1.5 ${
                  isActive
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                }`}
              >
                {c.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
