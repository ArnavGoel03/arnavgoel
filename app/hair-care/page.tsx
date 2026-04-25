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
 * Categories that count as "styling" — separated from treatment so the
 * page reads as two chapters instead of one undifferentiated bin.
 * Adding a new styling-class category later means appending here.
 */
const STYLING_CATEGORIES = new Set(["styling", "hair styling"]);

export default function HairCarePage() {
  const reviews = getReviews("hair-care");
  const treatment = reviews.filter(
    (r) => !STYLING_CATEGORIES.has(r.category.toLowerCase()),
  );
  const styling = reviews.filter((r) =>
    STYLING_CATEGORIES.has(r.category.toLowerCase()),
  );

  return (
    <>
      <ItemListJsonLd
        name="Hair Care Reviews"
        description="First-person hair-care reviews. Conditioners, masks, treatments, shampoos, plus the styling kit, every product through the shower routine for at least a month."
        url="/hair-care"
        items={reviews}
      />
      <Container>
        <SectionMasthead
          volume="Vol. IV, Hair care"
          title="Hair care"
          intro="Conditioners, masks, treatments, the supporting cast of products that live in the shower for hair, scalp, and ends. Styling sits in its own chapter below."
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
          <Container className="py-10 pb-24">
            <ChapterEyebrow
              number="ii"
              label="Styling"
              tagline="What goes in after the shower, when the hair is dry."
            />
            <CategoryFilter reviews={styling} />
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
