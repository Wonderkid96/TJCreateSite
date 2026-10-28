import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/ProjectModal";
import { projectAttribution } from "@/lib/portfolio";
import { PROJECTS, type Project } from "@/lib/content";
import { FALLING_FIRST_FRAME } from "@/lib/falling-frames";
import { CONTACT_EMAIL, ORG_ID, PERSON_ID, SITE_NAME, SITE_URL, WEBSITE_ID } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// The gallery's "Graphic" filter groups these four categories; related work
// and the closing line use the same grouping, so a poster points at posters.
const GRAPHIC_CATEGORIES: Project["category"][] = ["Graphic", "Identity", "Print", "Music"];

type Discipline = "graphic" | "motion" | "3d";

const DISCIPLINE_LABEL: Record<Discipline, string> = {
  graphic: "graphic design",
  motion: "motion graphics",
  "3d": "3D design",
};

// One closing line per discipline, naming the deliverables people search
// for. Every item here is on the services list; nothing is promised that the
// site does not already offer.
const CLOSING_LINE: Record<Discipline, string> = {
  graphic:
    "Need something similar? I take on campaign artwork, posters, packaging and release artwork for brands, artists, labels and agencies, remote from Lincoln.",
  motion:
    "Need something similar? I make lyric videos, release animations, Spotify Canvas loops, logo animations and social cuts for artists, labels, brands and agencies, remote from Lincoln.",
  "3d":
    "Need something similar? I build 3D product renders, packshots, product animation and full scenes in Blender for brands and agencies, remote from Lincoln.",
};

function getProject(slug: string) {
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();
  return project;
}

function discipline(project: Project): Discipline {
  if (GRAPHIC_CATEGORIES.includes(project.category)) return "graphic";
  return project.category === "3D" ? "3d" : "motion";
}

function relatedProjects(project: Project) {
  const kind = discipline(project);
  return PROJECTS.filter((other) => other !== project && discipline(other) === kind).slice(0, 3);
}

const pageTitle = (project: Project) => project.pageTitle ?? project.title;
const description = (project: Project) => project.summary ?? project.blurb;
const absolute = (path: string) => `${SITE_URL}${path}`;
const shareImage = (project: Project) => `${SITE_URL}/og/${project.slug}.jpg`;
const stillImage = (project: Project) =>
  project.image ?? project.videoPoster ?? (project.kind === "falling" ? FALLING_FIRST_FRAME : undefined);

export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  const title = pageTitle(project);
  const url = `${SITE_URL}/projects/${project.slug}`;
  // Share image is generated at 1200x630 by scripts/og-images.mjs: the still
  // on the project's own background, so a shared link never shows a crop.
  const images = [{ url: shareImage(project), width: 1200, height: 630, alt: project.alt ?? project.title }];

  return {
    title,
    description: description(project),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${title} · TJCreate`,
      description: description(project),
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · TJCreate`,
      description: description(project),
      images,
    },
  };
}

/**
 * Per-project JSON-LD: breadcrumb, the page, and the work itself as a
 * VideoObject (motion and 3D pieces with a loop) or an ImageObject. Linked by
 * @id to the Person and ProfessionalService nodes the root layout declares,
 * so every project page strengthens the same entity.
 */
