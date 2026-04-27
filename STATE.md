# Yashgoel · State

Personal website at https://yashgoel.vercel.app — Next.js 16 App Router on Vercel.

## Where we are

Single-author portfolio and review site. Ship fast, no feature flags, iterate by feel.

## Done in session 2026-04-27 (overnight)

### Tab-switching speed

- Loading.tsx + hover-prefetch wiring: tabs load routes in the background before user taps
- Speculation Rules RouteWarmer: sends hints to the browser for probabilistic prefetch
- PPR / cacheComponents tried but reverted because of 22 conflicting per-route segment configs (mostly OG image runtime declarations); documented for future migration

### Pampered pass (10 items)

- Cursor halo with trailing blur
- Audio cues + footer toggle (no sound by default, user can enable in settings)
- Font preload + swap strategy for web typography
- Smooth scroll enabled globally + slim custom scrollbar
- Time-of-day greeting in masthead (morning/afternoon/evening)
- Reading progress bar on long pages
- Optimistic click feedback (instant visual response)
- Image LQIP blur placeholders on photo galleries
- Empty-state poetry on 8 screens
- Streak-free audit found nothing to change

### Naming consistency

- GitHub repo `arnavgoel` renamed to `yashgoel`
- Local folder + `package.json` `name` field aligned
- Vercel project was already `yashgoel`

### Bun → pnpm

- `bun.lock` dropped, `pnpm-lock.yaml` adopted
- `.npmrc` configured with `shamefully-hoist=true` and `auto-install-peers=true`

### Home page rule

- "On the shelf right now" preview only shows reviews with at least one photo
- Implementation: filter on `collectCardPhotos(r).length > 0` in `app/page.tsx`

## What's left

- Real product photography for reviews currently watermark-only (so they re-appear in the home shelf preview)
- Future: revisit Next 16 cacheComponents migration once 22 per-route segment configs (mostly OG image runtime declarations) are reworked. Worth ~30% additional speed gain. Not urgent.
- Audio cue audio assets are synthesized (Web Audio API), no work needed there.

## Key file pointers

- `components/route-warmer.tsx` — bulk prefetch + Speculation Rules
- `components/cursor-halo.tsx`, `components/audio-cues.tsx`, `components/reading-progress.tsx`, `components/time-greeting.tsx`, `components/nav-link.tsx`, `lib/haptic-click.ts`
- `app/loading.tsx` + 12 per-route `loading.tsx` files
