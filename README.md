# arnavgoel

My personal website — home, about, now, notes, photos, and honest product reviews. Built with Next.js 16, Tailwind 4, shadcn/ui, and MDX.

## Sections

- **`/`** — landing page with bio and socials
- **`/about`** — longer introduction
- **`/now`** — what I'm working on / reading / thinking about right now ([/now page movement](https://nownownow.com/about))
- **`/notes`** — short writing, one MDX file per note
- **`/photos`** — DSLR gallery, entries in `lib/photos.ts`
- **`/skincare`** and **`/supplements`** — product reviews, one MDX file per product
- **`/links`** — all my socials in one place

## Edit your content

- **Site-wide info** (name, bio, location, domain): `lib/site.ts`
- **Socials** (GitHub, Twitter, etc): `lib/socials.ts`
- **Photos**: `lib/photos.ts` — add entries; drop the actual `.jpg`/`.png` files in `public/photos/`
- **Notes**: drop an `.mdx` file in `content/notes/`
- **Skincare reviews**: drop an `.mdx` file in `content/skincare/`
- **Supplement reviews**: drop an `.mdx` file in `content/supplements/`

All MDX frontmatter is validated at build time by Zod schemas in `lib/schema.ts` — bad data fails fast.

## Note frontmatter

```mdx
---
title: Title of the note
description: One-sentence summary for meta/SEO.
datePublished: "2026-04-23"
tags: [tag1, tag2]
---

Markdown body.
```

## Review frontmatter

```mdx
---
name: Product name
brand: Brand
category: cleanser
rating: 8.5
price: $25
skinType: [oily, combination]   # skincare only
goal: [sleep, focus]            # supplements only
ingredients: [Ingredient 1]
pros: [What worked]
cons: [What didn't]
repurchase: true
datePublished: "2026-04-23"
summary: One-sentence verdict.
---

Verdict body in markdown.
```

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

## SEO / AEO

- JSON-LD `Person`, `WebSite`, `BlogPosting`, `Review`, `Product` schema
- `sitemap.xml`, `robots.txt`
- Per-page canonical URLs + OpenGraph tags
- Fully prerendered static HTML
