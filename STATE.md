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

## Session 2026-05-18 — Production outage + rollback

### Outage cause
Commits `169334b` (CSP nonce middleware + Upstash rate limit) and `cffca3e`
(theme-init CSP hash) introduced a per-request nonce CSP via `proxy.ts`.
Two compounded bugs:
1. `proxy.ts` referenced `themeInitScriptCspSource` without importing it →
   `ReferenceError` on every request → blank page on the deployed build.
2. Even after wiring the import, per-request CSP nonces are fundamentally
   incompatible with Next 16 `cacheComponents` prerender: the framework
   streams inline scripts from the cached shell that can't carry a
   per-request nonce, so the browser blocked the Next bootstrap and the
   page hung forever on the `app/loading.tsx` skeleton.

### Shipped this session
- **`c583f3c` (pushed to origin/main)** — Added missing import of
  `themeInitScriptCspSource`; switched the hash to a precomputed literal
  in `lib/theme-script.ts` (Edge middleware can't pull `node:crypto`);
  removed `headers()` from `app/layout.tsx` so the shell prerenders;
  consolidated `themeInitScript` to `lib/theme-script.ts`.

### In progress (local edits, NOT yet committed/pushed)
- `proxy.ts` reduced to `/admin/:path*` matcher only — no middleware on
  public routes, no JWT decode on the home page.
- `next.config.ts` ships a single **static CSP** header (`'unsafe-inline'`
  + `'unsafe-eval'` + host allowlist for Vercel Analytics, SpeedInsights,
  Google Analytics). Per-request nonce path is fully gone.
- `components/route-warmer.tsx` trimmed: 16-route prefetch + Speculation
  Rules inline script removed; now `router.prefetch()` on 6 top routes
  with 80ms stagger.

### What's left next session
- Commit + push the in-progress edits above (the user interrupted before
  the commit landed; check `git status` first to confirm).
- Drop `lib/theme-script.ts` `themeInitScriptCspSource` export (unused
  after the rollback) or leave dead.
- Performance pass on heavy root-layout client components: `CursorHalo`
  (continuous RAF), `RouteWarmer`, `Analytics`/`SpeedInsights`/`GA`
  (dynamic-import + idle).
- Aggressive red-team for remaining flaws (parallel agent fanout was
  requested but not run).

## What's left

- Real product photography for reviews currently watermark-only (so they re-appear in the home shelf preview)
- Future: revisit Next 16 cacheComponents migration once 22 per-route segment configs (mostly OG image runtime declarations) are reworked. Worth ~30% additional speed gain. Not urgent.
- Audio cue audio assets are synthesized (Web Audio API), no work needed there.

## Key file pointers

- `components/route-warmer.tsx` — bulk prefetch + Speculation Rules
- `components/cursor-halo.tsx`, `components/audio-cues.tsx`, `components/reading-progress.tsx`, `components/time-greeting.tsx`, `components/nav-link.tsx`, `lib/haptic-click.ts`
- `app/loading.tsx` + 12 per-route `loading.tsx` files
