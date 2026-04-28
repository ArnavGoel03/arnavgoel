import type { Metadata } from "next";
import { Container } from "@/components/container";
import { getAllReviews } from "@/lib/content";
import { ShelfClient } from "./shelf-client";

export const metadata: Metadata = {
  title: "Shelf",
  description:
    "Personal shelf — products you've saved while browsing. Stored locally in your own browser; nothing leaves your device.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/shelf" },
};

/**
 * The reader's personal shelf — every product they've tapped the
 * rose ❋ on across the catalog. Persisted in localStorage so it
 * survives across visits, scoped to the current browser. No auth,
 * no server storage, no telemetry.
 *
 * Server passes the entire review catalog (already a small JSON
 * payload, ~40-60 KB) so the client can filter by IDs without an
 * API round-trip.
 */
export default function ShelfPage() {
  const reviews = getAllReviews();
  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Your shelf</span>
        </span>
        <span className="hidden font-mono text-stone-400 dark:text-stone-500 sm:inline">
          local to this browser
        </span>
      </div>
      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 dark:text-stone-100 sm:text-7xl">
        Shelf<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-stone-600 dark:text-stone-300 sm:text-xl">
        Everything you&apos;ve tapped the rose on. Saved here in your
        browser, never anywhere else. Tap the asterisk again to remove.
      </p>
      <ShelfClient reviews={reviews} />
    </Container>
  );
}
