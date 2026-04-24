import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
import { ListingTourMount } from "@/components/listing-tour-mount";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Supplement Reviews",
  description:
    "Honest reviews of every supplement I've taken, vitamins, minerals, nootropics, adaptogens. Rated out of 10 with what I actually felt.",
  alternates: { canonical: "/supplements" },
};

export default function SupplementsPage() {
  const reviews = getReviews("supplements");
  return (
    <>
      <Container>
        <SectionMasthead
          volume="Vol. II, Supplements"
          title="Supplements"
          intro="Vitamins, minerals, nootropics, adaptogens. What I took, how long, and whether I felt anything."
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
