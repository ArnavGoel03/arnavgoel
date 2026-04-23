import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { MdxContent } from "@/components/mdx-content";
import { getPrimer, getPrimers } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPrimers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const primer = getPrimer(slug);
  if (!primer) return {};
  const description = primer.subtitle ?? `${primer.title} — a primer.`;
  return {
    title: `${primer.title} — Primer`,
    description,
    alternates: { canonical: `/primers/${primer.slug}` },
    openGraph: {
      type: "article",
      title: primer.title,
      description,
      publishedTime: primer.datePublished,
    },
  };
}

export default async function PrimerPage({ params }: Props) {
  const { slug } = await params;
  const primer = getPrimer(slug);
  if (!primer) notFound();

  return (
    <article>
      <Container className="max-w-3xl py-10">
        <Link
          href="/primers"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          All primers
        </Link>

        <header className="mt-8 border-b border-stone-300 pb-10">
          <div className="mb-4 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
            <span className="flex items-baseline gap-2">
              <span className="text-rose-400">❋</span>
              <span>
                {primer.domain === "supplement" ? "Health" : "Skincare"} ·{" "}
                {primer.kind === "stack" ? "Stack" : "Ingredient"}
              </span>
            </span>
            <span className="font-mono text-stone-400">
              {new Date(primer.datePublished).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="font-serif text-4xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl">
            {primer.title}
            <span className="text-rose-400">.</span>
          </h1>

          {primer.subtitle && (
            <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl">
              {primer.subtitle}
            </p>
          )}

          {primer.stack.length > 0 && (
            <div className="mt-8 border-y border-stone-200 py-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-stone-500">
                {primer.kind === "stack" ? "The stack" : "Covered"}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-serif text-base text-stone-700">
                {primer.stack.map((s, i) => (
                  <span key={s}>
                    {i > 0 && (
                      <span className="mr-3 text-stone-300" aria-hidden>
                        ·
                      </span>
                    )}
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="mt-10">
          <MdxContent source={primer.body} />
        </div>
      </Container>
    </article>
  );
}
