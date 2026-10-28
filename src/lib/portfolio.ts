import type { Project } from "./content";

// A compact opening selection spanning campaign, identity, motion and 3D.
// All projects remain available through the discipline and All work filters.
export const FEATURED_SLUGS = [
  "together-we-stand", "twelfth-man", "offcut", "jb-wrong-places",
  "jgrrey", "headphone-animation", "health-plus",
];

// Preserve the distinction already present in the project blurbs. An artist's
// own release is personal work; concept renders are not brand commissions.
/**
 * True when the project's media is a hosted loop with a poster and a known
 * length. The sitemap's video entry and the page's VideoObject both use this,
 * so a project is never a video in one and a still in the other.
 */
export function hasVideoEntry(project: Project) {
  return Boolean(project.video && project.videoPoster && project.videoDuration);
}

export function projectAttribution(project: Project) {
  if (project.client === "TJCreate") return { label: "Project type", value: "Self-initiated" };
  if (["Toby Johnson", "Wonderkid"].includes(project.client)) return { label: "Project type", value: "Personal project" };
  return { label: "Client / collaborator", value: project.client };
}
