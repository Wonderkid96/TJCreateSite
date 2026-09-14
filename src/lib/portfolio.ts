import type { Project } from "./content";

// A compact opening selection spanning campaign, identity, motion and 3D.
// All projects remain available through the discipline and All work filters.
export const FEATURED_SLUGS = [
  "together-we-stand", "offcut", "jb-wrong-places",
  "jgrrey", "headphone-animation", "health-plus",
];

// Preserve the distinction already present in the project blurbs. An artist's
// own release is personal work; concept renders are not brand commissions.
export function projectAttribution(project: Project) {
  if (project.client === "TJCreate") return { label: "Project type", value: "Self-initiated" };
  if (["Toby Johnson", "Wonderkid"].includes(project.client)) return { label: "Project type", value: "Personal project" };
  return { label: "Client / collaborator", value: project.client };
}
