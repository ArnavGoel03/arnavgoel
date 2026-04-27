/**
 * Tiny haptic feedback helper for click events.
 *
 * Calls navigator.vibrate(8) — a single 8ms pulse — so taps feel
 * physically acknowledged on phones and tablets.
 *
 * Two no-op guards:
 *  1. SSR (typeof window check)
 *  2. Mouse-only desktops: we skip vibrate on devices that have a
 *     fine pointer (hover: hover) because desktops almost never
 *     have vibration hardware and the API is a no-op there anyway.
 *     The check avoids the overhead and keeps things clean.
 */
export function hapticClick(): void {
  if (typeof window === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  // Skip on devices with a fine pointer (mouse / trackpad) — they
  // rarely have vibration hardware, and the intent is touch feedback.
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  try {
    navigator.vibrate(8);
  } catch {
    // Some browsers restrict vibrate behind a permission; silently skip.
  }
}
