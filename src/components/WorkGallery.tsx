"use client";

import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/content";
import ProjectTile from "./ProjectTile";
import ProjectModal from "./ProjectModal";

// Per-tile parallax strength (px) for the inner media layer.
const PARALLAX = [30, 40, 55, 25, 45, 50, 20, 42, 60];

/**
 * Selected work — a responsive grid (three columns on desktop, two on tablet,
 * one on mobile). Each tile is square and opens the project modal, or an
 * external link when it has one. No scroll pinning: plain vertical scroll.
 */
export default function WorkGallery() {
  const [active, setActive] = useState<Project | null>(null);

  const open = (p: Project) => {
    if (p.externalUrl) {
      window.open(p.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      setActive(p);
    }
  };

  return (
    <>
      <section
        id="work"
        aria-label="Selected work"
        className="relative bg-paper py-24 md:py-32"
      >
        <div className="px-6 md:px-10 mb-8 md:mb-12">
          <h2 className="section-heading">Selected work</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:px-10 lg:grid-cols-3 lg:gap-8">
          {PROJECTS.map((p, i) => (
            <div key={p.slug} className="aspect-square">
              <ProjectTile
                project={p}
                index={i}
                parallaxStrength={PARALLAX[i % PARALLAX.length]}
                onOpen={() => open(p)}
              />
            </div>
          ))}
        </div>
      </section>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}
