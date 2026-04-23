import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeading } from "@/components/page-heading";
import { CategoryFilter } from "@/components/category-filter";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Skincare Reviews",
  description:
    "Honest reviews of every skincare product I've tried — cleansers, serums, moisturizers, sunscreens, treatments. Rated out of 10 with pros, cons, and repurchase decisions.",
  alternates: { canonical: "/skincare" },
};

export default function SkincarePage() {
  const reviews = getReviews("skincare");
  return (
    <>
      <Container>
        <PageHeading
          eyebrow={`${reviews.length} reviews`}
          title="Skincare"
          description="Cleansers, serums, moisturizers, sunscreens. Everything I've put on my face — what worked, what didn't."
        />
      </Container>
      <Container className="pb-20">
        <CategoryFilter reviews={reviews} />
      </Container>
    </>
  );
}
