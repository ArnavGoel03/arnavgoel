"use client";

import { useEffect, useState } from "react";

/**
 * Site-wide toast surface. Mount once in the root layout. Anything on
 * the site can fire a toast by dispatching:
 *
 *   window.dispatchEvent(new CustomEvent("toast", { detail: { message, tone } }))
 *
 * Or use the `toast(...)` helper exported from lib/toast.ts which
 * handles both client and server contexts (server calls are no-ops).
 *
 * Subtle by design:
 *   - bottom-center (or bottom-right on >= sm), single line
 *   - rose-tinted ❋ glyph instead of an icon library
 *   - auto-dismisses at 1.5s by default; pass `duration: 0` for sticky
 *   - dark-mode contrast lifts via a light card on a dark page edge
 *   - reduced-motion users skip the slide-in
 *
 * One toast at a time on purpose; firing a new one replaces the old.
 */

type Tone = "success" | "info" | "error";

type ToastDetail = {
  message: string;
  tone?: Tone;
  duration?: number; // ms, 0 = sticky until next
};

type State = (ToastDetail & { id: number }) | null;

const TONE_STYLES: Record<Tone, string> = {
  success:
    "border-emerald-300 bg-white text-stone-900 dark:border-emerald-900/50 dark:bg-stone-900 dark:text-stone-100",
  info: "border-stone-300 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100",
  error:
    "border-rose-300 bg-white text-stone-900 dark:border-rose-900/50 dark:bg-stone-900 dark:text-stone-100",
};

const TONE_GLYPH: Record<Tone, string> = {
  success: "❋",
  info: "❋",
  error: "❋",
};

const TONE_GLYPH_COLOR: Record<Tone, string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  info: "text-rose-400",
  error: "text-rose-600 dark:text-rose-400",
};

export function ToastHost() {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    function onEvent(e: Event) {
      const ce = e as CustomEvent<ToastDetail>;
      const detail = ce.detail;
      if (!detail || typeof detail.message !== "string") return;
      const id = Date.now() + Math.random();
      setState({ ...detail, id });
      const duration = detail.duration ?? 1500;
      if (duration > 0) {
        window.setTimeout(() => {
          setState((prev) => (prev?.id === id ? null : prev));
        }, duration);
      }
    }
    window.addEventListener("toast", onEvent);
    return () => window.removeEventListener("toast", onEvent);
  }, []);

  if (!state) return null;

  const tone: Tone = state.tone ?? "success";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 sm:bottom-8 sm:left-auto sm:right-8 sm:justify-end"
    >
      <div
        className={
          "pointer-events-auto inline-flex items-baseline gap-3 rounded-full border px-4 py-2 text-sm shadow-lg animate-[toast-in_180ms_cubic-bezier(0.22,1,0.36,1)] " +
          TONE_STYLES[tone]
        }
      >
        <span aria-hidden className={TONE_GLYPH_COLOR[tone]}>
          {TONE_GLYPH[tone]}
        </span>
        <span>{state.message}</span>
      </div>
    </div>
  );
}
