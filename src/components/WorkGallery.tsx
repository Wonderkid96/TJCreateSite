"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { PROJECTS, type Project } from "@/lib/content";
import ProjectTile from "./ProjectTile";
import ProjectModal from "./ProjectModal";

// Per-tile parallax strength (px) for the inner media layer.
const PARALLAX = [30, 40, 55, 25, 45, 50, 20, 42, 60];

/**
 * Selected work as a pinned horizontal gallery. The section is taller than the
 * viewport; while it is pinned, vertical scroll is mapped 1:1 onto horizontal
 * translation of the tile track, so the whole catalogue scrolls sideways. This
 * is still native vertical scroll (keyboard, trackpad, screen readers all work)
 * — only the visual axis is remapped.
 *
 * Reduced-motion users get a plain native horizontal-scroll strip with no
 * pinning, so nothing is scroll-jacked.
 */
export default function WorkGallery() {
  const [active, setActive] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [maxX, setMaxX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Measure how far the track must travel so the last tile ends flush with the
  // right edge. Re-measured on resize / content changes.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setMaxX(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  const open = (p: Project) => {
    if (p.externalUrl) {
      window.open(p.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      setActive(p);
    }
  };

  const tiles = PROJECTS.map((p, i) => (
    <div
      key={p.slug}
      className="shrink-0 h-[58vh] md:h-[64vh] w-[78vw] sm:w-[48vw] lg:w-[34vw]"
    >
      <ProjectTile
        project={p}
        index={i}
        parallaxStrength={PARALLAX[i % PARALLAX.length]}
        onOpen={() => open(p)}
      />
    </div>
  ));

  // Mobile / reduced-motion: native horizontal scroll strip, no pinning.
  if (reduce || isMobile) {
    return (
      <section
        id="work"
        aria-label="Selected work"
        className="relative bg-paper py-24 md:py-32"
      >
        <Header />
        <div className="flex gap-5 overflow-x-auto px-6 pb-4 md:px-10">{tiles}</div>
        <ProjectModal project={active} onClose={() => setActive(null)} />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected work"
      // Vertical scroll distance == horizontal travel, so the mapping is 1:1.
      style={{ height: `calc(100vh + ${maxX}px)` }}
      className="relative bg-paper"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <Header />
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-5 px-6 will-change-transform md:gap-8 md:px-10"
        >
          {tiles}
        </motion.div>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}

function Header() {
  return (
    <div className="mb-8 flex items-end justify-between px-6 md:mb-12 md:px-10">
      <h2 className="font-display uppercase text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-tight">
        Selected work
      </h2>
      <div className="hidden text-right font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:block">
        Print · Identity · Motion · 3D
        <br />
        {String(PROJECTS.length).padStart(2, "0")} projects · 2021-26
      </div>
    </div>
  );
}
