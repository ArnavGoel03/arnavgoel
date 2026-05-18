import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// CSP is static. Per-request nonces don't work with cacheComponents
// prerender (Next streams inline scripts from the cached shell that
// can't carry a per-request nonce), so we authorize known sources by
// host + 'unsafe-inline' for the framework's own inline tags. The
// theme-init script's body is also covered by the unsafe-inline clause.
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' covers Next's framework bootstrap + theme-init + JSON-LD.
  // 'unsafe-eval' is retained for libs (analytics, error tracking).
  // Vercel + Google Analytics hosts are listed explicitly so a future
  // 'strict-dynamic' upgrade has somewhere to land.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-scripts.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.googletagmanager.com https://www.google-analytics.com https://*.vercel-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  // Spotify embeds for the listening section + YouTube/Vimeo for any
  // product walkthrough video in the detail-page gallery.
  "frame-src https://open.spotify.com https://www.youtube-nocookie.com https://player.vimeo.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // Next 16 PPR via Cache Components. Pages are dynamic by default;
  // anything wrapped with `'use cache'` (see lib/content.ts, lib/photos.ts,
  // and per-route page wrappers) becomes a prerendered cache hit, with
  // tag-based invalidation through `cacheTag` + `updateTag`.
  cacheComponents: true,
  experimental: {
    viewTransition: true,
  },
  // Next/Image only fetches remote hosts that match one of these
  // patterns. Vercel Blob assets live at <storeId>.public.blob.vercel-storage.com
  // (any Blob store you connect, with or without a custom prefix). Product
  // photos that hot-link retailer CDNs (Amazon, Nykaa, etc.) keep working
  // because they go through <img> tags rather than Next/Image.
  images: {
    // Next 16 enforces an allowlist for the `quality` prop. Default is
    // just [75]; any other value returns 400 INVALID_IMAGE_OPTIMIZE_REQUEST.
    // Listing every quality we use across PhotoTile / PhotoHero /
    // PhotoSideCaption / Lightbox / chapter-cover backgrounds.
    qualities: [60, 65, 70, 75, 80, 85, 88, 90, 92, 95],
    // Lightbox requests w=2400 explicitly for retina previews. Default
    // deviceSizes tops out at 3840 but doesn't include 2400; Next 16
    // is strict about widths and rejects unknown ones with 400. Adding
    // 2400 to deviceSizes makes the lightbox URL valid.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2400, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // GitHub Release assets — legacy fallback. Active editorial photos
      // have migrated to R2; these entries are pinned to OUR repo so the
      // image optimizer can't be abused as an open image-laundering proxy
      // (without a pathname restriction, any GitHub user could route
      // images through yashgoel.vercel.app/_next/image).
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/ArnavGoel03/yashgoel/**",
      },
      {
        protocol: "https",
        hostname: "objects.githubusercontent.com",
        pathname: "/**",
      },
      // Cloudflare R2 public bucket. Replaces GH Releases as the editorial
      // photo host: stable URLs, content-type=image/jpeg, no signed-URL
      // expiry chain, no egress cliff.
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
    ],
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
          { key: "Content-Security-Policy", value: CSP },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // COOP isolates the browsing context — prevents cross-origin
          // popups from holding a reference to this window. Required for
          // Spectre-class hardening and crossOriginIsolated to return true.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // CORP blocks other origins from loading this site's
          // sub-resources via no-cors fetches.
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          // Disable implicit DNS prefetch on every link href — stops the
          // browser from leaking navigation intent to the DNS layer.
          { key: "X-DNS-Prefetch-Control", value: "off" },
          // Closes the Adobe Flash / PDF cross-domain-policies vector.
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
