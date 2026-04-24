import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
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
      <ListingTourMount />
    </>
  );
}
