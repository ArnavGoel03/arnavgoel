import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { SectionMasthead } from "@/components/section-masthead";
import { CategoryFilter } from "@/components/category-filter";
import { ItemListJsonLd } from "@/components/json-ld";
import { ListingTourMount } from "@/components/listing-tour-mount";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Miscellaneous Reviews",
  description:
    "Random utility objects, gadgets, accessories. The smaller things that earn or fail their shelf space, separate from the cornerstone daily essentials.",
  alternates: { canonical: "/miscellaneous" },
};

export default function MiscellaneousPage() {
  const reviews = getReviews("miscellaneous");
  return (
    <>
      <ItemListJsonLd
        name="Miscellaneous Reviews"
        description="Random utility objects, gadgets, accessories. The smaller things that earn or fail their shelf space."
        url="/miscellaneous"
        items={reviews}
      />
      <Container>
        <SectionMasthead
          volume="Vol. VII, Miscellaneous"
          title="Miscellaneous"
          intro="Random utility objects, gadgets, accessories. Not daily-cornerstone enough for Essentials, but worth noting which ones earned their shelf space and which got returned."
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
