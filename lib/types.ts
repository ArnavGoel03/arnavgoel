export type Kind =
  | "skincare"
  | "supplements"
  | "oral-care"
  | "hair-care"
  | "body-care";

export interface BuyLink {
  retailer: string;
  url: string;
}

/**
 * Per-region price object. Each field holds the locally-priced string
 * with its native currency symbol intact, e.g. `{ in: "₹2,400", us:
 * "$34", uk: "£28" }`. Honest about which markets we have data for:
 * missing entries simply don't render.
 */
export interface RegionalPrice {
  in?: string;
  us?: string;
  uk?: string;
}

export interface Review {
  kind: Kind;
  slug: string;
  name: string;
  brand: string;
  category: string;
  verdict?: "recommend" | "okay" | "bad";
  ratings?: {
    effect?: number;
    value?: number;
    tolerance?: number;
  };
  hidden?: boolean;
  retired?: boolean;
  retiredReason?: string;
  price?: string | RegionalPrice;
  servingsPerContainer?: number;
  dailyServings?: number;
  skinType?: string[];
  goal?: string[];
  routines: ("morning" | "evening" | "stack" | "shower")[];
  photo?: string;
  photoTimeline: { date: string; src: string; note?: string }[];
  boughtFromUrl?: string;
  indiaLinks: BuyLink[];
  westernLinks: BuyLink[];
  ukLinks: BuyLink[];
  ingredients?: string[];
  pros: string[];
  cons: string[];
  repurchase?: boolean;
  datePublished: string;
  lastUpdated?: string;
  changelog: { date: string; note: string }[];
  summary: string;
  body: string;
}

export interface ReviewSummary extends Omit<Review, "body"> {}

export interface Note {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  tags: string[];
  body: string;
}

export interface NoteSummary extends Omit<Note, "body"> {}

export interface Photo {
  src: string;
  alt: string;
  caption: string;
  location?: string;
  date: string;
  width: number;
  height: number;
}

export type PrimerKind = "stack" | "ingredient";
export type PrimerDomain = "supplement" | "skincare" | "oral" | "meta";

export interface Primer {
  slug: string;
  title: string;
  subtitle?: string;
  kind: PrimerKind;
  domain: PrimerDomain;
  tags: string[];
  stack: string[];
  relatedProductSlugs: string[];
  datePublished: string;
  lastUpdated?: string;
  body: string;
}

export interface PrimerSummary extends Omit<Primer, "body"> {}
