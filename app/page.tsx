import Link from "next/link";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { getAllReviews, getReviews } from "@/lib/content";
import { site } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const all = getAllReviews();
  const recent = all.slice(0, 6);
  const skincareCount = getReviews("skincare").length;
  const supplementsCount = getReviews("supplements").length;
  const topRated = [...all].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <>
      <section className="border-b border-stone-200/70 bg-gradient-to-b from-stone-50 to-white">
        <Container className="py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-stone-500">
              A personal review log
            </p>
            <h1 className="font-serif text-5xl leading-[1.05] text-stone-900 sm:text-7xl">
              Every product
              <br />
              I&apos;ve actually{" "}
              <span className="italic text-stone-500">used</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
              {site.description} No affiliate links. No hype. Just what worked,
              what didn&apos;t, and whether I&apos;d buy it again.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/skincare"
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                Skincare ({skincareCount})
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/supplements"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition-colors hover:border-stone-900"
              >
                Supplements ({supplementsCount})
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {topRated.length > 0 && (
        <Container className="py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                Top rated
              </p>
              <h2 className="font-serif text-3xl text-stone-900">
                The ones worth buying
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topRated.map((r) => (
              <ProductCard key={`${r.kind}-${r.slug}`} review={r} />
            ))}
          </div>
        </Container>
      )}

      {recent.length > 0 && (
        <Container className="pb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                Recently reviewed
              </p>
              <h2 className="font-serif text-3xl text-stone-900">
                What I&apos;ve been trying
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <ProductCard key={`${r.kind}-${r.slug}`} review={r} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
