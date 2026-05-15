# Run with `just <recipe>`. List recipes with `just`.
set shell := ["zsh", "-cu"]

# Default: show recipe list.
default:
    @just --list

# Dev server with Turbopack (Next 16 default, but explicit anyway).
dev:
    pnpm dev --turbopack

# Re-run dev on any file change. Useful when chasing flaky HMR.
dev-watch:
    watchexec -r -c -e ts,tsx,mdx,css,json -- pnpm dev --turbopack

# Production build (also runs the hero AVIF prebuild step).
build:
    pnpm build

# Pull latest preview env from Vercel and rebuild.
build-preview:
    vercel env pull .env.local
    pnpm build

# Start the production build locally.
start:
    pnpm start

# Lint.
lint:
    pnpm lint

# Tests.
test:
    pnpm test

test-watch:
    pnpm test:watch

# E2E (if/when Playwright is wired here).
e2e:
    pnpm playwright test

# Regenerate the hero AVIF.
hero:
    pnpm build:hero

# Deploy to Vercel.
deploy:
    vercel --prod

deploy-preview:
    vercel

# Clean caches + node_modules. Use when builds get weird.
clean:
    rm -rf .next .turbo node_modules
    @echo "Cleaned. Run \`pnpm install\` to restore."

# Re-install from lockfile.
install:
    pnpm install --frozen-lockfile

# Stats on the codebase.
stats:
    tokei

# Audit deps.
audit:
    pnpm audit
