import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
import { ItemListJsonLd } from "@/components/json-ld";
import { ListingTourMount } from "@/components/listing-tour-mount";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Oral Care Reviews",
  description:
    "Honest reviews of every oral care product I use, electric toothbrushes, toothpastes, mouthwash, floss. Rated out of 10 with pros, cons, and repurchase decisions.",
  alternates: { canonical: "/oral-care" },
};

export default function OralCarePage() {
  const reviews = getReviews("oral-care");
  return (
    <>
      <ItemListJsonLd
        name="Oral Care Reviews"
        description="First-person oral-care reviews. Electric toothbrushes, toothpastes, mouthwash, floss, every tube and brush head used long enough to have an honest opinion."
        url="/oral-care"
        items={reviews}
      />
      <Container>
        <SectionMasthead
          volume="Vol. III, Oral care"
          title="Oral care"
          intro="Brushes, pastes, mouthwash, floss. What lives in my bathroom cabinet for teeth, breath, and gums."
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
