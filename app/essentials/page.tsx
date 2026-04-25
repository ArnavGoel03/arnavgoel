import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
import { ItemListJsonLd } from "@/components/json-ld";
import { ListingTourMount } from "@/components/listing-tour-mount";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Daily Essentials Reviews",
  description:
    "Random utility objects from daily life: chargers, laundry bags, water filters, the small things that earn or fail their shelf space.",
  alternates: { canonical: "/essentials" },
};

export default function EssentialsPage() {
  const reviews = getReviews("essentials");
  return (
    <>
      <ItemListJsonLd
        name="Daily Essentials Reviews"
        description="Random utility objects from daily life: chargers, laundry bags, water filters. The small things that earn or fail their shelf space."
        url="/essentials"
        items={reviews}
      />
      <Container>
        <SectionMasthead
          volume="Vol. VI, Essentials"
          title="Essentials"
          intro="Random utility objects from daily life. Not skincare, not supplements, just the small things that earn or fail their shelf space."
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
