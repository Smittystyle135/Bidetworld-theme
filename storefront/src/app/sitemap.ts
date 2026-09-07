import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { getAllHandles, isShopifyConfigured } from "@/lib/shopify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/quiz`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/collections`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/blogs/news`, changeFrequency: "daily", priority: 0.7 },
  ];
  if (!isShopifyConfigured()) return staticRoutes;

  try {
    const { products, collections, articles } = await getAllHandles();
    return [
      ...staticRoutes,
      ...collections.map((c) => ({ url: `${base}/collections/${c.handle}`, lastModified: c.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
      ...products.map((p) => ({ url: `${base}/products/${p.handle}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
      ...articles.map((a) => ({ url: `${base}/blogs/news/${a.handle}`, lastModified: a.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ];
  } catch {
    return staticRoutes;
  }
}
