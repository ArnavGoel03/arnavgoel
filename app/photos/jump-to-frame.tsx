"use client";

import { useState } from "react";

export function JumpToFrame({ max }: { max: number }) {
  const [value, setValue] = useState("");

  function go(n: number) {
    if (!Number.isFinite(n) || n < 1 || n > max) return;
    const el = document.getElementById(`frame-${n}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const url = new URL(window.location.href);
      url.hash = `frame-${n}`;
      window.history.replaceState(null, "", url.toString());
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(value, 10);
    if (!isNaN(n)) go(n);
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400"
    >
      <label htmlFor="frame-jump" className="hidden sm:inline">
        Jump to
      </label>
      <span className="font-mono text-stone-400 dark:text-stone-500 sm:hidden">
        №
      </span>
      <input
        id="frame-jump"
        type="number"
        min={1}
        max={max}
        inputMode="numeric"
        placeholder={`1 – ${max}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-20 rounded-md border border-stone-300 bg-white px-2 py-1 text-center font-mono text-xs tabular-nums text-stone-900 outline-none transition-colors focus:border-rose-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
      />
      <button
        type="submit"
        disabled={!value}
        className="rounded-md border border-stone-300 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-rose-400 hover:text-rose-600 disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
      >
        Go
      </button>
    </form>
  );
}
