import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
import { ItemListJsonLd } from "@/components/json-ld";
import { ListingTourMount } from "@/components/listing-tour-mount";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hair Care Reviews",
  description:
    "Honest reviews of every hair product I use, conditioners, treatments, masks, shampoos, plus the styling kit. Rated with verdict + axes for effect, value, and tolerance.",
  alternates: { canonical: "/hair-care" },
};

/**
 * Three-chapter layout. `tool` (trimmers, IPL, dermaplaning blades)
 * and `styling` (sprays, powders, waxes) each get their own filter
 * rail so the page reads as a sequence: wash & treat → style → cut &
 * trim, instead of a single mixed bin.
 */
const STYLING_CATEGORIES = new Set(["styling", "hair styling"]);
const TOOL_CATEGORIES = new Set(["tool", "tools", "trimmer"]);

export default function HairCarePage() {
  const reviews = getReviews("hair-care");
  const isStyling = (c: string) => STYLING_CATEGORIES.has(c.toLowerCase());
  const isTool = (c: string) => TOOL_CATEGORIES.has(c.toLowerCase());
  const treatment = reviews.filter(
    (r) => !isStyling(r.category) && !isTool(r.category),
  );
  const styling = reviews.filter((r) => isStyling(r.category));
  const tools = reviews.filter((r) => isTool(r.category));

  return (
    <>
      <ItemListJsonLd
        name="Hair Care Reviews"
        description="First-person hair-care reviews. Conditioners, masks, treatments, shampoos, plus the styling kit and the trimmers, every product through the shower routine for at least a month."
        url="/hair-care"
        items={reviews}
      />
      <Container>
        <SectionMasthead
          volume="Vol. IV, Hair care"
          title="Hair care"
          intro="Conditioners, masks, treatments, the supporting cast of products for hair, scalp, and ends. Styling and tools each sit in their own chapter below."
          reviews={reviews}
        />
      </Container>

      <Container className="py-10 pb-12">
        <ChapterEyebrow
          number="i"
          label="Treatment"
          tagline="What I wash, condition, and fix the scalp with."
        />
        <CategoryFilter reviews={treatment} />
      </Container>

      {styling.length > 0 && (
        <>
          <Container>
            <hr className="border-stone-200 dark:border-stone-800" />
          </Container>
          <Container className="py-10 pb-12">
            <ChapterEyebrow
              number="ii"
              label="Styling"
              tagline="What goes in after the shower, when the hair is dry."
            />
            <CategoryFilter reviews={styling} />
          </Container>
        </>
      )}

      {tools.length > 0 && (
        <>
          <Container>
            <hr className="border-stone-200 dark:border-stone-800" />
          </Container>
          <Container className="py-10 pb-24">
            <ChapterEyebrow
              number="iii"
              label="Tools"
              tagline="Trimmers, clippers, the hardware. Built to outlast the bottles."
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
