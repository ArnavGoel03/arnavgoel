# yashgoel.com

A first-person review site for the skincare, supplements, and oral-care products I actually use. Slow internet. No sponsorships.

The site is editorial content (MDX files committed to git) plus a small dashboard that lets me add or edit reviews and upload photos from any browser.

---

## What's on it

| Route | What it is |
|---|---|
| `/` | Landing page — bio, "just added" reviews, sections, listening, recent notes |
| `/about` | Longer intro, "rules I write by," and a link to my professional site |
| `/now` | What I'm reading / taking / thinking about this month ([/now movement](https://nownownow.com/about)) |
| `/notes` | Long-form writing, one MDX file per note |
| `/photos` | DSLR gallery, entries in `content/photos.json`, originals on Vercel Blob |
| `/skincare` | Product reviews — one MDX file per product, country availability filter |
| `/supplements` | Same as skincare |
| `/oral-care` | Same as skincare |
| `/links` | All my socials in one place |
| `/admin` | Private dashboard for adding/editing content (not auth-protected yet — see "Auth" below) |

---

## Stack

- **Next.js 16** (App Router, RSC, Server Actions)
- **Tailwind CSS 4** + a few [base-ui/react](https://base-ui.com) primitives
- **MDX** for prose content via `next-mdx-remote`, validated by Zod (`lib/schema.ts`)
- **Vercel** for hosting (Fluid Compute), **Vercel Blob** for product/photo originals
- **GitHub REST API** for committing new content from the deployed dashboard
- **Inter** (sans) + **Instrument Serif** (serif) + **Fraunces** (display) + **JetBrains Mono** (mono)

---

## Adding a review

### From the dashboard (recommended)

1. Visit `/admin` on the live site (or `localhost:3000/admin`)
2. **Add product** tab → fill in brand, name, category, rating
3. (Optional) Drop a product photo into the upload zone — uploaded to Vercel Blob at original quality
4. (Optional) Add buy links: bought-from URL up top, plus India / USA / UK retailer URLs (one per line)
5. (Optional) Pros, cons, ingredients, summary, full markdown body
6. Save → server action commits the MDX file to GitHub via the REST API → Vercel rebuilds → live in ~30–60s

To **edit** an existing review: same dashboard, **Edit existing** tab, click the review, change fields, save.

### By hand (for bulk imports or offline edits)

Drop an `.mdx` file in the right folder:

- `content/skincare/` for skincare
- `content/supplements/` for supplements
- `content/oral-care/` for oral-care

Frontmatter schema (every field except `name`, `brand`, `category`, `rating`, `datePublished` is optional):

```mdx
---
name: Radiance Cleansing Balm
brand: Beauty of Joseon
category: cleanser
rating: 9.0
price: $20
skinType: [all, dry, normal, combination]    # skincare only
goal: [sleep, recovery]                       # supplements / oral-care
photo: /photos/some-shot.jpg                  # or a Blob URL
boughtFromUrl: "https://www.nykaa.com/..."    # where I personally bought it
indiaLinks:
  - { retailer: "Amazon India", url: "https://www.amazon.in/dp/B09ZV8N75K" }
  - { retailer: "Nykaa", url: "https://www.nykaa.com/..." }
westernLinks:
  - { retailer: "Amazon", url: "https://www.amazon.com/dp/B0B3R661JP" }
ukLinks:
  - { retailer: "Amazon UK", url: "https://www.amazon.co.uk/dp/..." }
ingredients: [Rice Bran Oil, Ginseng Extract]
pros:
  - Melts sunscreen and makeup off in seconds
  - Rinses clean
cons:
  - Jar packaging
repurchase: true
datePublished: "2026-04-23"
summary: One-sentence verdict shown on the listing card.
---

## Why I bought it

Markdown body…
```

Frontmatter is validated by Zod at request time — bad data fails the page render with a clear error.

### Notes (essays)

Drop an `.mdx` file in `content/notes/` with frontmatter `{ title, description, datePublished, tags }`. No body schema; write what you want.

### Photos

Use the dashboard's **Add photo** tab. Drop the file in, fill caption / alt / location / date — original is uploaded to Vercel Blob (no recompression) and an entry is appended to `content/photos.json`.

---

## Buy links and affiliates

Each review has up to four URL fields:

- `boughtFromUrl` — single, prominent "Bought from" button (the truthful one)
- `indiaLinks[]` — Amazon India, Nykaa, Myntra, Flipkart, Naturaltein, Earthful, etc.
- `westernLinks[]` — Amazon US, Target, Walmart, Sephora, Ulta
- `ukLinks[]` — Amazon UK, Boots, LookFantastic, Cult Beauty, Space NK, Holland & Barrett

Each link's button label is auto-derived from the URL host (`amazon.in` → "Amazon India", `nykaa.com` → "Nykaa", etc.) via `lib/retailers.ts`. Buttons get a brand-specific color theme (Amazon amber, Nykaa pink, Target red, etc.).

The `/skincare`, `/supplements`, and `/oral-care` listing pages show an **"Available in: India / USA / UK"** filter that counts and filters reviews by which regions have at least one buy link.

### Affiliate rewriting

`lib/affiliate.ts` rewrites raw URLs into affiliate URLs at render time, based on env vars:

- `AMAZON_US_TAG` → appends `?tag={tag}` to amazon.com URLs
- `AMAZON_IN_TAG` → appends `?tag={tag}` to amazon.in URLs
- `AMAZON_UK_TAG` → appends `?tag={tag}` to amazon.co.uk URLs (when added)
- `INDIA_AFFILIATE_TEMPLATE` → wraps non-Amazon Indian retailer URLs (Nykaa, Myntra, etc.) through Cuelinks/EarnKaro using `{url}` as the placeholder
- `WESTERN_AFFILIATE_TEMPLATE` → same for non-Amazon Western retailers (Sephora, Target, etc.) via Skimlinks/Impact

If an env var is unset, the rewriter passes the URL through unchanged. Affiliate links carry `rel="sponsored nofollow"` per Google guidelines and show a small "affiliate" hint next to the button label.

The footer carries a permanent FTC-style disclosure.

---

## Environment variables

| Var | Required for | What it does |
|---|---|---|
| `GITHUB_TOKEN` | Dashboard writes | Fine-grained PAT with Contents: Read & Write on this repo |
| `GITHUB_OWNER` | Dashboard writes | GitHub username (e.g. `ArnavGoel03`) |
| `GITHUB_REPO` | Dashboard writes | Repo name (e.g. `arnavgoel`) |
| `GITHUB_BRANCH` | Optional | Defaults to `main` |
| `BLOB_READ_WRITE_TOKEN` | Photo uploads | Auto-set when you attach a Vercel Blob store to the project |
| `AMAZON_US_TAG` | Affiliate revenue | Your amazon.com Associates ID (e.g. `arnav-20`) |
| `AMAZON_IN_TAG` | Affiliate revenue | Your amazon.in Associates ID (e.g. `yash04e2-21`) |
| `AMAZON_UK_TAG` | Affiliate revenue | Your amazon.co.uk Associates ID (when applied for) |
| `INDIA_AFFILIATE_TEMPLATE` | Affiliate revenue | Cuelinks/EarnKaro template, e.g. `https://linksredirect.com/?pub_id=XXX&source=linkkit&url={url}` |
| `WESTERN_AFFILIATE_TEMPLATE` | Affiliate revenue | Skimlinks/Impact template with `{url}` placeholder |
| `NEXT_PUBLIC_SITE_URL` | SEO / sitemap | Public canonical URL, e.g. `https://yashgoel.com` |

---

## Auth

`/admin` is currently **not auth-protected**. The page itself shows a yellow warning. Anyone who knows the URL can write to the repo, so keep it private.

A simple password gate is the next thing to add — single env var (`ADMIN_PASSWORD`) + signed cookie. Until then, don't share the URL.

---

## Local development

```bash
npm install
npm run dev
```

If you want the dashboard to commit live (locally), run `vercel env pull` to get the GitHub + Blob env vars locally, then restart `npm run dev`.

## Production

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to your canonical URL so sitemap, robots, and Open Graph tags resolve correctly.

---

## Project structure

```
app/
  (routes)/                 # public pages
  admin/                    # private dashboard
    actions.ts              # server actions (createReview, updateReview, createPhoto, uploadProductImage)
    page.tsx                # dashboard shell
    tabs.tsx                # 3-tab nav (Add product / Add photo / Edit existing)
    product-form.tsx        # the big form
    photo-form.tsx          # photo upload form
    product-photo-upload.tsx
    edit-list.tsx           # list of existing reviews
    edit/[kind]/[slug]/     # edit page for a specific review
  layout.tsx                # root layout, fonts, metadata
  globals.css               # Tailwind + theme tokens

components/
  category-filter.tsx       # listing-page filter (category + sort + region)
  product-card.tsx          # listing card
  review-meta.tsx           # detail-page sidebar with buy links
  spotify-embed.tsx         # responsive Spotify iframe
  ...

content/
  skincare/*.mdx            # one file per review
  supplements/*.mdx
  oral-care/*.mdx
  notes/*.mdx
  photos.json               # photo gallery metadata

lib/
  affiliate.ts              # URL → affiliate-tagged URL rewriter
  content.ts                # MDX file readers
  github.ts                 # tiny GitHub REST client
  photos.ts                 # photo loader
  retailers.ts              # host → retailer name + theme + region maps
  schema.ts                 # Zod schemas for frontmatter
  site.ts                   # site-wide identity (name, bio, etc.)
  socials.ts                # links to my socials
  types.ts                  # TypeScript interfaces
```

---

## SEO

- JSON-LD `Person`, `WebSite`, `BlogPosting`, `Review`, `Product` schema
- `sitemap.xml`, `robots.txt` (excludes `/admin`)
- Per-page canonical URLs + OpenGraph tags
- All public pages prerendered as static HTML; `/admin` is dynamic

---

## License

Code is for my own personal site. Reviews and photos are © Yash Goel. Open an issue if you'd like to discuss reuse.
