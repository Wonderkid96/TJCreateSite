import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content";

const BASE = "https://www.tjcreate.co.uk";

// Content dates are changed deliberately, never stamped with build time.
const CONTENT_LAST_UPDATED = "2026-09-11";

export default function sitemap(): MetadataRoute.Sitemap {
  // App support/legal routes (/ferret, /filmio, /phony, /trivia-crown,
  // /dustup and their children) remain excluded; they carry noindex metadata.
  return [
    {
      url: `${BASE}/`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PROJECTS.map(({ slug }) => ({
      url: `${BASE}/projects/${slug}`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
