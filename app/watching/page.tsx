import type { Metadata } from "next";
import { LibraryPage } from "@/components/library-page";
import { WATCHING } from "@/lib/library";

export const metadata: Metadata = {
  title: "Watching",
  description:
    "Films and series, currently watching, finished, and abandoned. With a one-line honest take.",
  alternates: { canonical: "/watching" },
};

export default function WatchingPage() {
  return (
    <LibraryPage
      eyebrow="On the screen"
      title="Watching"
      subtitle="Films and series in rotation, recently closed out, or shelved."
      intro="Editorial cinema first, prestige TV second, occasional rewatch when nothing new is calling. The list is short on purpose; reading lists already pile up faster than I get through them."
      items={WATCHING}
    />
  );
}
