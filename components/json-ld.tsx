import type { Note, Review } from "@/lib/types";
import { parsePrice, currencyFor } from "@/lib/cost";
import { priceFor } from "@/lib/price";
import type { Region } from "@/lib/retailers";
import { site } from "@/lib/site";
import { socials } from "@/lib/socials";

function serialize(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Map our three-letter currency prefix into an ISO 4217 code for
 * schema.org. Non-exhaustive: extend when a new currency shows up in
 * the price column.
 */
function priceCurrencyCode(price: string | undefined): string {
  const sym = currencyFor(price);
  if (sym === "₹" || sym.toLowerCase() === "rs" || sym.toLowerCase() === "rs.")
    return "INR";
  if (sym === "£") return "GBP";
  if (sym === "€") return "EUR";
  if (sym === "¥") return "JPY";
  return "USD";
}

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    description: site.bio,
    sameAs: socials
      .filter((s) => s.href.startsWith("http"))
      .map((s) => s.href),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    author: { "@type": "Person", name: site.name, url: site.url },
    // Sitelinks searchbox: when Google decides to surface our brand
    // search-by-name in the SERP, the box hits /search?q=<term> rather
    // than dropping the user on Google's own results page.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

/**
 * ItemList JSON-LD for category listing pages (skincare, supplements,
 * oral-care, hair-care, body-care). Helps search engines understand
 * the listing-of-things relationship rather than treating the page as
 * a flat blob of text.
 */
export function ItemListJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: { kind: string; slug: string; name: string; brand: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url: url.startsWith("http") ? url : `${site.url}${url}`,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/${it.kind}/${it.slug}`,
      name: `${it.brand} ${it.name}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

/**
 * FAQ JSON-LD. Used on /about so the site's actual rules (no
 * sponsorships, one-month minimum, etc.) surface as featured-snippet
 * eligible Q&A in search results.
 */
export function FaqJsonLd({
  qa,
}: {
  qa: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

export function NoteJsonLd({ note }: { note: Note }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    description: note.description,
    datePublished: note.datePublished,
    author: { "@type": "Person", name: site.name, url: site.url },
    publisher: { "@type": "Person", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/notes/${note.slug}`,
    keywords: note.tags.join(", "),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  trail,
}: {
  trail: { name: string; href: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.href.startsWith("http") ? t.href : `${site.url}${t.href}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

export function ReviewJsonLd({ review }: { review: Review }) {
  const linksByRegion: Array<{ region: Region; links: typeof review.indiaLinks }> = [
    { region: "india", links: review.indiaLinks },
    { region: "usa", links: review.westernLinks },
    { region: "uk", links: review.ukLinks },
  ];

  const offers = linksByRegion.flatMap(({ region, links }) => {
    const regionalPrice = priceFor(review.price, region);
    return links.map((l) => {
      const offer: Record<string, unknown> = {
        "@type": "Offer",
        url: l.url,
        seller: { "@type": "Organization", name: l.retailer },
        availability: "https://schema.org/InStock",
      };
      const numeric = parsePrice(regionalPrice);
      if (numeric !== null) {
        offer.price = numeric.toFixed(2);
        offer.priceCurrency = priceCurrencyCode(regionalPrice);
      }
      return offer;
    });
  });

  const productImage = review.photo
    ? review.photo.startsWith("http")
      ? review.photo
      : `${site.url}${review.photo.startsWith("/") ? "" : "/"}${review.photo}`
    : undefined;

  const additionalProperty = (review.ingredients ?? []).map((i) => ({
    "@type": "PropertyValue",
    name: "Ingredient",
    value: i,
  }));

  const itemReviewed: Record<string, unknown> = {
    "@type": "Product",
    name: review.name,
    brand: { "@type": "Brand", name: review.brand },
    category: review.category,
    url: `${site.url}/${review.kind}/${review.slug}`,
  };
  if (productImage) itemReviewed.image = productImage;
  if (offers.length === 1) itemReviewed.offers = offers[0];
  else if (offers.length > 1) itemReviewed.offers = offers;
  if (additionalProperty.length > 0)
    itemReviewed.additionalProperty = additionalProperty;

  // Surface the verdict + 0-10 axis ratings as a schema.org Rating so
  // crawlers (Google, Bing, AEO bots) can ingest the recommendation
  // directly. We map the three-axis rubric to a single 0-5 scale by
  // averaging whichever axes are present, then fall back to the verdict
  // if no axis ratings have been filled in. "Still testing" reviews
  // omit the rating entirely so we don't claim a verdict we have not
  // committed to.
  const axes = [
    review.ratings?.effect,
    review.ratings?.value,
    review.ratings?.tolerance,
  ].filter((n): n is number => typeof n === "number");
  let ratingValue: number | null = null;
  if (axes.length > 0) {
    ratingValue = axes.reduce((s, n) => s + n, 0) / axes.length / 2;
  } else if (review.verdict === "recommend") {
    ratingValue = 4.5;
  } else if (review.verdict === "okay") {
    ratingValue = 3;
  } else if (review.verdict === "bad") {
    ratingValue = 1.5;
  }
  const reviewRating = ratingValue !== null
    ? {
        "@type": "Rating",
        ratingValue: ratingValue.toFixed(1),
        bestRating: "5",
        worstRating: "1",
      }
    : null;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed,
    author: { "@type": "Person", name: site.name, url: site.url },
    datePublished: review.datePublished,
    dateModified: review.lastUpdated ?? review.datePublished,
    name: `${review.brand} ${review.name}`,
    reviewBody: review.summary || `${review.brand} ${review.name}`,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
  if (reviewRating) data.reviewRating = reviewRating;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
