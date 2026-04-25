import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SubscribeForm } from "@/components/subscribe-form";

export const metadata: Metadata = {
  title: "Subscribe",
  description:
    "Get the next review the day it ships. No tracking, no upsells, unsubscribe in one click.",
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-24">
      <div className="mb-10 flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>The list</span>
        </span>
      </div>
      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        New reviews,
        <br />
        in your inbox<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-8 max-w-xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        About one email a week. Whatever I have actually finished testing for
        a month or longer. No first impressions, no PR roundups.
      </p>

      <ul className="mt-10 space-y-3 text-base text-stone-700 dark:text-stone-300">
        <li className="flex items-baseline gap-3">
          <span aria-hidden className="text-rose-400">❋</span>
          <span>One email per published review. No drip campaigns.</span>
        </li>
        <li className="flex items-baseline gap-3">
          <span aria-hidden className="text-rose-400">❋</span>
          <span>No tracking pixels, no behavioural retargeting.</span>
        </li>
        <li className="flex items-baseline gap-3">
          <span aria-hidden className="text-rose-400">❋</span>
          <span>One-click unsubscribe in the footer of every email.</span>
        </li>
        <li className="flex items-baseline gap-3">
          <span aria-hidden className="text-rose-400">❋</span>
          <span>
            Your address never goes anywhere except my own sender. No partners.
          </span>
        </li>
      </ul>

      <div className="mt-12">
        <SubscribeForm variant="block" source="subscribe" />
      </div>

      <p className="mt-10 max-w-xl text-sm text-stone-500 dark:text-stone-400">
        Prefer RSS? The site exposes <code>/feed.xml</code> and{" "}
        <code>/llms.txt</code>; both update automatically when a new review
        ships.
      </p>
    </Container>
  );
}
