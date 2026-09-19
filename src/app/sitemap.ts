import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { getAllGuideMetas, getGames } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const games = getGames();

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/tools`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tools/dawnwalker-endings`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tools/dawnwalker-30day-planner`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tools/endfield-daily-checklist`, changeFrequency: "weekly", priority: 0.7 },
    ...games.map((g) => ({
      url: `${base}/games/${g.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...getAllGuideMetas().map((m) => ({
      url: `${base}/games/${m.game}/guides/${m.slug}`,
      lastModified: m.last_verified ? new Date(m.last_verified) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
