import { MetadataRoute } from "next";

const SITE_URL = process.env.BASE_NAME || "https://www.adhennatattoo.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/fr", "/en", "/sitemap.xml", "/robots.txt"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
