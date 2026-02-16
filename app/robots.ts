import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/wedding", "/wedding/*", "/tarot", "/match"],
      disallow: ["/api/", "/go/"],
    },
    sitemap: "https://wedding-evee.example/sitemap.xml",
  };
}

