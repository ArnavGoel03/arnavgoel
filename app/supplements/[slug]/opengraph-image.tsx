import { notFound } from "next/navigation";
import { getReview } from "@/lib/content";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  reviewOgImage,
} from "@/lib/og-review";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Supplement review";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = getReview("supplements", slug);
  if (!review) notFound();
  return reviewOgImage(review);
}
