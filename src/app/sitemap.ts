import type { MetadataRoute } from "next";

const BASE = "https://www.tjcreate.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Single-page site — Google ignores URL fragments when indexing, so there
  // is no value in listing #hash anchors. Additional top-level routes can be
  // added here as they are built.
  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
