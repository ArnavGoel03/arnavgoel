export const site = {
  name: "Reviewed.",
  tagline: "Honest, long-form reviews of every skincare product and supplement I've tried.",
  description:
    "A personal, meticulously maintained log of skincare and supplement reviews — rating, verdict, pros, cons, and whether I'd repurchase.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://reviewed.example.com",
  author: "Yash Goel",
} as const;
