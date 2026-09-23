import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/ProjectModal";
import { projectAttribution } from "@/lib/portfolio";
import { PROJECTS } from "@/lib/content";

const SITE_URL = "https://www.tjcreate.co.uk";

type Props = { params: Promise<{ slug: string }> };

function getProject(slug: string) {
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();
  return project;
}

export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  const title = `${project.title} · ${project.category} design`;
  const url = `${SITE_URL}/projects/${project.slug}`;
  const image = project.image ?? project.videoPoster;
  const images = image
    ? [{ url: new URL(image, SITE_URL).href, alt: project.alt ?? project.title }]
    : [{ url: `${SITE_URL}/opengraph-image.jpg`, alt: "TJCreate · Toby Johnson" }];

  return {
    title,
    description: project.blurb,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${title} · TJCreate`,
      description: project.blurb,
      url,
      siteName: "TJCreate · Toby Johnson",
      locale: "en_GB",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · TJCreate`,
      description: project.blurb,
      images,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  const nextProject = PROJECTS[(PROJECTS.indexOf(project) + 1) % PROJECTS.length];
  const enquiryUrl = `mailto:hello@tjcreate.co.uk?subject=${encodeURIComponent(`Project enquiry: ${project.title}`)}`;

  return (
    <main id="work" className="project-detail bg-paper text-ink">
      <section data-no-reveal aria-labelledby="project-title">
        <Link href="/#work" className="inline-block font-mono text-xs uppercase tracking-widest underline underline-offset-4">
          Back to work
        </Link>

        <div className="project-detail-layout">
          <div
            className="project-detail-media relative aspect-square md:aspect-auto md:min-h-[400px]"
            style={project.mediaAspectRatio ? {
              aspectRatio: project.mediaAspectRatio,
              height: "auto",
              minHeight: 0,
              background: project.bg,
            } : undefined}
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
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{projectAttribution(project).label}</dt>
                <dd className="mt-1">{projectAttribution(project).value}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">Year</dt>
                <dd className="mt-1">{project.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">Tags</dt>
                <dd className="mt-1">{project.tags.join(" · ")}</dd>
              </div>
            </dl>

            <h2 className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
              Project overview
            </h2>
            <p className="mt-3 text-base leading-relaxed">{project.blurb}</p>
            <a href={enquiryUrl} className="mt-8 inline-block underline underline-offset-4">
              Enquire about a project
            </a>
          </div>
        </div>

        <nav aria-label="More work" className="mt-10 border-t border-line pt-6">
          <Link href={`/projects/${nextProject.slug}`} className="inline-block underline underline-offset-4">
            Next project: {nextProject.title}
          </Link>
        </nav>
      </section>
    </main>
  );
}
