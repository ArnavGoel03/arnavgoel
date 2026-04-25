import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
import { ItemListJsonLd } from "@/components/json-ld";
import { ListingTourMount } from "@/components/listing-tour-mount";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Body Care Reviews",
  description:
    "Honest reviews of every body-care product I use, body washes, lotions, scrubs. Rated out of 10 with pros, cons, and repurchase decisions.",
  alternates: { canonical: "/body-care" },
};

export default function BodyCarePage() {
  const reviews = getReviews("body-care");
  return (
    <>
      <ItemListJsonLd
        name="Body Care Reviews"
        description="First-person body-care reviews. Body washes, lotions, scrubs, the everyday cleanse-and-moisturise from the neck down."
        url="/body-care"
        items={reviews}
      />
      <Container>
        <SectionMasthead
          volume="Vol. V, Body care"
          title="Body care"
          intro="Body washes, lotions, scrubs. The everyday cleanse-and-moisturise from the neck down."
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
