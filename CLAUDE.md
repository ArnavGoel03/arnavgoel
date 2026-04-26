@AGENTS.md

# About this site

A first-person review site (yashgoel.com → currently deployed at skincare-supplement-reviews.vercel.app). Magazine-editorial aesthetic. Seven product categories — skincare, supplements, oral care, hair care (split into Treatment and Styling chapters), body care, essentials (cornerstone daily devices like the laptop, earbuds, primary charger), and miscellaneous (random utility objects, accessories, gadgets) — plus /routine (with subroutine variants like /routine/morning/post-workout), /primers, /photos, a /now page, /subscribe for the email list, and a private /admin dashboard for adding content. The user (Yash on this site, Arnav at arnavgoel.dev) writes every review after using a product for at least a month.

The signature mark across the site is a small rose ❋ glyph; it appears in the header, every page masthead, hover states, and the footer. The accent color is rose only, everything else is stone-neutral. Don't introduce new accent colors.

# Working style

Don't ask for permission. When the user gives a directive, execute it
end-to-end and push. No "want me to start?", no confirmation rounds, no
"should I keep going?" trailers. The only acceptable interrupts are
genuine ambiguities the user could not have predicted, or destructive
operations covered by the "Ask before destructive Vercel/infra ops"
rule. Otherwise: ship, then report what shipped.

# Persist every user directive into this file

Anything the user says about how the site should look, behave, or be
maintained, every preference, every "remove this", every "always do X",
every "never do Y", every product fact (the user actually has the M4
MacBook, not the M2; verdict on Z is `recommend`; etc.), every taste
call (favourite colour, favourite chocolate, favourite playlist) gets
captured here in CLAUDE.md the same turn it is said. The user
explicitly does not want these decisions held only in conversation
state, where they evaporate the moment context compacts.

The right section is whichever one fits:

- **Surfaces the user has explicitly removed** — for "kill /X" or "I
  don't want a Y page".
- **Voice when writing reviews / Verdict words / One product, one card
  / Regional retailer handling** — for content rules.
- A new top-level section with a clear `# Heading` if nothing existing
  fits. Better one extra section than a buried bullet.

Update `~/.claude/projects/-Users-arnavgoel-Documents-skincare-supplement-reviews/memory/`
with a matching memory file at the same time so cross-conversation
recall does not depend on this single file. CLAUDE.md is the canonical
record; the memory directory is the index.

If a directive contradicts something already written here, edit the
existing section rather than appending a second one. The file should
read like a maintained rulebook, not a changelog of corrections.

# Glossary is canonical; primers cover combinations and depth

`/glossary` is the canonical, one-paragraph "what is X" source. Primers
do not redefine a term inline. A primer's job is *combinations*,
*dosing*, *how-to-read-the-label*, *trade-offs over time*, anything
that needs more than a paragraph. Single-ingredient primers
(`/primers/niacinamide`, `/primers/creatine`, etc.) auto-render a
"Quick definition" eyebrow that links to the matching glossary entry,
courtesy of `findGlossaryEntry()` in `lib/glossary.ts`.

When adding a new ingredient or term:

1. Add the canonical short definition to the glossary first.
2. If a deeper write-up is warranted, then add a primer. Make sure the
   primer's title or a `seeAlso` href in the glossary entry matches
   so the primer auto-links.
3. Do not duplicate the definition in product MDX, listing-card copy,
   or anywhere else. Link to `/glossary#<slug>` instead.

# `/library` and any data the user authors

`/library` reads from `content/_library.json` (user-owned, edited
either directly or through a future `/admin` form). Books and films are
the user's actual reading and watching, never seeded with AI guesses.
If the file is empty, the page renders an honest empty state, not
filler entries. Same principle applies to any other "what I am
currently doing" surface: real data, or no data, never invented data.

# `/best-of/<year>` releases on January 1 of the following year

A year-end issue ranking products has to wait for the year to actually
end. Until then, `/best-of/2026` (and any future year) is a
coming-soon page that explains why and points at `/subscribe`. Do not
auto-pick winners from the catalog mid-year, the previous AI-picked
listings were the exact mistake the user wants to avoid.

# Surfaces the user has explicitly removed (do not re-add)

The user has, over time, deleted entire surfaces because they read as
filler, AI-generated, or replicable boilerplate. Treat the absence of
these routes as a permanent decision, do not re-create them in any form
(no link in nav, no MDX, no replacement-with-different-name):

- **`/changelog`** — a site-wide "what's new" feed pulled from git log.
  The user does not want a public changelog page. Per-product
  `changelog[]` frontmatter (purchase history) stays. A site-level
  changelog page does not. Never re-add.
- **`/notes`** — short-form blog posts. Removed because they read as
  AI-generated filler. Long-form thinking belongs in `/primers`; product
  takes belong in reviews. Never re-add a third format.
- **`/uses`** — a uses.tech-style hardware/software list. Removed.
- **`/colophon`** — type-and-build meta page. Removed publicly to make
  the site's editorial choices less copy-pasteable. The original copy
  is preserved at `_local/colophon.md` (gitignored) for the user's
  reference. Never re-publish it as a route.
- **`/issue` (the Archive)** — monthly digest of every review/primer
  grouped by month. Removed; the catalog is browsable by category and
  search already, the archive added a layer no one used. Never re-add.
- **`/listening`** — cron-driven Spotify "recent tracks + top of the
  month" page. Removed: the user did not want a separate route just
  for what is on Spotify. The simple `<SpotifyEmbed>` on the homepage
  and `/now` is enough. Do not re-introduce a Spotify cron, refresh
  endpoint, or `content/_listening.json`.

If a future ask resembles one of these (a "what's new" page, a "tools I
use" list, a stack/typography breakdown), surface the prior decision in
your reply rather than silently building it.

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
