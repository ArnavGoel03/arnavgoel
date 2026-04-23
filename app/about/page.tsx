import type { Metadata } from "next";
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
          I live in {site.location}. I study, I build, I write a little, and I
          read a lot. This is the corner of the internet I keep for myself —
          slower than social feeds, and more honest than a résumé.
        </p>

        <h2>What I&apos;m interested in</h2>
        <p>
          Software, design, health, books, and the strange friction that
          happens when any of those bump into each other. I lean toward
          making things rather than talking about making things.
        </p>

        <h2>What this site is</h2>
        <p>
          Four things: a <a href="/">home</a> to land on, an{" "}
          <a href="/about">about</a> page (you&apos;re reading it), a{" "}
          <a href="/now">now</a> page that tells you what I&apos;m actually
          doing this month, and a <a href="/notes">notes</a> section where I
          post rough writing.
        </p>

        <h2>Get in touch</h2>
        <p>
          Best way to reach me is by <a href="/links">email or any of the
          socials on the links page</a>. I read everything, and I reply to
          most things.
        </p>
      </div>
    </Container>
  );
}
