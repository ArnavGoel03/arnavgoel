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
    "Honest reviews of every hair product I use, conditioners, treatments, masks, shampoos. Rated out of 10 with pros, cons, and repurchase decisions.",
  alternates: { canonical: "/hair-care" },
};

export default function HairCarePage() {
  const reviews = getReviews("hair-care");
  return (
    <>
      <ItemListJsonLd
        name="Hair Care Reviews"
        description="First-person hair-care reviews. Conditioners, masks, treatments, shampoos, every product through the shower routine for at least a month."
        url="/hair-care"
        items={reviews}
      />
      <Container>
        <SectionMasthead
          volume="Vol. IV, Hair care"
          title="Hair care"
          intro="Conditioners, masks, treatments, the supporting cast of products that live in the shower for hair, scalp, and ends."
          reviews={reviews}
        />
      </Container>
      <Container className="py-10 pb-24">
        <CategoryFilter reviews={reviews} />
      </Container>
      <Suspense fallback={null}>
        <ListingTourMount />
      </Suspense>
    </>
  );
}
