import type { Note, Review } from "@/lib/types";
import { parsePrice, currencyFor } from "@/lib/cost";
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
  const allLinks = [
    ...review.indiaLinks,
    ...review.westernLinks,
    ...review.ukLinks,
  ];

  const offers = allLinks.map((l) => {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      url: l.url,
      seller: { "@type": "Organization", name: l.retailer },
      availability: "https://schema.org/InStock",
    };
    const numeric = parsePrice(review.price);
    if (numeric !== null) {
      offer.price = numeric.toFixed(2);
      offer.priceCurrency = priceCurrencyCode(review.price);
    }
    return offer;
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

  const data = {
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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
