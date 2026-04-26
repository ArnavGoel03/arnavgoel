import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { getReviews } from "@/lib/content";
import type { Kind, ReviewSummary } from "@/lib/types";
import { brandTextColor } from "@/lib/retailers";

export const metadata: Metadata = {
  title: "Best of 2026",
  description:
    "The annual issue: every category's top recommend, with the prose to back it up. No filler picks, no sponsored nominations.",
  alternates: { canonical: "/best-of/2026" },
};

const SECTIONS: { kind: Kind; label: string; framing: string }[] = [
  {
    kind: "skincare",
    label: "Skincare",
    framing:
      "Cleansers, actives, moisturizers, sunscreens, the products that earned a permanent slot on the bathroom counter this year.",
  },
  {
    kind: "supplements",
    label: "Supplements",
    framing:
      "Pills and powders that produced a visible-effect change inside the first 8 weeks and stayed in the stack all year.",
  },
  {
    kind: "oral-care",
    label: "Oral care",
    framing:
      "Brushes, pastes, sprays, the small upgrades that made the dentist visit go faster.",
  },
  {
    kind: "hair-care",
    label: "Hair care",
    framing:
      "What I actually washed, conditioned, and styled with. The trimmers chapter has its own pick.",
  },
  {
    kind: "body-care",
    label: "Body care",
    framing:
      "Body washes, lotions, scrubs. Tested through summer in San Diego (the toughest test for body skincare).",
  },
  {
    kind: "essentials",
    label: "Essentials",
    framing:
      "Cornerstone daily devices. The pieces I would replace within a week if any of them broke.",
  },
  {
    kind: "miscellaneous",
    label: "Miscellaneous",
    framing:
      "Random utility objects that punched above their price tag this year.",
  },
];

function pickTop(reviews: ReviewSummary[]): ReviewSummary | null {
  const recommended = reviews.filter((r) => r.verdict === "recommend");
  if (recommended.length === 0) return null;
  // Score: photo presence + average of effect/value/tolerance + bonus for in routines.
  const scored = recommended.map((r) => {
    const axes = [r.ratings?.effect, r.ratings?.value, r.ratings?.tolerance].filter(
      (n): n is number => typeof n === "number",
    );
    const axesAvg = axes.length ? axes.reduce((a, b) => a + b, 0) / axes.length : 7;
    return {
      r,
      score: axesAvg + (r.photo ? 0.5 : 0) + (r.routines.length > 0 ? 0.3 : 0),
    };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].r;
}

export default function BestOf2026Page() {
  const picks = SECTIONS.map((s) => ({
    section: s,
    pick: pickTop(getReviews(s.kind)),
  })).filter((p) => p.pick);

  return (
    <Container className="max-w-3xl py-16 sm:py-24">
      <div className="mb-10 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>The annual issue</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">
          Vol. 2026
        </span>
      </div>

      <h1 className="font-serif text-[14vw] leading-[0.92] tracking-[-0.045em] text-stone-900 dark:text-stone-100 sm:text-8xl">
        Best of
        <br />
        2026<span className="text-rose-400">.</span>
      </h1>

      <p className="mt-10 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 dark:text-stone-300">
        Every category, one pick. The product I would buy first if I were
        starting that shelf from scratch tomorrow.
      </p>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        Methodology: from the catalog of reviews this year that earned a{" "}
        <em>recommend</em> verdict, the highest-scoring pick on the
        combined effect / value / tolerance axes, with a small nudge for
        products I have used long enough to attach a real photo. No
        nominations, no submissions, no PR samples considered. The verdict
        word leads; the prose carries the case.
      </p>

      <ol className="mt-16 space-y-16">
        {picks.map(({ section, pick }, i) => {
          if (!pick) return null;
          return (
            <li key={section.kind} className="border-t border-stone-200 pt-10 dark:border-stone-800">
              <p className="mb-2 flex items-baseline gap-3 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                <span className="font-display text-base font-light tabular-nums text-stone-300 dark:text-stone-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>Best in {section.label}</span>
              </p>
              <Link
                href={`/${pick.kind}/${pick.slug}`}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400"
              >
                <h2 className="font-serif text-3xl leading-tight text-stone-900 group-hover:text-rose-700 dark:text-stone-100 dark:group-hover:text-rose-400 sm:text-4xl">
                  {pick.name}
                </h2>
                <p className="mt-2 text-sm uppercase tracking-[0.18em]">
                  <span className={"font-medium " + brandTextColor(pick.brand)}>
                    {pick.brand}
                  </span>
                  <span className="text-stone-400 dark:text-stone-500">
                    {" "}
                    · {pick.category}
                  </span>
                </p>
              </Link>
              <p className="mt-5 max-w-2xl font-serif text-base italic leading-relaxed text-stone-600 dark:text-stone-300">
                {section.framing}
              </p>
              {pick.summary && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-700 dark:text-stone-300">
                  {pick.summary}
                </p>
              )}
              <p className="mt-5">
                <Link
                  href={`/${pick.kind}/${pick.slug}`}
                  className="text-sm uppercase tracking-[0.18em] text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-rose-400 dark:text-stone-400 dark:decoration-stone-700 dark:hover:text-stone-100"
                >
                  Read the full review →
                </Link>
              </p>
            </li>
          );
        })}
      </ol>

      <p className="mt-20 border-t border-stone-200 pt-8 text-center font-serif italic text-stone-500 dark:border-stone-800 dark:text-stone-400">
        Year-end issue, ❋ {new Date().getFullYear()}.
      </p>
    </Container>
  );
}
