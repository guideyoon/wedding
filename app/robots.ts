import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "Yeti",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: ["/", "/wedding", "/wedding/*", "/tarot", "/match", "/tips", "/privacy", "/terms"],
        disallow: ["/api/", "/go/"],
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/rss.xml`],
  };
}