function structuredData(project: Project) {
  const url = `${SITE_URL}/projects/${project.slug}`;
  const title = pageTitle(project);
  const still = stillImage(project);
  const stillUrl = still ? absolute(still) : shareImage(project);
  const isVideo = Boolean(project.video && project.videoPoster && discipline(project) !== "graphic");
  const mediaId = `${url}#${isVideo ? "video" : "image"}`;
  const keywords = project.tags.join(", ");

  const media = isVideo
    ? {
        "@type": "VideoObject",
        "@id": mediaId,
        name: title,
        description: description(project),
        thumbnailUrl: [absolute(project.videoPoster!)],
        contentUrl: absolute(project.video!),
        ...(project.previewYouTubeId
          ? { embedUrl: `https://www.youtube.com/embed/${project.previewYouTubeId}` }
          : {}),
        ...(project.published ? { uploadDate: project.published } : {}),
        ...(project.videoDuration ? { duration: `PT${Math.round(project.videoDuration)}S` } : {}),
        inLanguage: "en-GB",
        isFamilyFriendly: true,
        keywords,
        creator: { "@id": PERSON_ID },
        publisher: { "@id": ORG_ID },
      }
    : {
        "@type": "ImageObject",
        "@id": mediaId,
        name: title,
        description: description(project),
        contentUrl: stillUrl,
        url: stillUrl,
        caption: project.alt ?? project.title,
        ...(project.published ? { datePublished: project.published } : {}),
        representativeOfPage: true,
        keywords,
        creator: { "@id": PERSON_ID },
      };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#work` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: `${title} · TJCreate`,
        description: description(project),
        inLanguage: "en-GB",
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: { "@type": "ImageObject", contentUrl: shareImage(project) },
        mainEntity: { "@id": mediaId },
        author: { "@id": PERSON_ID },
        publisher: { "@id": ORG_ID },
        ...(project.published ? { datePublished: project.published } : {}),
      },
      media,
    ],
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  const nextProject = PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length];
  const related = relatedProjects(project);
  const kind = discipline(project);
  const attribution = projectAttribution(project);
  const enquiryUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Project enquiry: ${project.title}`)}`;

  return (
    <main id="main" className="project-detail bg-paper text-ink">
      {/* Plain <script>, not next/script, for the same reason as the root
          layout: the schema has to be in the served HTML on the first pass. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(project)) }}
      />
      <section data-no-reveal aria-labelledby="project-title">
        <Link href="/#work" className="inline-block font-mono text-xs uppercase tracking-widest underline underline-offset-4">
          Back to work
        </Link>

        <div className="project-detail-layout">
          <div
            className={`project-detail-media relative aspect-square md:aspect-auto md:min-h-[400px] ${
              project.mediaAspectRatio ? "media-fit" : ""
            }`}
            style={project.mediaAspectRatio ? {
              aspectRatio: project.mediaAspectRatio,
              "--media-ratio": project.mediaAspectRatio,
              background: project.bg,
            } as React.CSSProperties : undefined}
          >
            <ProjectMedia project={project} />
          </div>

          <div className="project-detail-copy">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {project.category}
            </p>
            <h1 id="project-title" className="section-heading mt-4">
              {project.title}<span className="text-accent">.</span>
            </h1>

            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{attribution.label}</dt>
                <dd className="mt-1">{attribution.value}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">Year</dt>
                <dd className="mt-1">{project.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">Tags</dt>
                <dd className="mt-1">{project.tags.join(" · ")}</dd>
              </div>
              {project.tools && (
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted">Tools</dt>
                  <dd className="mt-1">{project.tools.join(" · ")}</dd>
                </div>
              )}
            </dl>

            <h2 className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
              Project overview
            </h2>
            <p className="mt-3 text-base leading-relaxed">{project.blurb}</p>
            <p className="mt-5 text-base leading-relaxed text-ink/80">{CLOSING_LINE[kind]}</p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <a href={enquiryUrl} className="inline-block underline underline-offset-4">
                Enquire about a project
              </a>
              <Link href="/#services" className="inline-block underline underline-offset-4">
                What I do
              </Link>
            </div>
          </div>
        </div>

        <nav aria-label="More work" className="mt-10 border-t border-line pt-6">
          {related.length > 0 && (
            <>
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                More {DISCIPLINE_LABEL[kind]}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link href={`/projects/${other.slug}`} className="inline-block underline underline-offset-4">
                      {other.title}
                      <span className="sr-only">, {projectAttribution(other).value}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link href={`/projects/${nextProject.slug}`} className="mt-6 inline-block underline underline-offset-4">
            Next project: {nextProject.title}
          </Link>
        </nav>
      </section>
    </main>
  );
}
