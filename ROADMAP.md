# Roadmap

Running list of deferred work. Ordered loosely by priority.

## Security / red-team pass

Partially addressed, rest still deferred to a dedicated session.

Done:

- ~~**Server action auth.**~~ `requireAdmin()` guard added to every action in
  `app/admin/actions.ts`, cross-checks the Auth.js session against
  `ALLOWED_ADMIN_EMAIL` (case-insensitive).
- ~~**Upload content-type whitelist.**~~ `uploadProductImage` and
  `createPhoto` now reject anything other than jpeg/png/webp/avif/gif, and
  cap file size at 8 MiB. SVG explicitly excluded.
- ~~**Content Security Policy.**~~ Site-wide CSP in `next.config.ts`, plus
  HSTS (2 years, preload). Strict-ish, with documented compatibility
  trade-offs around inline hydration scripts and hot-linked product imagery.

Still open:

- **Rate limiting.** `/admin/login` has no throttle. Not a big deal behind
  Google OAuth + allow-list, but Vercel BotID or a simple in-memory limiter
  would be nice.
- **Dependency audit.** `next-auth@beta` is pre-release. Pin a known-good
  version and track for stable release. Run `npm audit` and review.
- **Env-var exposure review.** Confirm no `NEXT_PUBLIC_*` accidentally ships
  a secret. Current only public var is `NEXT_PUBLIC_SITE_URL`. Recheck after
  any new env var addition.
- **Secrets hygiene.** `.env.local` is gitignored but do a historical scan
  (`git log -p | grep AUTH_`) to confirm no past leak.
- **OAuth consent status.** Currently in Testing mode (allow-list of test
  users). Decide whether to publish (any Google account can attempt sign-in,
  still gated by our `ALLOWED_ADMIN_EMAIL`) or keep it in Testing.
- **MDX render boundary.** `next-mdx-remote` compiles MDX server-side from
  author-controlled files. Low-risk, but document the assumption that only
  allow-listed admins can commit.
- **Stale `ADMIN_PASSWORD` env var.** Delete from Vercel. Migration to
  Google OAuth removed the HMAC cookie auth from the code; the env var no
  longer has any effect.

## Affiliate program applications

- Apply for Amazon US Associates (`AMAZON_US_TAG`).
- Apply for Amazon UK Associates (`AMAZON_UK_TAG`).
- Configure `INDIA_AFFILIATE_TEMPLATE`, `WESTERN_AFFILIATE_TEMPLATE`
  (Cuelinks / EarnKaro aggregators) once selected.

## Content

- Take real product photos for each review (placeholder watermark falls back
  today). Upload via `/admin`, which now writes to Vercel Blob (connected
  2026-04-24).
- Migrate any hot-linked product imagery (Amazon, retailer URLs) into Blob
  for reliability, privacy, and eventually a stricter CSP img-src directive.

## Infrastructure

- Buy `yashgoel.com` or `yashgoel.bio` and point the Vercel domain.
- Upgrade Vercel CLI locally (`npm i -g vercel@latest`).
- Decide on Australia / Canada regional link support (would introduce a
  `regionalLinks` map on the schema instead of the current three fixed
  arrays).

## Product ideas (nice-to-haves)

- Per-review TOC (like primers already have) for long bodies.
- Nonce-based CSP to drop `'unsafe-inline'` from script-src.
- A "Last updated" ribbon on review detail pages when `lastUpdated`
  postdates `datePublished` meaningfully.
- Search URL state sync, so `/search?q=creatine` deep-links into results.
