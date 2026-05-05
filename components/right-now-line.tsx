"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * One-line "what I'd reach for right now" hint near the top of the
 * homepage. Reads the visitor's local clock and points at the relevant
 * routine — morning skincare before noon, the supplement stack mid-day,
 * the evening routine after sunset, the oral routine bookending each
 * day. The line is decorative-helpful, not a CTA, so it stays muted.
 *
 * Hydrates client-side to avoid SSR / hydration mismatch on the
 * greeting (different visitors are in different timezones than the
 * server).
 */
type Slot = {
  label: string;
  href: string;
};

function pickByHour(hour: number): Slot {
  if (hour >= 5 && hour < 11) {
    return { label: "the morning routine", href: "/routine/morning" };
  }
  if (hour >= 11 && hour < 17) {
    return { label: "the daily supplement stack", href: "/routine/stack" };
  }
  if (hour >= 17 && hour < 22) {
    return { label: "the evening routine", href: "/routine/evening" };
  }
  // Late night / pre-dawn — point at the wind-down evening still.
  return { label: "the wind-down evening", href: "/routine/evening" };
}

export function RightNowLine() {
  const [slot, setSlot] = useState<Slot | null>(null);

  useEffect(() => {
    setSlot(pickByHour(new Date().getHours()));
    // Refresh every 30 min so a long open tab doesn't get stuck on
    // morning at midnight.
    const id = setInterval(
      () => setSlot(pickByHour(new Date().getHours())),
      30 * 60 * 1000,
    );
    return () => clearInterval(id);
  }, []);

  if (!slot) return null;

  return (
    <p className="mt-6 max-w-2xl font-serif text-sm italic leading-relaxed text-stone-500 dark:text-stone-400">
      <span className="mr-2 not-italic text-rose-400" aria-hidden>
        ❋
      </span>
      Right now I&rsquo;d reach for{" "}
      <Link
        href={slot.href}
        className="border-b border-rose-300/60 pb-px text-stone-700 transition-colors hover:border-rose-500 hover:text-stone-900 dark:text-stone-200 dark:hover:text-stone-100"
      >
        {slot.label}
      </Link>
      .
    </p>
  );
}
