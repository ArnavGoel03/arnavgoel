export const site = {
  name: "Yash Goel",
  shortName: "Yash",
  tagline: "Builder, student, occasional writer.",
  bio: "Hi — I'm Yash. I build things, read widely, and try to leave each place a little better than I found it.",
  description:
    "The personal site of Yash Goel — what I'm working on, what I'm reading, and where to find me elsewhere on the internet.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yashgoel.com",
  location: "San Diego, CA",
} as const;
