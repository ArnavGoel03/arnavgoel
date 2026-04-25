"use client";

/**
 * Footer "Search" affordance. Opens the global command palette on a
 * normal click, but lets Cmd/Ctrl-click and middle-click fall through
 * to the standalone /search page (with its voice input) for users who
 * want it.
 */
export function FooterSearchLink() {
  return (
    <a
      href="/search"
      className="transition-colors hover:text-stone-700 dark:hover:text-stone-200"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.button !== 0) return;
        e.preventDefault();
        window.dispatchEvent(new Event("palette:open"));
      }}
    >
      Search
    </a>
  );
}
