"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  audioCuesEnabled,
  playBell,
  playClick,
  setAudioCues,
} from "@/lib/sounds";

/**
 * Mounts once in layout.tsx.
 *
 * Behaviour:
 *   - On first mount (page-load), plays a soft bell if audio cues are
 *     enabled.
 *   - On route change (pathname change), plays a subtle click.
 *   - Both are no-ops when audio is disabled (default OFF).
 *
 * The component renders nothing visible — the footer toggle is a
 * separate export `AudioToggle` that the Footer component can import.
 */
export function AudioCues() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Page-load bell (only once, after first mount).
  useEffect(() => {
    setMounted(true);
    // Small defer so the AudioContext isn't created during the very
    // first synchronous render — some browsers need a user gesture
    // first. The tiny delay also lets the browser settle the page
    // before the bell plays.
    const t = setTimeout(() => playBell(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route-change click (skip the very first render).
  useEffect(() => {
    if (!mounted) return;
    playClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

/**
 * Footer toggle: a tiny text button that persists the user's preference
 * in localStorage. Renders the current state from localStorage so it's
 * always accurate after a page reload.
 */
export function AudioToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    setEnabled(audioCuesEnabled());
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setAudioCues(next);
  }

  // Don't render until we've read localStorage so the label is correct.
  if (enabled === null) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="transition-colors hover:text-stone-700 dark:hover:text-stone-200"
      aria-pressed={enabled}
      aria-label={enabled ? "Disable sound" : "Enable sound"}
    >
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}
