import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SocialLink } from "@/components/social-link";
import { site } from "@/lib/site";
import { socials } from "@/lib/socials";

export const metadata: Metadata = {
  title: "Links",
  description: `Where to find ${site.name} around the internet.`,
  alternates: { canonical: "/links" },
};

export default function LinksPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
        Links
      </p>
      <h1 className="font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        Find me elsewhere.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-stone-600">
        Every corner of the internet I actually use. Email is the most
        reliable way to reach me.
      </p>

      <div className="mt-10 grid gap-3">
        {socials.map((s) => (
          <SocialLink key={s.label} social={s} />
        ))}
      </div>
    </Container>
  );
}
