import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
        About
      </p>
      <h1 className="font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        Hi, I&apos;m {site.shortName}.
      </h1>
      <div className="prose prose-stone mt-10 max-w-none prose-headings:font-serif prose-headings:font-normal prose-p:leading-relaxed prose-a:text-stone-900 prose-a:underline-offset-4">
        <p>
          I live in {site.location}. This is the corner of the internet where
          I write about the products I actually use — skincare, supplements,
          oral care — and the photos and rough notes I make in between. Slower
          than a feed. More honest than a sponsored review.
        </p>

        <h2>The rules I write by</h2>
        <ul>
          <li>I have to use the product for at least a month before I rate it.</li>
          <li>If a brand sends me something, it doesn&apos;t go on the site.</li>
          <li>If I stop using a product, the review says so — and why.</li>
          <li>Buy links go to where I actually bought it, plus regional alternatives.</li>
        </ul>

        <h2>Why this exists</h2>
        <p>
          Most product writing online is either paid placement pretending not
          to be, or one-week first impressions. I wanted a place where someone
          who actually used a thing for half a year would tell you honestly
          whether it was worth the money. So I made one.
        </p>

        <h2>Sections</h2>
        <p>
          <a href="/skincare">Skincare</a>, <a href="/supplements">supplements</a>,{" "}
          <a href="/oral-care">oral care</a> — the reviews. <a href="/photos">Photos</a>{" "}
          for the ones I shot on a DSLR. <a href="/notes">Notes</a> for the
          slower writing. <a href="/now">Now</a> for what&apos;s on the
          shelf this month. <a href="/links">Links</a> if you want to find me
          elsewhere.
        </p>

        <h2>My day job</h2>
        <p>
          I write software when I&apos;m not writing about ceramide
          concentrations.{" "}
          <a
            href={site.professionalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 no-underline hover:underline"
          >
            {site.professionalName}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>{" "}
          is where that side lives.
        </p>

        <h2>Get in touch</h2>
        <p>
          Email or any of the socials on the <a href="/links">links page</a>.
          I read everything; I reply to most things.
        </p>
      </div>
    </Container>
  );
}
