export type Kind = "skincare" | "supplements";

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
  ingredients?: string[];
  pros: string[];
  cons: string[];
  repurchase: boolean;
  datePublished: string;
  summary: string;
  body: string;
}

export interface ReviewSummary extends Omit<Review, "body"> {}
