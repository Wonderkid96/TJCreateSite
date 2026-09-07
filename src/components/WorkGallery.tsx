"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/content";
import ProjectTile from "./ProjectTile";

// The modal only ever appears after a click, so its chunk (and everything it
// pulls in) stays out of the initial bundle. ssr:false is safe: it renders
// into a portal and contributes nothing to the server HTML.
const ProjectModal = dynamic(() => import("./ProjectModal"), { ssr: false });

// Per-tile parallax strength (px) for the inner media layer.
const PARALLAX = [30, 40, 55, 25, 45, 50, 20, 42, 60];

/**
 * Selected work pairs unobscured imagery with client and discipline captions.
 * Each tile opens the project modal, or an
 * external link when it has one. No scroll pinning: plain vertical scroll.
 */
export default function WorkGallery() {
  const [active, setActive] = useState<Project | null>(null);
  // Latches true on first open and stays true: the dynamic modal only starts
  // downloading then, but must stay mounted afterwards so AnimatePresence can
  // run its exit animation when `active` goes back to null.
  const [modalWanted, setModalWanted] = useState(false);

  const open = (p: Project) => {
    if (p.externalUrl) {
      window.open(p.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      setModalWanted(true);
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
        <div className="work-heading px-6 md:px-10">
          <h2 className="section-heading">Selected work<span className="text-accent">.</span></h2>
          <p className="work-intro">Brand, campaign, motion and 3D.</p>
        </div>
        <div className="work-grid px-6 md:px-10">
          {PROJECTS.map((p, i) => (
            <div key={p.slug} className="work-cell">
              <ProjectTile
                project={p}
                index={i}
                parallaxStrength={PARALLAX[i % PARALLAX.length]}
                onOpen={() => open(p)}
              />
              {/* Case-study copy, server-rendered. The visual home for the
                  blurb is the modal, which mounts client-side after a click —
                  invisible to crawlers. This sibling (deliberately outside the
                  tile button, so it never bloats the button's accessible name)
                  puts the copy in the served HTML for search engines and for
                  AT users browsing the grid. */}
              <p className="sr-only">{p.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {modalWanted && (
        <ProjectModal project={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}
