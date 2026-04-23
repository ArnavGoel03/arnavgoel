import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeading } from "@/components/page-heading";
import { CategoryFilter } from "@/components/category-filter";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Oral Care Reviews",
  description:
    "Honest reviews of every oral care product I use — electric toothbrushes, toothpastes, mouthwash, floss. Rated out of 10 with pros, cons, and repurchase decisions.",
  alternates: { canonical: "/oral-care" },
};

export default function OralCarePage() {
  const reviews = getReviews("oral-care");
  return (
    <>
      <Container>
        <PageHeading
          eyebrow={`${reviews.length} reviews`}
          title="Oral care"
          description="Brushes, pastes, mouthwash, floss. What's in my bathroom cabinet for teeth."
        />
      </Container>
      <Container className="pb-20">
        <CategoryFilter reviews={reviews} />
      </Container>
    </>
  );
}
