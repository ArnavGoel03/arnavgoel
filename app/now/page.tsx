import type { Metadata } from "next";
import { Container } from "@/components/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Now",
  description: `What ${site.shortName} is working on, reading, and thinking about right now.`,
  alternates: { canonical: "/now" },
};

const lastUpdated = "2026-04-23";

export default function NowPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
        Now
      </p>
      <h1 className="font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        What I&apos;m up to.
      </h1>
      <p className="mt-4 text-sm text-stone-500">
        Last updated{" "}
        <time dateTime={lastUpdated}>
          {new Date(lastUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        .
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="font-serif text-2xl text-stone-900">Working on</h2>
          <ul className="mt-4 space-y-3 text-stone-700">
            <li>
              <strong className="text-stone-900">Buzz</strong> — a native iOS
              event discovery app for college students, starting with my own
              campus. SwiftUI, polish-focused.
            </li>
            <li>
              <strong className="text-stone-900">This site</strong> — you&apos;re
              on it. Plan is to update the <em>now</em> page at least once a
              month.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-stone-900">Reading</h2>
          <ul className="mt-4 space-y-3 text-stone-700">
            <li>Currently somewhere in the middle of a few books.</li>
            <li>Add your current reads here — non-fiction, fiction, papers.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-stone-900">Thinking about</h2>
          <ul className="mt-4 space-y-3 text-stone-700">
            <li>
              How to make software that feels quiet — that does its job and
              gets out of the way.
            </li>
            <li>What to cook this week.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-stone-900">Not doing</h2>
          <ul className="mt-4 space-y-3 text-stone-700">
            <li>
              Anything involving LeetCode grinds. Anything that doesn&apos;t
              excite me.
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-16 text-sm text-stone-500">
        Inspired by{" "}
        <a
          href="https://nownownow.com/about"
          className="underline underline-offset-4 hover:text-stone-900"
        >
          Derek Sivers&apos; /now page movement
        </a>
        .
      </p>
    </Container>
  );
}
