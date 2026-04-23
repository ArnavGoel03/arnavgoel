import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeading } from "@/components/page-heading";
import { CategoryFilter } from "@/components/category-filter";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Supplement Reviews",
  description:
    "Honest reviews of every supplement I've taken — vitamins, minerals, nootropics, adaptogens. Rated out of 10 with what I actually felt.",
  alternates: { canonical: "/supplements" },
};

export default function SupplementsPage() {
  const reviews = getReviews("supplements");
  return (
    <>
      <Container>
        <PageHeading
          eyebrow={`${reviews.length} reviews`}
          title="Supplements"
          description="Vitamins, minerals, nootropics, adaptogens. What I took, how long, and whether I noticed anything."
        />
      </Container>
      <Container className="pb-20">
        <CategoryFilter reviews={reviews} />
      </Container>
    </>
  );
}
