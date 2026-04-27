import type { NextConfig } from "next";

/**
 * Baseline CSP for the public site. Trades off strictness vs.
 * compatibility with Next.js inline scripts (hydration, the theme-init
 * snippet), Spotify's embed iframe, and hot-linked product imagery from
 * retailer CDNs.
 *
 * If this ever tightens further:
 *   - `'unsafe-inline'` on script-src can be swapped for per-request
 *     nonces, but that needs a custom middleware pass that stamps the
 *     nonce on every inline <script>.
 *   - `img-src https:` is permissive because product photos hot-link
 *     Amazon / Nykaa / Boots CDNs. Narrowing would require migrating
 *     every product photo into Vercel Blob first.
 */
const CSP_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'", "https:"],
  // Spotify embeds for the listening section + video embeds (YouTube
  // privacy-mode + Vimeo) for product walkthrough videos in the
  // detail-page gallery.
  "frame-src": [
    "https://open.spotify.com",
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
  ],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": [],
};

const cspValue = Object.entries(CSP_DIRECTIVES)
  .map(([k, v]) => (v.length === 0 ? k : `${k} ${v.join(" ")}`))
  .join("; ");

const nextConfig: NextConfig = {
  // Note: `cacheComponents: true` would enable Next 16 PPR for instant tab
  // shells, but it conflicts with 22 existing per-route segment configs
  // (`export const runtime = "nodejs"` on OG image routes, `force-dynamic`
  // on subscribe/admin API routes). Worth migrating to `'use cache'`
  // directives later — for now, keep loading.tsx + hover-prefetch +
  // viewTransition for ~70% of the speed gain at zero risk.
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            // microphone=(self) so /search can use the Web Speech API
            // for voice queries; other powerful sensors stay denied.
            value:
              "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
          },
          { key: "Content-Security-Policy", value: cspValue },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
