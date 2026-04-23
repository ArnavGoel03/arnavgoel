import type { MetadataRoute } from "next";
import { getReviews } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, priority: 1 },
    { url: `${site.url}/skincare`, lastModified: now, priority: 0.9 },
    { url: `${site.url}/supplements`, lastModified: now, priority: 0.9 },
    { url: `${site.url}/about`, lastModified: now, priority: 0.5 },
  ];
  const reviewRoutes: MetadataRoute.Sitemap = (["skincare", "supplements"] as const).flatMap(
    (kind) =>
      getReviews(kind).map((r) => ({
        url: `${site.url}/${kind}/${r.slug}`,
        lastModified: new Date(r.datePublished),
        priority: 0.8,
      })),
  );
  return [...staticRoutes, ...reviewRoutes];
}
