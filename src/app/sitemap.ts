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
// 2026-08-24: music section removed, "Also built" strip added (LyriSync),
// splash screen and contact FAB removed, showreel poster changed.
const CONTENT_LAST_UPDATED = "2026-08-24";

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page site — Google ignores URL fragments when indexing, so there
  // is no value in listing #hash anchors. Additional top-level routes can be
  // added here as they are built. Note: /ferret/*, /filmio/*, /phony/*,
  // /trivia-crown/* and /dustup/* routes are intentionally excluded from the
  // sitemap (app support/legal pages, hidden from search via per-page meta
  // noindex).
  return [
    {
      url: `${BASE}/`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
