# Roadmap

Running list of deferred work. Ordered loosely by priority.

## Security / red-team pass

A full adversarial review of the deployed site, deferred to a dedicated session.
Scope:

- **Server action auth.** Add an explicit `await auth()` guard at the top of
  every action in `app/admin/actions.ts` (`createReview`, `updateReview`,
  `createPhoto`, `uploadProductImage`). Middleware covers the HTTP path but an
  in-code check is belt + suspenders, and removes any ambiguity if a server
  action ever gets imported from a non-admin route.
- **Upload content-type whitelist.** `uploadProductImage` passes whatever
  `file.type` the browser sends to `@vercel/blob`. Restrict to
  `image/jpeg|png|webp|avif` and reject SVGs (script-in-SVG is a classic
  stored-XSS vector if a non-admin ever views the file).
- **Content Security Policy.** Not set. Add a strict CSP for `/admin/*` at
  minimum, and a looser site-wide one.
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
- **Stale `ADMIN_PASSWORD` env var.** Delete from Vercel — we migrated to
  Google OAuth, the HMAC cookie auth is gone from the code.

## Affiliate program applications

- Apply for Amazon US Associates (`AMAZON_US_TAG`).
- Apply for Amazon UK Associates (`AMAZON_UK_TAG`).
- Configure `INDIA_AFFILIATE_TEMPLATE`, `WESTERN_AFFILIATE_TEMPLATE`
  (Cuelinks / EarnKaro aggregators) once selected.

## Content

- Take real product photos for each review (placeholder watermark falls back
  today). Upload via `/admin` — now writes to Vercel Blob (connected
  2026-04-24).
- Migrate any hot-linked product imagery (Amazon, retailer URLs) into Blob
  for reliability + privacy.

## Infrastructure

- Buy `yashgoel.com` or `yashgoel.bio` and point the Vercel domain.
- Upgrade Vercel CLI locally (`npm i -g vercel@latest`).
- Decide on Australia / Canada regional link support (would introduce a
  `regionalLinks` map on the schema instead of the current three fixed
  arrays).
