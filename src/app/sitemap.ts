import type { MetadataRoute } from "next";

const BASE = "https://www.tjcreate.co.uk";

/**
 * Date the homepage content last meaningfully changed. Bump this by hand when
 * the copy or work actually changes.
 *
 * Deliberately a constant, not `new Date()`: that stamped build time into
 * <lastmod>, so every deploy — including pure config or dependency changes —
 * claimed the page had been updated. Crawlers learn that a site's <lastmod> is
 * noise and start ignoring it, which costs the signal exactly when there IS a
 * real update worth recrawling.
 */
// 2026-07-20: service blurbs rewritten, About positioning broadened off
// music-only, display face changed, social card replaced.
const CONTENT_LAST_UPDATED = "2026-07-20";

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page site — Google ignores URL fragments when indexing, so there
  // is no value in listing #hash anchors. Additional top-level routes can be
  // added here as they are built. Note: /ferret/* routes are intentionally
  // excluded from the sitemap (hidden from search).
  return [
    {
      url: `${BASE}/`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
