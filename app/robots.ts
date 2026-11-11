import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://support.connectpi.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search", "/dev/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
