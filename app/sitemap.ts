import type { MetadataRoute } from "next";
import { getNotes, getPrimers, getReviews } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, priority: 1 },
    { url: `${site.url}/about`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/now`, lastModified: now, priority: 0.9 },
    { url: `${site.url}/notes`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/photos`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/skincare`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/supplements`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/oral-care`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/primers`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/links`, lastModified: now, priority: 0.7 },
  ];
  const noteRoutes: MetadataRoute.Sitemap = getNotes().map((n) => ({
    url: `${site.url}/notes/${n.slug}`,
    lastModified: new Date(n.datePublished),
    priority: 0.7,
  }));
  const reviewRoutes: MetadataRoute.Sitemap = (["skincare", "supplements", "oral-care"] as const).flatMap(
    (kind) =>
      getReviews(kind).map((r) => ({
        url: `${site.url}/${kind}/${r.slug}`,
        lastModified: new Date(r.datePublished),
        priority: 0.7,
      })),
  );
  const primerRoutes: MetadataRoute.Sitemap = getPrimers().map((p) => ({
    url: `${site.url}/primers/${p.slug}`,
    lastModified: new Date(p.lastUpdated ?? p.datePublished),
    priority: 0.7,
  }));
  return [...staticRoutes, ...noteRoutes, ...reviewRoutes, ...primerRoutes];
}
