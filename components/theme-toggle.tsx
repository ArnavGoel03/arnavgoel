"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "yashgoel-theme";
// Dark is the house style: the editorial stone-on-near-black aesthetic
// looks right by default. Users who prefer light can still toggle, and
// the choice is persisted for next visit.
const DEFAULT_THEME: Theme = "dark";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme =
      stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
    setTheme(initial);
    apply(initial);
  }, []);

  function set(next: Theme) {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  const resolved: "light" | "dark" = theme;

  const isLight = resolved === "light";
  const isDark = resolved === "dark";

  return (
    <div
      role="group"
      aria-label="Theme"
      className="relative inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-0.5 dark:border-stone-800 dark:bg-stone-900"
    >
      <button
        type="button"
        onClick={() => set("light")}
        aria-label="Light mode"
        aria-pressed={isLight}
        title="Light mode"
        className={
          "relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:h-7 lg:w-7 " +
          (isLight
            ? "bg-white text-stone-900 shadow-sm"
            : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200")
        }
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => set("dark")}
        aria-label="Dark mode"
        aria-pressed={isDark}
        title="Dark mode"
        className={
          "relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:h-7 lg:w-7 " +
          (isDark
            ? "bg-stone-800 text-stone-100 shadow-sm"
            : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200")
        }
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/**
 * Inline script injected into <head> to apply the saved theme BEFORE
 * React hydrates, avoids the "flash of light UI" when a user has chosen
 * dark. Keep this tiny; it runs on every navigation.
 */
export const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = (stored === 'light' || stored === 'dark') ? stored : '${DEFAULT_THEME}';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = '${DEFAULT_THEME}';
  }
})();
`;
