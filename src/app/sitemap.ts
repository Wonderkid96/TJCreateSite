import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Content dates are changed deliberately, never stamped with build time.
// Every page changed in the 2026-10-28 release (descriptions, schema,
// related work), so one date covers the lot until the next content change.
const CONTENT_LAST_UPDATED = "2026-10-28";

// Next (16.4) writes the video title and description into the XML verbatim,
// so an "&" in a project title breaks the whole sitemap. Escape them here.
// If a later Next release starts escaping these fields itself the output
// would double-escape; tests/seo.spec.ts checks for that.
const xml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function sitemap(): MetadataRoute.Sitemap {
  // App support/legal routes (/ferret, /filmio, /phony, /trivia-crown,
  // /dustup and their children) remain excluded; they carry noindex metadata.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.published && project.published > CONTENT_LAST_UPDATED
        ? project.published
        : CONTENT_LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      // Google's image and video sitemap extensions: the share image is the
      // page's representative image, and the loop is its video.
      images: [`${SITE_URL}/og/${project.slug}.jpg`],
      ...(project.video && project.videoPoster && project.videoDuration
        ? {
            videos: [
              {
                title: xml(project.pageTitle ?? project.title),
                thumbnail_loc: `${SITE_URL}${project.videoPoster}`,
                description: xml(project.summary ?? project.blurb),
                content_loc: `${SITE_URL}${project.video}`,
                duration: Math.round(project.videoDuration),
                publication_date: project.published,
                family_friendly: "yes" as const,
              },
            ],
          }
        : {}),
    })),
  ];
}
