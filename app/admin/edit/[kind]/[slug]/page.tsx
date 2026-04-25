import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { PageHeading } from "@/components/page-heading";
import { ProductForm } from "../../../product-form";
import { getReview } from "@/lib/content";
import type { Kind } from "@/lib/types";

export const metadata: Metadata = {
  title: "Edit review",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const VALID_KINDS: Kind[] = ["skincare", "supplements", "oral-care", "hair-care"];

type Props = { params: Promise<{ kind: string; slug: string }> };

export default async function EditReviewPage({ params }: Props) {
  const { kind, slug } = await params;
  if (!VALID_KINDS.includes(kind as Kind)) notFound();
  const review = getReview(kind as Kind, slug);
  if (!review) notFound();

  return (
    <>
      <Container>
        <div className="flex items-center justify-between pt-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <Link
            href={`/${review.kind}/${review.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
          >
            View live ↗
          </Link>
        </div>
        <PageHeading
          eyebrow="Editing"
          title={review.name}
          description={`${review.brand} · ${review.kind} · ${review.category}`}
        />
      </Container>
      <Container className="pb-20">
        <div className="mx-auto max-w-3xl">
          <ProductForm
            initial={{
              slug: review.slug,
              kind: review.kind,
              name: review.name,
              brand: review.brand,
              category: review.category,
              verdict: review.verdict,
              ratings: review.ratings,
              hidden: review.hidden,
              retired: review.retired,
              retiredReason: review.retiredReason,
              price: review.price,
              servingsPerContainer: review.servingsPerContainer,
              dailyServings: review.dailyServings,
              skinType: review.skinType,
              goal: review.goal,
              routines: review.routines,
              photo: review.photo,
              boughtFromUrl: review.boughtFromUrl,
              indiaLinks: review.indiaLinks,
              westernLinks: review.westernLinks,
              ukLinks: review.ukLinks,
              ingredients: review.ingredients,
              pros: review.pros,
              cons: review.cons,
              repurchase: review.repurchase,
              datePublished: review.datePublished,
              summary: review.summary,
              body: review.body,
            }}
          />
        </div>
      </Container>
    </>
  );
}
