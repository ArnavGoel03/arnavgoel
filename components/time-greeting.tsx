"use client";

import { useEffect, useState } from "react";

/** Returns a calm greeting based on the browser's current hour. */
function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "good morning";
  if (hour >= 12 && hour < 17) return "good afternoon";
  if (hour >= 17 && hour < 21) return "good evening";
  return "good night";
}

/**
 * A very quiet single line that greets the visitor based on their
 * local clock. Renders nothing on the server (SSR) so hydration
 * never mismatches; the greeting fades in once the browser clock
 * is available.
 */
export function TimeGreeting() {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  if (!greeting) return null;

  return (
    <span
      className="font-serif italic text-stone-400 dark:text-stone-500"
      style={{ opacity: greeting ? 1 : 0, transition: "opacity 600ms" }}
    >
      {greeting}
      <span aria-hidden className="ml-1 text-rose-400/70">
        ·
      </span>
    </span>
  );
}
