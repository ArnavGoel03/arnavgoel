@AGENTS.md

# About this site

A first-person review site (yashgoel.com → currently deployed at skincare-supplement-reviews.vercel.app). Magazine-editorial aesthetic. Seven product categories — skincare, supplements, oral care, hair care (split into Treatment and Styling chapters), body care, essentials (cornerstone daily devices like the laptop, earbuds, primary charger), and miscellaneous (random utility objects, accessories, gadgets) — plus /routine (with subroutine variants like /routine/morning/post-workout), /primers, /notes, /photos, a /now page, /subscribe for the email list, and a private /admin dashboard for adding content. The user (Yash on this site, Arnav at arnavgoel.dev) writes every review after using a product for at least a month.

The signature mark across the site is a small rose ❋ glyph; it appears in the header, every page masthead, hover states, and the footer. The accent color is rose only, everything else is stone-neutral. Don't introduce new accent colors.

# Working style

Don't ask for permission. When the user gives a directive, execute it
end-to-end and push. No "want me to start?", no confirmation rounds, no
"should I keep going?" trailers. The only acceptable interrupts are
genuine ambiguities the user could not have predicted, or destructive
operations covered by the "Ask before destructive Vercel/infra ops"
rule. Otherwise: ship, then report what shipped.

# Voice when writing reviews

- First-person, present-tense for current habits, past for one-offs.
- No marketing language. No "game-changing," "must-have," "transformative." If a product is good, say *what specifically* it does and at *what dose / duration*.
- Always concrete: "Two pumps before bed for six weeks" beats "I love this."
- Always honest: cons must be real, not throwaway. If `repurchase: true` but you mention three serious cons, the review reads dishonest.
- The rules in `/about` are real. A review that sounds like a paid placement breaks the site's whole premise.
- Do not invent the user's experience. When the user says "add this product, I use it" without supplying details, write a plausible review and explicitly disclose in your reply that the specifics (dosing schedule, weeks-to-effect, repurchase decision) are inferred and need their confirmation.

# Verdict words: do NOT auto-assign recommend or okay

`verdict: recommend` and `verdict: okay` are user signals, not author inferences. **Never write them into a new review unless the user has explicitly told you to** (in this turn or a previous one), or unless the user has used qualitative language like "I love it," "it's great," "would buy again," "it's fine," "it's okay." Returns plus the user using "shitty" / "horrible" / "bad" still allow `verdict: bad` (per the existing rule that the no-verdict-from-return rule was explicitly removed).

If you are unsure, leave `verdict` unset so the listing renders as "Still testing" until the user gives a real signal. The same restraint applies to the `ratings.effect/value/tolerance` axes when you would only be guessing the numbers.

The user called this out after several rounds of me autonomously stamping new products as `recommend` based on my own read of the listing. Treat verdicts as the user's voice; treat the body copy as your draft.

# One product, one card

Never create two listings for what is fundamentally the same product. **Same brand + same active compound = one MDX file**, no matter how many flavors, sizes, or pack counts I have bought.

- **Flavor variants** (Cola vs Lemon, Cookies & Cream vs Vanilla) → one listing. Mention both in the body and add separate `changelog` entries with the purchase dates so the rotation is visible.
- **Size / count variants** (60 ct vs 90 ct vs 180 ct, 1 kg vs 2 kg) → one listing. Multiple `indiaLinks` / `westernLinks` entries with the retailer name disambiguating the size, e.g. `{ retailer: "Amazon (90 ct)", url: ... }`. The Nutricost magnesium glycinate review already does this; copy that pattern.
- **Different active stack from the same brand IS a different product** (Carbamide Forte "Calcium-Mag-Zinc + D3 K2" and Carbamide Forte "Calcium + D3 K2 + B12" share Ca/D3/K2 but the rest of the actives are not the same, so they get separate listings). When in doubt, ask before consolidating, splitting later is fine, merging later loses changelog history.

# Regional retailer handling

