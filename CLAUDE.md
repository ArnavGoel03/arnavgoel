@AGENTS.md

# About this site

A first-person review site (yashgoel.com → currently deployed at skincare-supplement-reviews.vercel.app). Magazine-editorial aesthetic. Three review categories, skincare, supplements, oral care, plus notes, photos, a /now page, and a private /admin dashboard for adding content. The user (Yash on this site, Arnav at arnavgoel.dev) writes every review after using a product for at least a month.

The signature mark across the site is a small rose ❋ glyph; it appears in the header, every page masthead, hover states, and the footer. The accent color is rose only, everything else is stone-neutral. Don't introduce new accent colors.

# Voice when writing reviews

- First-person, present-tense for current habits, past for one-offs.
- No marketing language. No "game-changing," "must-have," "transformative." If a product is good, say *what specifically* it does and at *what dose / duration*.
- Always concrete: "Two pumps before bed for six weeks" beats "I love this."
- Always honest: cons must be real, not throwaway. If `repurchase: true` but you mention three serious cons, the review reads dishonest.
- The rules in `/about` are real. A review that sounds like a paid placement breaks the site's whole premise.
- Do not invent the user's experience. When the user says "add this product, I use it" without supplying details, write a plausible review and explicitly disclose in your reply that the specifics (dosing schedule, weeks-to-effect, repurchase decision) are inferred and need their confirmation.

# Regional retailer handling

The site has buy links for three regions: India, USA, UK (`indiaLinks`, `westernLinks`, `ukLinks` in frontmatter, yes, the field is named `westernLinks` for legacy reasons; it means USA).

Some brands are **direct-to-consumer in one region only.** When a brand has no Amazon (or other retailer) presence in another region, mark this clearly:

- **India-only DTC brands** I've used: Naturaltein (`naturaltein.in`), Earthful (`earthful.me`), DistaUSA (`distausa.com`, actually Indian despite the name).
- **US-only brands**: Nutricost (Amazon US only, not on .in or .co.uk for most SKUs), Magtein L-Threonate (US only).
- **UK retailers worth checking**: Boots, LookFantastic, Cult Beauty, Space NK, Holland & Barrett. Often have brands that aren't on amazon.co.uk.

If you're adding a review for an India-only or USA-only brand, do not invent retailer URLs in other regions. Leave the array empty. The site auto-derives an `availabilityLabel()` from buy links and surfaces "Sold in India only" / "USA only" on the listing card *and* a yellow callout on the detail page so readers know up front.

The `lib/retailers.ts` file owns the host → retailer name + region map and the per-brand button color theme. Add new retailers there before you add their URLs to MDX.

# Adding a review (precedence order)

1. **Best**: user invokes the dashboard at `/admin` or `/admin/edit/{kind}/{slug}` and the form runs the `createReview` / `updateReview` server action which commits to GitHub.
2. **Acceptable**: write the MDX file directly to `content/{kind}/{slug}.mdx` matching the schema in `lib/schema.ts`. The schema is strict, bad data fails build.
3. Slug is derived from `slugify(brand + " " + name)`. The slug becomes the URL and the file path; treat it as immutable once published.

The only required frontmatter fields: `name`, `brand`, `category`, `rating`, `datePublished`. Everything else is optional. Don't pad with placeholders if you don't have real data.

# Affiliate setup (current state)

- `AMAZON_IN_TAG=yash04e2-21` (signup pending Amazon's approval, this is the tag the user picked)
- `AMAZON_US_TAG`, `AMAZON_UK_TAG`: not yet applied for
- `INDIA_AFFILIATE_TEMPLATE`, `WESTERN_AFFILIATE_TEMPLATE`: aggregator templates (Cuelinks/EarnKaro etc.), not yet configured

The `lib/affiliate.ts` rewriter is already wired. Once env vars are set in Vercel, every Amazon link on the site auto-tags. Do **not** put affiliate tags in MDX directly.

# `/admin` is unprotected

There's a yellow warning banner on the page. The URL is private (excluded from sitemap and robots). Adding password auth was explicitly deferred by the user. Don't sneak it in unprompted; if asked, the design is `ADMIN_PASSWORD` env var + signed cookie middleware.

# Build / deploy notes

- Push to `main` triggers a Vercel rebuild (~30-60s).
- Local dev: `npm run dev`. The dashboard's GitHub commit flow needs `vercel env pull` to get `GITHUB_TOKEN` etc. into the local environment.
- Don't write build/deploy meta on user-visible surfaces (the user explicitly removed all "Built quietly, shipped slowly"-style language). Internal commit messages can mention build/CI freely.

# Memory conventions for this project

The user keeps a memory file at `~/.claude/projects/-Users-arnavgoel-Documents-skincare-supplement-reviews/memory/`. Notable entries:
- `amazon-associates-ids.md`, tracking IDs per marketplace
- `MEMORY.md`, index of memory files
