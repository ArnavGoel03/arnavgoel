import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WebsiteJsonLd } from "@/components/json-ld";
import { themeInitScript } from "@/components/theme-toggle";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
  colorScheme: "light dark",
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
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-stone-900 dark:text-stone-100">
        <WebsiteJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
