import type { Metadata } from "next";
import { Container } from "@/components/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — how I rate products, why there are no affiliate links, and my methodology.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
        About
      </p>
      <h1 className="font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        Why this exists.
      </h1>
      <div className="prose prose-stone mt-10 max-w-none prose-headings:font-serif prose-headings:font-normal prose-p:leading-relaxed">
        <p>
          Every review on this site is something I actually used — typically
          for weeks or months — before forming an opinion. There are no
          affiliate links, no sponsorships, and no free samples. If I paid for
          it, I&apos;ll say so. If something was a gift, I&apos;ll say that too.
        </p>

        <h2>How I rate</h2>
        <p>
          Ratings are on a 0–10 scale. I try to anchor them to what a product
          promises versus what it delivered, not to the product&apos;s price.
          An $8 cleanser that does its job well can score higher than a $90
          serum that doesn&apos;t.
        </p>
        <ul>
          <li><strong>9–10</strong> — would repurchase, recommend, and keep in rotation indefinitely.</li>
          <li><strong>7–8</strong> — works well; minor gripes.</li>
          <li><strong>5–6</strong> — fine, but I wouldn&apos;t go out of my way to buy again.</li>
          <li><strong>Below 5</strong> — not worth the money, or actively unpleasant.</li>
        </ul>

        <h2>What gets reviewed</h2>
        <p>
          Every product I use long enough to have a real opinion on. I avoid
          reviewing anything I&apos;ve used for less than two weeks, because
          skincare especially tends to reveal itself slowly.
        </p>

        <h2>Contact</h2>
        <p>
          Have a product you think I should try? Disagree with a review? Email
          me. I read everything.
        </p>
      </div>
    </Container>
  );
}
