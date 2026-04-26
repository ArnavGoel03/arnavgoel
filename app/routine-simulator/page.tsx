import type { Metadata } from "next";
import { Container } from "@/components/container";
import { RoutineSimulator } from "@/components/routine-simulator";
import { getReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Routine simulator",
  description:
    "Pick your goals, your skin type, and a budget; get a curated routine pulled from products on the site.",
  alternates: { canonical: "/routine-simulator" },
};

export default function RoutineSimulatorPage() {
  // Server-side fetch the catalog, hand it to the client component.
  // Strip the `body` field to keep the payload lean.
  const catalog = [
    ...getReviews("skincare"),
    ...getReviews("supplements"),
    ...getReviews("oral-care"),
    ...getReviews("hair-care"),
    ...getReviews("body-care"),
  ].map((r) => ({
    kind: r.kind,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    verdict: r.verdict,
    skinType: r.skinType ?? [],
    goal: r.goal ?? [],
    price: r.price,
  }));

  return (
    <Container className="max-w-4xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Build a routine</span>
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Routine simulator<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        Pick the variables, get a routine. The picks come straight from
        products I have actually reviewed; the simulator only ranks and
        filters, never invents.
      </p>

      <RoutineSimulator catalog={catalog} />
    </Container>
  );
}
