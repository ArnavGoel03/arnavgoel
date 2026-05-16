"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme-constants";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const initial: Theme =
      stored === "light" || stored === "dark" ? stored : DEFAULT_THEME;
    setTheme(initial);
    apply(initial);
  }, []);

  function set(next: Theme) {
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
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

// The inline init script that used to live here moved to
// `lib/theme-script.ts` so it can be authorized via a CSP hash without
// pulling `node:crypto` into this client bundle.
