import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
  alternates: { canonical: "/about" },
};

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <h2 className="mt-14 mb-5 flex items-baseline gap-3 border-b border-stone-200 pb-2 font-serif text-2xl text-stone-900 sm:text-3xl">
      <span className="font-display text-base font-light tabular-nums text-stone-300">
        {num}
      </span>
      <span className="italic">{label}</span>
    </h2>
  );
}

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>The author —</span>
        </span>
        <span className="font-mono text-stone-400">{site.location}</span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-8xl">
        Hi, I&apos;m {site.shortName}<span className="text-rose-400">.</span>
      </h1>

      <div className="mt-10 max-w-2xl text-lg leading-relaxed text-stone-700">
        <p>
          <span className="float-left mr-3 mt-1 font-display text-7xl font-light leading-[0.8] text-stone-900 sm:text-8xl">
            I
          </span>
          live in {site.location}. This is the corner of the internet where I
          write about the products I actually use — skincare, supplements, oral
          care — and the photos and rough notes I make in between. Slower than a
          feed. More honest than a sponsored review.
        </p>

        <SectionLabel num="01" label="The rules I write by" />
        <ul className="space-y-3 text-stone-700">
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>I have to use the product for at least a month before I rate it.</span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>If a brand sends me something, it doesn&apos;t go on the site.</span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>If I stop using a product, the review says so — and why.</span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              Buy links go to where I actually bought it, plus regional
              alternatives.
            </span>
          </li>
        </ul>

        <SectionLabel num="02" label="Why this exists" />
        <p>
          Most product writing online is either paid placement pretending not
          to be, or one-week first impressions. I wanted a place where someone
          who actually used a thing for half a year would tell you honestly
          whether it was worth the money. So I made one.
        </p>

        <SectionLabel num="03" label="Off the clock" />
        <p>
          Most weekends involve water in some form — kayaking, wakesurfing,
          snorkelling, and, when time and depth permit, underwater basket
          weaving.
        </p>

        <SectionLabel num="04" label="Sections" />
        <p>
          <a href="/skincare" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400">Skincare</a>,{" "}
          <a href="/supplements" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400">supplements</a>,{" "}
          <a href="/oral-care" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400">oral care</a> — the reviews.{" "}
          <a href="/photos" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400">Photos</a> for the ones I shot on a DSLR.{" "}
          <a href="/notes" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400">Notes</a> for the slower writing.{" "}
          <a href="/now" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400">Now</a> for what&apos;s on the shelf this month.{" "}
          <a href="/links" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400">Links</a> if you want to find me elsewhere.
        </p>

        <SectionLabel num="05" label="My day job" />
        <p>
          I write software when I&apos;m not writing about ceramide
          concentrations.{" "}
          <a
            href={site.professionalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-1 font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400"
          >
            {site.professionalName}
            <ArrowUpRight className="h-3.5 w-3.5 self-center" />
          </a>{" "}
          is where that side lives.
        </p>

        <SectionLabel num="06" label="Get in touch" />
        <p>
          Email or any of the socials on the{" "}
          <a href="/links" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400">
            links page
          </a>
          . I read everything; I reply to most things.
        </p>
      </div>

      <div className="mt-20 border-t border-stone-200 pt-8 text-center">
        <p className="font-serif text-3xl italic text-stone-700">— {site.shortName}</p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-stone-400">
          ❋ {site.location}
        </p>
      </div>
    </Container>
  );
}
