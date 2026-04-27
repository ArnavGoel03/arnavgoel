import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
import { ItemListJsonLd } from "@/components/json-ld";
import { ListingTourMount } from "@/components/listing-tour-mount";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Body Care Reviews",
  description:
    "Honest reviews of every body-care product I use, body washes, lotions, scrubs. Rated out of 10 with pros, cons, and repurchase decisions.",
  alternates: { canonical: "/body-care" },
};

/**
 * Two-chapter layout, mirroring the hair-care section. `tool`
 * (trimmers, IPL devices) sits in its own chapter so the wash-and-
 * moisturise sequence isn't interrupted by hardware.
 */
const TOOL_CATEGORIES = new Set(["tool", "tools", "trimmer", "ipl"]);

export default function BodyCarePage() {
  const reviews = getReviews("body-care");
  const isTool = (c: string) => TOOL_CATEGORIES.has(c.toLowerCase());
  const care = reviews.filter((r) => !isTool(r.category));
  const tools = reviews.filter((r) => isTool(r.category));

  return (
    <>
      <ItemListJsonLd
        name="Body Care Reviews"
        description="First-person body-care reviews. Body washes, lotions, scrubs, the everyday cleanse-and-moisturise from the neck down, plus the trimmers and hair-removal hardware."
        url="/body-care"
        items={reviews}
      />
      <Container>
        <SectionMasthead
          volume="Vol. V, Body care"
          title="Body care"
          intro="Body washes, lotions, scrubs, the everyday cleanse-and-moisturise from the neck down. Tools live in their own chapter below."
          reviews={reviews}
        />
      </Container>

      <Container className="py-10 pb-12">
        <ChapterEyebrow
          number="i"
          label="Care"
          tagline="Wash, moisturise, scrub. The bottle-and-tube routine."
        />
        <CategoryFilter reviews={care} />
      </Container>

      {tools.length > 0 && (
        <>
          <Container>
            <hr className="border-stone-200 dark:border-stone-800" />
          </Container>
          <Container className="py-10 pb-24">
            <ChapterEyebrow
              number="ii"
              label="Tools"
              tagline="Trimmers and hair-removal hardware. Built to outlast the bottles."
            />
            <CategoryFilter reviews={tools} />
          </Container>
        </>
      )}

      <Suspense fallback={null}>
        <ListingTourMount />
      </Suspense>
    </>
  );
}

/**
 * Editorial chapter masthead. Two roman numerals, a serif heading, an
 * italic tagline. Restrained on purpose: the chapters need to feel
 * separated, not loud.
 */
function ChapterEyebrow({
  number,
  label,
  tagline,
}: {
  number: string;
  label: string;
  tagline: string;
}) {
  return (
    <div className="mb-8 flex items-baseline gap-4 border-b border-stone-200 pb-4 dark:border-stone-800">
      <span className="font-display text-base font-light tabular-nums text-stone-300 dark:text-stone-700">
        {number}.
      </span>
      <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100">
        {label}
        <span className="text-rose-400">.</span>
      </h2>
      <p className="hidden flex-1 items-baseline border-l border-stone-200 pl-4 font-serif text-sm italic text-stone-500 sm:flex dark:border-stone-800 dark:text-stone-400">
        {tagline}
      </p>
    </div>
  );
}
