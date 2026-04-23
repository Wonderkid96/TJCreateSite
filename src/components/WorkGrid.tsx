"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/content";
import ProjectTile from "./ProjectTile";
import ProjectModal from "./ProjectModal";

// Per-tile parallax strength for inner media (px).
const PARALLAX = [30, 40, 55, 25, 45, 50, 20, 42, 60];

export default function WorkGrid() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section
      id="work"
      aria-label="Selected work"
      className="relative px-6 md:px-10 py-24 md:py-40"
    >
      <div className="mb-16 md:mb-24 flex items-end justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
            [ 01 / My Work ]
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            My <span className="italic">work</span>
          </motion.h2>
        </div>

        <div className="hidden md:block font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.12em] lg:tracking-[0.2em] text-muted whitespace-nowrap text-right">
          A mix of print, identity, and motion. Click any tile for a closer look.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 bento-grid">
        {PROJECTS.map((p, i) => (
          // Outer div holds the grid cell — never animated so the tile's
          // dark background is always opaque (same fix as Services cards).
          // Animating opacity on the wrapper made tiles invisible against
          // the page bg before they transitioned in.
          <div key={p.slug} className="bento-cell aspect-square">
            <motion.div
              initial={{ y: 24 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{
                duration: 0.75,
                delay: (i % 3) * 0.06,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="h-full w-full"
            >
              <ProjectTile
                project={p}
                index={i}
                parallaxStrength={PARALLAX[i % PARALLAX.length]}
                onOpen={() => {
                  if (p.externalUrl) {
                    window.open(p.externalUrl, "_blank", "noopener,noreferrer");
                  } else {
                    setActive(p);
                  }
                }}
              />
            </motion.div>
          </div>
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
