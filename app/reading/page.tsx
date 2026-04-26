import type { Metadata } from "next";
import { LibraryPage } from "@/components/library-page";
import { READING } from "@/lib/library";

export const metadata: Metadata = {
  title: "Reading",
  description:
    "What I'm currently reading, what I've finished, and what I gave up on.",
  alternates: { canonical: "/reading" },
};

export default function ReadingPage() {
  return (
    <LibraryPage
      eyebrow="On the bookshelf"
      title="Reading"
      subtitle="What's on the night-stand, what's done, what I gave up on."
      intro="Same rules as the product reviews: a one-line take only when I have something honest to say. No star ratings out of five. The reading list is shorter than the wishlist; that is the point."
      items={READING}
    />
  );
}
