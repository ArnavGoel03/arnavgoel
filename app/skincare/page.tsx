import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Skincare Reviews",
  description:
    "Honest reviews of every skincare product I've tried, cleansers, serums, moisturizers, sunscreens, treatments. Rated out of 10 with pros, cons, and repurchase decisions.",
  alternates: { canonical: "/skincare" },
};

export default function SkincarePage() {
  const reviews = getReviews("skincare");
  return (
    <>
      <Container>
        <SectionMasthead
          volume="Vol. I, Skincare"
          title="Skincare"
          intro="Cleansers, serums, moisturizers, sunscreens. Every product that's lived on my face for a month."
          reviews={reviews}
        />
      </Container>
      <Container className="py-10 pb-24">
        <CategoryFilter reviews={reviews} />
      </Container>
    </>
  );
}
