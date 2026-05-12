"use client";

import { useEffect, useState } from "react";

/**
 * Subtle floating jump-to-frame trigger that hides until needed.
 * Pressing the `/` key (like a search shortcut) opens a small overlay
 * input; otherwise stays out of the chrome. Editorial restraint.
 */
export function JumpToFrame({ max }: { max: number }) {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    setValue("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(value, 10);
    if (!isNaN(n)) go(n);
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs/textareas
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        if (open && e.key === "Escape") {
          setOpen(false);
          setValue("");
        }
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
        setValue("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={() => {
        setOpen(false);
        setValue("");
      }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-6 pt-32 backdrop-blur-sm"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-950"
      >
        <label
          htmlFor="frame-jump"
          className="font-serif text-sm italic text-stone-500 dark:text-stone-400"
        >
          Jump to frame
        </label>
        <input
          id="frame-jump"
          type="number"
          min={1}
          max={max}
          inputMode="numeric"
          placeholder={`1 to ${max}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          className="w-full border-0 border-b border-stone-300 bg-transparent px-0 py-2 font-serif text-3xl italic text-stone-900 outline-none transition-colors placeholder:text-stone-300 focus:border-rose-400 dark:border-stone-700 dark:text-stone-50 dark:placeholder:text-stone-700"
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
          Enter to jump · Esc to close
        </p>
      </form>
    </div>
  );
}
