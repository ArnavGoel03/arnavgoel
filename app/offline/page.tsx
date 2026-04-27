import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offline",
  description: `${site.name} is offline. Reconnect and the page you wanted will load.`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/offline" },
};

export default function OfflinePage() {
  return (
    <Container className="max-w-2xl py-20 sm:py-28">
      <div className="mb-10 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>You&apos;re offline</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">
          {site.location}
        </span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 dark:text-stone-100 sm:text-7xl">
        No signal<span className="text-rose-400">.</span>
      </h1>

      <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-stone-600 dark:text-stone-300">
        The page you wanted needs the network, and the network is not
        cooperating. The pages you&apos;ve already visited are still
        readable, the rest will land when you&apos;re back online.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          Try the home page
        </Link>
        <Link
          href="/now"
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition-colors hover:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-400"
        >
          What&apos;s on the shelf
        </Link>
      </div>
    </Container>
  );
}
