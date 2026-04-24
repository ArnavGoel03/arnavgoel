import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="max-w-3xl py-20 sm:py-28">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Errata</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">Issue not found</span>
      </div>

      <p className="font-display text-[20vw] font-light leading-[0.85] tracking-[-0.04em] text-stone-900 sm:text-[14rem] dark:text-stone-100">
        404<span className="text-rose-400">.</span>
      </p>

      <h1 className="mt-8 font-serif text-3xl italic leading-tight text-stone-700 sm:text-4xl dark:text-stone-300">
        This page is out of print.
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
        The URL you tried isn&apos;t in this volume. Either the page never
        existed, the URL changed, or I quietly unpublished it. The site is
        small enough that nothing here is hidden, try one of these:
      </p>

      <ul className="mt-8 space-y-3 text-stone-700 dark:text-stone-300">
        <li className="flex items-baseline gap-3">
          <span aria-hidden className="text-rose-400">❋</span>
          <Link
            href="/skincare"
            className="font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400"
          >
            Skincare
          </Link>
          <span className="italic text-stone-500 dark:text-stone-400">- the most-trafficked section</span>
        </li>
        <li className="flex items-baseline gap-3">
          <span aria-hidden className="text-rose-400">❋</span>
          <Link
            href="/notes"
            className="font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400"
          >
            Notes
          </Link>
          <span className="italic text-stone-500 dark:text-stone-400">- if you came for the writing</span>
        </li>
        <li className="flex items-baseline gap-3">
          <span aria-hidden className="text-rose-400">❋</span>
          <Link
            href="/"
            className="font-medium underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400"
          >
            Home
          </Link>
          <span className="italic text-stone-500 dark:text-stone-400">- start from the beginning</span>
        </li>
      </ul>
    </Container>
  );
}
