# Skincare & Supplement Reviews

A personal, meticulously maintained log of every skincare product and supplement I've tried, built with Next.js 16, Tailwind 4, shadcn/ui, and MDX.

## Features

- **Editorial design** — serif display type, generous whitespace, neutral palette
- **MDX-based content** — one file per review, typed frontmatter via Zod
- **Filter + sort** — by category and by rating
- **SEO / AEO** — JSON-LD `Review` + `Product` + `WebSite` schema, sitemap, robots, per-page metadata, canonical URLs, OG tags, semantic HTML
- **Zero JS on catalog cards** — pure server-rendered + static
- **Accessible** — proper headings, rating has `aria-label`, sufficient contrast

## Add a review

Drop an `.mdx` file into `content/skincare/` or `content/supplements/`:

```mdx
---
name: Product Name
brand: Brand
category: cleanser
rating: 8.5
price: $25
skinType: [oily, combination]     # skincare only
goal: [sleep, focus]              # supplements only
ingredients: [Niacinamide, Zinc]
pros:
  - What worked
cons:
  - What didn't
repurchase: true
datePublished: "2026-04-23"
summary: One-sentence verdict for cards and SEO meta.
---

Markdown body — verdict, context, routine, results.
```

The file name becomes the URL slug. Frontmatter is validated at build time — bad data fails fast.

## Develop

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to your canonical URL so sitemap, robots, and OG tags resolve correctly.

## Structure

```
app/                  routes, metadata, sitemap, robots
components/           small single-purpose components (~50–150 lines)
content/skincare/     skincare review MDX
content/supplements/  supplement review MDX
lib/content.ts        MDX loading
lib/schema.ts         Zod frontmatter schema
lib/site.ts           site-wide config
```
