import type { MetadataRoute } from "next";

import { DATA_REGION_KEYS } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wedding-evee.example";
  const today = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/wedding`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  for (const region of DATA_REGION_KEYS) {
    entries.push({
      url: `${baseUrl}/wedding/${region}`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  entries.push(
    {
      url: `${baseUrl}/tarot`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/match`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.4,
    },
  );

  return entries;
}

