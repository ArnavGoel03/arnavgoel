import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SearchClient } from "@/components/search-client";
import { buildSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "Search",
  description: "Find a review, primer, or note by name, brand, or ingredient.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  const items = buildSearchIndex();
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Find something</span>
        </span>
        <span className="font-mono text-stone-400">{today}</span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-7xl">
        Search<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 mb-12 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl">
        Everything on the shelf — products by name, brand, or ingredient;
        primers by topic; notes by tag.
      </p>

      <SearchClient items={items} />
    </Container>
  );
}
