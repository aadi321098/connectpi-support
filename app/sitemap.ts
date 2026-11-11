import { MetadataRoute } from "next";
import { getProducts, getAllCategoryPaths, getAllArticlePaths } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://support.connectpi.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // All product hubs
  const products = [...getProducts().map((p) => p.slug), "shared"];
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/${product}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // All categories
  const categoryPaths = getAllCategoryPaths("en");
  const categoryRoutes: MetadataRoute.Sitemap = categoryPaths.map((cat) => ({
    url: `${baseUrl}/${cat.product}/${cat.category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // All articles
  const articlePaths = getAllArticlePaths("en");
  const articleRoutes: MetadataRoute.Sitemap = articlePaths.map((art) => ({
    url: `${baseUrl}/${art.product}/${art.category}/${art.article}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...articleRoutes,
  ];
}
