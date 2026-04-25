import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { FaqJsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";

// FAQ list, mirrored to JSON-LD so the answers are eligible for
// featured snippets and AI-search citations. Keep questions phrased
// the way readers actually search ("how often / why / who / does this
// take sponsorships"), not the way the about page narrates them.
const faqs: { question: string; answer: string }[] = [
  {
    question: `Does ${site.name} take sponsorships or PR samples?`,
    answer: `No. Every product on this site was paid for by the author. If a brand sends a sample, the product does not get reviewed. There are no sponsored posts, paid placements, or PR boxes covered here.`,
  },
  {
    question: "How long does a product have to be used before it gets reviewed?",
    answer: "At least one month. The site exists because most product writing online is either paid placement pretending not to be, or one-week first impressions. A review here only earns its verdict after the product has lived in the routine for a full month or longer.",
  },
  {
    question: `What categories does ${site.name} cover?`,
    answer: "Five active categories: skincare, supplements, oral care, hair care, and body care, plus a /now page for what is currently on the shelf and /photos for DSLR shots from in between.",
  },
  {
    question: "How does the rating system work?",
    answer: 'Each review carries a verdict word ("recommend", "okay", or "bad") and three rating axes: effect (does it do what it claims), value (price-per-result), and tolerance (how the skin or body handled it). The site deliberately avoids combined headline numbers because a single rating compresses too much.',
  },
  {
    question: "Where can I buy the products that get recommended?",
    answer: "Every review carries regional buy links for India, USA, and UK where available. The boughtFromUrl field on each listing reflects where the author actually purchased the product. If a brand only sells in one region, the product card surfaces an honest 'India only' or 'USA only' label.",
  },
  {
    question: "What happens when the author stops using a product?",
    answer: "The review marks the product as retired and explains why. Retired listings stay accessible at /retired so the audit trail is preserved; they do not disappear from the site.",
  },
];

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}.`,
  alternates: { canonical: "/about" },
};

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <h2 className="mt-14 mb-5 flex items-baseline gap-3 border-b border-stone-200 pb-2 font-serif text-2xl text-stone-900 dark:border-stone-800 dark:text-stone-100 sm:text-3xl">
      <span className="font-display text-base font-light tabular-nums text-stone-300 dark:text-stone-700">
        {num}
      </span>
      <span className="italic">{label}</span>
    </h2>
  );
}

const linkClass =
  "font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-rose-400 dark:text-stone-100 dark:decoration-stone-700 dark:hover:decoration-rose-400";

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <FaqJsonLd qa={faqs} />
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>The author -</span>
        </span>
        <span className="font-mono text-stone-400 dark:text-stone-500">
          {site.location}
        </span>
      </div>

      <h1 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.04em] text-stone-900 dark:text-stone-100 sm:text-8xl">
        Hi, I&apos;m {site.shortName}<span className="text-rose-400">.</span>
      </h1>

      <div className="prose-with-drop-cap mt-10 max-w-2xl text-lg leading-relaxed text-stone-700 dark:text-stone-300">
        <p>
          I live in {site.location}. This is the corner of the internet where I
          write about the products I actually use, skincare, supplements, oral
          care, and the photos and rough notes I make in between. Slower than a
          feed. More honest than a sponsored review.
        </p>

        <SectionLabel num="01" label="The rules I write by" />
        <ul className="space-y-3">
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
            <span>If I stop using a product, the review says so, and why.</span>
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

        <SectionLabel num="03" label="On the rating number" />
        <p>
          Every review here carries a number out of ten. I put it there
          because readers expect one and because it makes sorting and
          filtering possible. But a single rating is a lie by compression.
          It can&apos;t capture:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              <strong className="font-serif text-stone-900 dark:text-stone-100">Context.</strong>{" "}
              A 7.5 for oily skin might be a 9 for dry skin, and the opposite.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              <strong className="font-serif text-stone-900 dark:text-stone-100">Price.</strong>{" "}
              A $15 product at 7 is a different product than a $200 product
              at 7.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              <strong className="font-serif text-stone-900 dark:text-stone-100">Routine fit.</strong>{" "}
              A product is only as good as the things around it in a routine.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              <strong className="font-serif text-stone-900 dark:text-stone-100">Life stage.</strong>{" "}
              What works on 24-year-old skin may not work on 44-year-old skin.
            </span>
          </li>
        </ul>
        <p className="mt-5 font-serif italic">
          The number is a shortcut; the prose is where the real opinion lives.
          If you&apos;re deciding whether to buy something, read the body
          before the score.
        </p>

        <SectionLabel num="04" label="Off the clock, in the water" />
        <p>
          If I am not at a desk, I am almost always near, in, or under water.
          Most weekends involve some combination of:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              <strong className="font-serif text-stone-900 dark:text-stone-100">Snorkelling.</strong>{" "}
              The closest thing to weightlessness I have found on this side of
              actual scuba. Reef trips are the only travel I plan months in
              advance.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              <strong className="font-serif text-stone-900 dark:text-stone-100">Swimming.</strong>{" "}
              The daily reset. Pool laps or open water, both work. The only
              cardio I have ever stuck with for years rather than weeks.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              <strong className="font-serif text-stone-900 dark:text-stone-100">Wake surfing.</strong>{" "}
              The favourite. The wake behind a properly weighted boat is a
              wave that never closes out. You can ride one for as long as your
              legs hold up.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-1.5 text-rose-400">❋</span>
            <span>
              <strong className="font-serif text-stone-900 dark:text-stone-100">Wakeboarding.</strong>{" "}
              When the wake surf line gets crowded. A different muscle group
              and a different kind of bruised, but the same lake morning.
            </span>
          </li>
        </ul>
        <p className="mt-5 font-serif italic">
          A surprising amount of the SPF and body-care reviews on this site
          exist because of how often skin meets sun, salt, or chlorine.
        </p>

        <SectionLabel num="05" label="A taste warning" />
        <p>
          I run on dark humour. The kind that lands flat in mixed company and
          makes my friends snort the wrong way at brunch. If a review here
          ever cracks at its own expense, that is the lens, not a slip. The
          rules above (no sponsorships, one month minimum, real cons) are not
          self-deprecation; they are the only thing I take entirely
          straight-faced.
        </p>

        <SectionLabel num="06" label="Sections" />
        <p>
          <a href="/skincare" className={linkClass}>Skincare</a>,{" "}
          <a href="/supplements" className={linkClass}>supplements</a>,{" "}
          <a href="/oral-care" className={linkClass}>oral care</a>,{" "}
          <a href="/hair-care" className={linkClass}>hair care</a>,{" "}
          <a href="/body-care" className={linkClass}>body care</a>, the reviews.{" "}
          <a href="/photos" className={linkClass}>Photos</a> for the ones I shot on a DSLR.{" "}
          <a href="/notes" className={linkClass}>Notes</a> for the slower writing.{" "}
          <a href="/now" className={linkClass}>Now</a> for what&apos;s on the shelf this month.{" "}
          <a href="/links" className={linkClass}>Links</a> if you want to find me elsewhere.
        </p>

        <SectionLabel num="07" label="Frequently asked" />
        {/* Visible FAQ list, mirroring the JSON-LD above so search engines
            and AI crawlers see the same content the reader sees. */}
        <dl className="mt-4 space-y-6">
          {faqs.map((item) => (
            <div key={item.question}>
              <dt className="font-serif text-lg italic text-stone-900 dark:text-stone-100">
                {item.question}
              </dt>
              <dd className="mt-2 leading-relaxed text-stone-700 dark:text-stone-300">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>

        <SectionLabel num="08" label="My day job" />
        <p>
          I write software when I&apos;m not writing about ceramide
          concentrations.{" "}
          <a
            href={site.professionalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-baseline gap-1 ${linkClass}`}
          >
            {site.professionalName}
            <ArrowUpRight className="h-3.5 w-3.5 self-center" />
          </a>{" "}
          is where that side lives.
        </p>

        <SectionLabel num="09" label="Get in touch" />
        <p>
          Email or any of the socials on the{" "}
          <a href="/links" className={linkClass}>
            links page
          </a>
          . I read everything; I reply to most things.
        </p>
      </div>

      <div className="mt-20 border-t border-stone-200 pt-8 text-center dark:border-stone-800">
        <p className="font-serif text-3xl italic text-stone-700 dark:text-stone-300">
          - {site.shortName}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
          ❋ {site.location}
        </p>
      </div>
    </Container>
  );
}
