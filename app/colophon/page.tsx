import type { Metadata } from "next";
import { Container } from "@/components/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Colophon",
  description: `How ${site.name} is built, every choice and the reason for it.`,
  alternates: { canonical: "/colophon" },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-stone-100 py-6 first:border-t sm:grid-cols-[10rem_1fr] dark:border-stone-800/60">
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
        {label}
      </dt>
      <dd className="text-stone-700 dark:text-stone-300">{children}</dd>
    </div>
  );
}

const linkClass =
  "font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400 dark:text-stone-100 dark:decoration-stone-700 dark:hover:decoration-rose-400";

export default function ColophonPage() {
  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>How this site is made</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">
          v1
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        Colophon<span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        The meta-page. Every typeface, framework, host, and editorial choice,
        plus the reason behind each.
      </p>

      <dl className="mt-12">
        <Row label="Display type">
          <a href="https://fonts.google.com/specimen/Fraunces" className={linkClass} target="_blank" rel="noreferrer">
            Fraunces
          </a>{" "}
          by Undercase Type. A variable serif with an{" "}
          <code>opsz</code> axis I lean into for the masthead. Free, the
          editorial-magazine vibe baseline.
        </Row>
        <Row label="Body type">
          The same Fraunces at a tighter optical size for prose, paired with{" "}
          <a href="https://rsms.me/inter/" className={linkClass} target="_blank" rel="noreferrer">Inter</a>{" "}
          for UI chrome (filter chips, kbd hints, anything that needs to be
          legible at 11px).
        </Row>
        <Row label="Accent">
          One colour family: Tailwind&apos;s rose-400 for the ❋ glyph,
          underlines, and focus rings. Everything else is stone-neutral.
          Deliberately monochromatic so the rose mark always reads as a
          signature, never a primary.
        </Row>
        <Row label="Framework">
          <a href="https://nextjs.org/" className={linkClass} target="_blank" rel="noreferrer">Next.js 16</a> with the App Router and Turbopack. View
          transitions enabled (experimental). React 19 server components for
          most surfaces; client components only where state actually needs
          to live in the browser.
        </Row>
        <Row label="Content">
          MDX files in the repo, parsed with gray-matter and validated by
          Zod schemas in <code>lib/schema.ts</code>. No CMS. Bad data fails
          the build, which keeps the schema honest.
        </Row>
        <Row label="Hosting">
          <a href="https://vercel.com" className={linkClass} target="_blank" rel="noreferrer">Vercel</a>. Static at the edge wherever possible; image
          and OG-card generation lives in Vercel Functions. Photos sit in
          Vercel Blob.
        </Row>
        <Row label="Search">
          Client-side fuzzy search over the full content set. No external
          search service. ⌘K opens the command palette anywhere on the site.
        </Row>
        <Row label="Editorial rules">
          One month minimum on a product before it gets a verdict. No
          sponsorships. No PR samples. If the author stops using something,
          the listing says so and lives at <a href="/retired" className={linkClass}>/retired</a>{" "}
          rather than disappearing. Verdict words (recommend, okay, bad,
          still testing) are the user-facing summary; the prose carries the
          actual opinion.
        </Row>
        <Row label="The rose ❋ glyph">
          Chosen as a single graphic mark that scales from 11px chip to a
          full PWA icon without ever needing colour. Functions like a
          newspaper&apos;s asterism: a quiet section break that signals
          editorial restart.
        </Row>
        <Row label="Open source">
          The site source lives at{" "}
          <a href="https://github.com/ArnavGoel03/arnavgoel" className={linkClass} target="_blank" rel="noreferrer">
            github.com/ArnavGoel03/arnavgoel
          </a>
          . Reviews and photos belong to me; the framework code is MIT.
        </Row>
        <Row label="Author">
          Yash Goel on this site, Arnav Goel professionally. Software
          engineer by day. Email and the rest of the socials live on the{" "}
          <a href="/links" className={linkClass}>links page</a>.
        </Row>
      </dl>
    </Container>
  );
}
