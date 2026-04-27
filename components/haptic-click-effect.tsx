"use client";

import { useEffect } from "react";
import { hapticClick } from "@/lib/haptic-click";

/**
 * Mounts a single document-level click listener that calls
 * `hapticClick()` on every click. The helper itself is a no-op
 * on desktop and SSR — this component is just the mounting
 * point so we don't pollute layout.tsx with a useEffect.
 *
 * Renders nothing; mount once in app/layout.tsx.
 */
export function HapticClickEffect() {
  useEffect(() => {
    document.addEventListener("click", hapticClick);
    return () => document.removeEventListener("click", hapticClick);
  }, []);

  return null;
}
