import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
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
    <Container className="max-w-3xl py-12 sm:py-16">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>Off-site</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">{socials.length} channels</span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 sm:text-8xl dark:text-stone-100">
        Elsewhere<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-stone-600 sm:text-2xl dark:text-stone-300">
        Every corner of the internet I actually use. Email is the most reliable;
        the rest catches me when it catches me.
      </p>

      <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200 dark:border-stone-800 dark:divide-stone-800">
        {socials.map((s, i) => (
          <SocialLink key={s.label} social={s} index={i + 1} />
        ))}
      </div>

      <div className="mt-16 border-t border-stone-200 pt-8 dark:border-stone-800">
        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          For my professional / dev work,{" "}
          <a
            href={site.professionalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-1 font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400 dark:text-stone-100"
          >
            {site.professionalName}
            <ArrowUpRight className="h-3.5 w-3.5 self-center" />
          </a>{" "}
          is the right address.
        </p>
      </div>
    </Container>
  );
}
