import { CLIENTS_WITH_LOGOS, FAQS, OWN_PRODUCTS, PROJECTS, SERVICES } from "@/lib/content";
import { BEHANCE_URL, CONTACT_EMAIL, INSTAGRAM_URL, LINKEDIN_URL, SITE_URL } from "@/lib/site";

// /llms.txt (llmstxt.org): a plain-text summary for AI assistants that read
// it. Generated at build time from the same content as the pages, so it can
// never describe work the site does not show.
export const dynamic = "force-static";

const INTRO =
  "Freelance graphic and motion designer in Lincoln, UK, working remotely for brands, artists, labels and agencies. Campaign artwork, posters and packaging; lyric videos, release animations, Spotify Canvas loops, logo animations and social content; 3D product renders, packshots and product animation in Blender.";

const PROFILE =
  `Toby Johnson has been designing for over eight years, including two years full-time in-house at Marathon Music Group (November 2023 to January 2026). Software: After Effects, Photoshop, Illustrator, Premiere Pro, Blender and Figma. Contact: ${CONTACT_EMAIL}. Scope, timeline and fees are agreed in writing before work starts; no prices are published.`;

export function GET() {
  const clients = CLIENTS_WITH_LOGOS.filter((client) => client.name !== "LyriSync").map((client) => client.name);
  const lines = [
    "# TJCreate (Toby Johnson)",
    "",
    `> ${INTRO}`,
    "",
    PROFILE,
    "",
    "## Services",
    "",
    ...SERVICES.map(
      (service) => `- [${service.title}](${SITE_URL}/#services): ${service.blurb} Capabilities: ${service.items.join(", ")}.`,
    ),
    "",
    "## Work",
    "",
    ...PROJECTS.map(
      (project) =>
        `- [${project.pageTitle ?? project.title}](${SITE_URL}/projects/${project.slug}): ${project.summary ?? project.blurb}${
          project.tools ? ` Tools: ${project.tools.join(", ")}.` : ""
        }`,
    ),
    "",
    "## Clients and collaborators",
    "",
    `- [Clients](${SITE_URL}/#clients): ${clients.join(", ")}. The RevenueCat, Replit and JetBrains work was delivered through Klutch Studio.`,
    "",
    "## Questions",
    "",
    ...FAQS.map((faq) => `- ${faq.question} ${faq.answer}`),
    "",
    "## Also built",
    "",
    ...OWN_PRODUCTS.map((product) => `- [${product.name}](${product.url}): ${product.blurb}`),
    "",
    "## Optional",
    "",
    `- [About Toby](${SITE_URL}/#about)`,
    `- [Contact](${SITE_URL}/#contact): ${CONTACT_EMAIL}`,
    `- [LinkedIn](${LINKEDIN_URL})`,
    `- [Instagram](${INSTAGRAM_URL})`,
    `- [Behance](${BEHANCE_URL})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
