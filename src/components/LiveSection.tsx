"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/content";
import ProjectModal from "./ProjectModal";

// The most-viewed live visual: One Mississippi / Boutique Taberna, filmed for
// Mahogany in an abandoned warehouse (2019). Kept out of the PROJECTS array on
// purpose so it never appears in the Selected Work grid — it's a personal
// facet, surfaced only here. Reuses ProjectModal so it inherits the showcase
// modal's behaviour (portal, focus trap, Escape, muted autoplay with controls).
const PERFORMANCE: Project = {
  slug: "live-one-mississippi",
  title: "One Mississippi",
  client: "Mahogany",
  year: "2019",
  category: "Music",
  tags: ["Live", "Vocal"],
  blurb:
    "Before the design work I was a signed recording artist with Mahogany Recordings (2018–2022). This is a live session, One Mississippi into Boutique Taberna, filmed in an abandoned warehouse. Three solo EPs, 22M+ streams, a European tour supporting Jack Savoretti and Dotan.",
  image: "/work/imported/live/one-mississippi-mahogany.jpg",
  alt: "Toby Johnson performing One Mississippi live for a Mahogany Session in an abandoned warehouse",
  previewYouTubeId: "r9tFqEYP7yo",
  bg: "#0a0a0a",
};

export default function LiveSection() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="live"
      aria-label="Toby Johnson live music"
      className="bg-ink text-paper px-6 py-24 md:px-10 md:py-28"
    >
      <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/65">
        Off the clock
      </div>

      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-14">
        {/* Poster tile — 16:9, click to open the performance in the showcase modal */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Play One Mississippi, live Mahogany Session"
          className="group relative block aspect-video w-full overflow-hidden rounded-[2px] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Image
            src={PERFORMANCE.image!}
            alt={PERFORMANCE.alt ?? PERFORMANCE.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.03]"
          />
          {/* Legibility wash + hover deepen */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent transition-opacity duration-500 group-hover:from-ink/60" />

          {/* Play button — brand accent */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent transition-transform duration-500 ease-[var(--ease)] group-hover:scale-110 md:h-20 md:w-20"
          >
            <span className="ml-1 h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-paper md:border-y-[13px] md:border-l-[22px]" />
          </span>

          {/* Corner labels */}
          <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/90">
            Live · Mahogany Session
          </span>
          <span className="absolute bottom-4 left-4 font-display text-xl uppercase leading-none tracking-tight md:text-2xl">
            {PERFORMANCE.title}
          </span>
        </button>

        {/* Context copy */}
        <div>
          <h2 className="font-display uppercase text-[clamp(1.6rem,4vw,2.8rem)] leading-[1.02] tracking-tight">
            I also <span className="text-accent">sing.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-paper/80">
            {PERFORMANCE.blurb}
          </p>
        </div>
      </div>

      <ProjectModal
        project={open ? PERFORMANCE : null}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
