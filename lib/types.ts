export type Kind = "skincare" | "supplements" | "oral-care";

export interface BuyLink {
  retailer: string;
  url: string;
}

export interface Review {
  kind: Kind;
  slug: string;
  name: string;
  brand: string;
  category: string;
  rating?: number;
  ratings?: {
    effect?: number;
    value?: number;
    tolerance?: number;
  };
  hidden?: boolean;
  price?: string;
  skinType?: string[];
  goal?: string[];
  photo?: string;
  boughtFromUrl?: string;
  indiaLinks: BuyLink[];
  westernLinks: BuyLink[];
  ukLinks: BuyLink[];
  ingredients?: string[];
  pros: string[];
  cons: string[];
  repurchase?: boolean;
  datePublished: string;
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
export type PrimerDomain = "supplement" | "skincare";

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
