"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "yashgoel-theme";

function apply(theme: Theme) {
  const root = document.documentElement;
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setTheme(stored);
    apply(stored);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current =
        (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
      if (current === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function set(next: Theme) {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  }

  const resolved: "light" | "dark" =
    theme === "dark"
      ? "dark"
      : theme === "light"
        ? "light"
        : typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

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
          "relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors " +
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
          "relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors " +
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
    var theme = stored || 'system';
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
`;
