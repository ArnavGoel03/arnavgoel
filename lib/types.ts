export type Kind = "skincare" | "supplements" | "oral-care";

export interface Review {
  kind: Kind;
  slug: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  price?: string;
  skinType?: string[];
  goal?: string[];
  photo?: string;
  boughtFromUrl?: string;
  buyIndiaUrl?: string;
  buyWesternUrl?: string;
  ingredients?: string[];
  pros: string[];
  cons: string[];
  repurchase: boolean;
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