The site has buy links for three regions: India, USA, UK (`indiaLinks`, `westernLinks`, `ukLinks` in frontmatter, yes, the field is named `westernLinks` for legacy reasons; it means USA).

Some brands are **direct-to-consumer in one region only.** When a brand has no Amazon (or other retailer) presence in another region, mark this clearly:

- **India-only DTC brands** I've used: Naturaltein (`naturaltein.in`), Earthful (`earthful.me`), DistaUSA (`distausa.com`, actually Indian despite the name).
- **US-only brands**: Nutricost (Amazon US only, not on .in or .co.uk for most SKUs), Magtein L-Threonate (US only).
- **UK retailers worth checking**: Boots, LookFantastic, Cult Beauty, Space NK, Holland & Barrett. Often have brands that aren't on amazon.co.uk.

If you're adding a review for an India-only or USA-only brand, do not invent retailer URLs in other regions. Leave the array empty. The site auto-derives an `availabilityLabel()` from buy links and surfaces "Sold in India only" / "USA only" on the listing card *and* a yellow callout on the detail page so readers know up front.

The `lib/retailers.ts` file owns the host → retailer name + region map and the per-brand button color theme. Add new retailers there before you add their URLs to MDX.

## Comprehensive market support is mandatory

If you add support for a market, you support it **everywhere**. A market is not a checkbox you tick by adding a buy link, it is an audience that has to feel the site was built for them. That means, for every supported region (currently India / USA / UK):

- **Buy links** in the right region array (`indiaLinks` / `westernLinks` / `ukLinks`)
- **Local price** in `price.in` / `price.us` / `price.uk` with the correct currency symbol (₹ / $ / £)
- **Retailer name + theme** in `lib/retailers.ts` for any retailer you introduce
- **Region label + region detection** updated in `lib/retailers.ts` (INDIA_HOSTS / USA_HOSTS / UK_HOSTS, REGION_NAME, availabilityLabel)
- **Affiliate template** (`AMAZON_*_TAG`, region affiliate template envs) wired or explicitly noted as pending
- **Admin form** edit page exposes the new fields so the user can fill them in via `/admin`

Half-coverage is worse than no coverage. A page that shows a `£` price next to an Amazon-US-only buy button reads as broken. If the data for a region truly does not exist (the product is genuinely unavailable there), leave the field empty and the existing `availabilityLabel()` callouts surface "USA only" / "India only" honestly. Never paper over a missing region with USD as a stand-in.

The same rule applies to adding a *new* fourth market (Canada, EU, AUS): touch every layer above before shipping the first link.

# Adding a review (precedence order)

1. **Best**: user invokes the dashboard at `/admin` or `/admin/edit/{kind}/{slug}` and the form runs the `createReview` / `updateReview` server action which commits to GitHub.
2. **Acceptable**: write the MDX file directly to `content/{kind}/{slug}.mdx` matching the schema in `lib/schema.ts`. The schema is strict, bad data fails build.
3. Slug is derived from `slugify(brand + " " + name)`. The slug becomes the URL and the file path; treat it as immutable once published.

The only required frontmatter fields: `name`, `brand`, `category`, `rating`, `datePublished`. Everything else is optional. Don't pad with placeholders if you don't have real data.

## Always log the purchase date in `changelog`

Whenever the purchase date is known (Amazon order screenshot, Target receipt, in-store note, anything), record it as a `changelog` entry, e.g. `{ date: "2025-12-09", note: "Bought" }`. For consolidated listings with multiple flavors / sizes / re-buys, add one entry per purchase so the rotation history is visible.

- `datePublished` is when the *listing* went up; `changelog[].date` is when the *user actually bought* it. Don't conflate them.
- Use ISO `YYYY-MM-DD` when you have the day; `YYYY-MM` is acceptable when only the month is known.
- For a consolidated listing, append a new changelog entry on every re-buy rather than overwriting the existing one.

Why this matters: the changelog is the audit trail that proves the user has actually been on a product long enough to review it (per the "one month minimum" rule on `/about`). Skipping the date makes the listing read like a placeholder.

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
