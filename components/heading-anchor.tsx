"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hover-revealed rose ❋ next to a section heading. Click copies a
 * deep link (`window.location.origin + pathname + #id`) to the
 * clipboard and shows a tiny "copied" tag for ~1.4s. Falls back to
 * `prompt()` on browsers without `navigator.clipboard` so the link is
 * still recoverable.
 *
 * Used by MdxContent's h2 / h3 mapping. The parent heading needs the
 * `group` className for the hover transition to fire.
 */
export function HeadingAnchor({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // let modified clicks behave normally
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    history.replaceState(null, "", `#${id}`);
    const fallback = () => window.prompt("Copy link to this section", url);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopied(true);
          if (timeout.current) clearTimeout(timeout.current);
          timeout.current = setTimeout(() => setCopied(false), 1400);
        })
        .catch(fallback);
    } else {
      fallback();
    }
  };

  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      aria-label={copied ? "Link copied" : "Copy link to this section"}
      className="ml-2 inline-flex items-baseline align-baseline text-sm text-stone-300 no-underline opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100 focus-visible:opacity-100 dark:text-stone-700 dark:hover:text-rose-400"
    >
      <span aria-hidden>❋</span>
      {copied && (
        <span className="ml-1.5 font-sans text-[10px] uppercase not-italic tracking-[0.18em] text-rose-500 dark:text-rose-400">
          copied
        </span>
      )}
    </a>
  );
}
