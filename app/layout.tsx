import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono, Instrument_Serif, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToastHost } from "@/components/toast-host";
import { WebsiteJsonLd } from "@/components/json-ld";
import { themeInitScript } from "@/components/theme-toggle";
import { CompareProvider } from "@/components/compare-bar";
import { CommandPaletteMount } from "@/components/command-palette-mount";
import { SiteTourMount } from "@/components/site-tour-mount";
import { BackToTop } from "@/components/back-to-top";
import { RouteWarmer } from "@/components/route-warmer";
import { CursorHalo } from "@/components/cursor-halo";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  preload: true,
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: site.shortName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: site.name }],
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  // Site defaults to dark regardless of OS preference, so the theme
  // color on every platform should match the dark body. Users who
  // manually toggle to light accept a small chrome-tint mismatch.
  themeColor: "#1c1917",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${fraunces.variable} antialiased`}
    >
      <head>
        {/* Preconnect to the Vercel Blob CDN that hosts every product
            photo. The handshake (DNS + TCP + TLS) costs 100-300 ms and
            blocks the first image fetch otherwise — preconnecting
            kicks it off in parallel with the HTML response so the LCP
            image lands sooner on every page. crossOrigin is required
            for the connection to be reusable for fetches. */}
        <link
          rel="preconnect"
          href="https://znqq4cj0ea3wjrtv.public.blob.vercel-storage.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://znqq4cj0ea3wjrtv.public.blob.vercel-storage.com"
        />
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-stone-900 dark:text-stone-100">
        <WebsiteJsonLd />
        <CompareProvider>
          <Header />
          <RouteWarmer />
          <main className="flex-1">{children}</main>
          <Footer />
          <CommandPaletteMount />
          <BackToTop />
          <ToastHost />
          {/* Suspense wrap is required because SiteTourMount calls
              useSearchParams(); without it, static prerender of /404
              bails and the whole build fails. */}
          <Suspense fallback={null}>
            <SiteTourMount />
          </Suspense>
        </CompareProvider>
        {/* Cursor halo: renders nothing on touch devices — the
            component checks (hover: hover) at mount time. */}
        <CursorHalo />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-DK22JR55RB" />
      </body>
    </html>
  );
}
