"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { SocialLinks } from "./SocialIcons";

// ─── Copy ────────────────────────────────────────────────────────────────────

const BIO_LEAD = "I'm Toby Johnson, a graphic and motion designer building ";
const BIO_ACCENT = "strategic visuals";
const BIO_TAIL = " for the music, culture and brand industries.";
const BIO_SECONDARY =
  "Artwork, posters, motion, 3D, socials, release campaigns, tour assets. I pull the pieces together so the whole thing feels intentional, not stitched together at the end.";

// Pin the palette dark so the overlaid copy stays readable in either theme,
// matching how Services/Contact lock their own dark backgrounds.
const DARK_VARS = {
  "--paper": "#fffdf8",
  "--ink": "#0a0a0a",
} as CSSProperties;

// ─── Section ─────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <section
      id="about"
      aria-label="About Toby Johnson"
      style={DARK_VARS}
      className="relative flex min-h-screen items-center overflow-hidden bg-ink text-paper"
    >
      {/* Full-bleed portrait — the subject sits to the right of frame, so a
          left-to-right darken carries the copy with no seam.
          Desktop: a right-origin zoom anchors the subject hard to the right
          edge. The image is portrait (4:5) in a landscape box, so it fills the
          full width and object-position can't shift it horizontally — scaling
          from the right edge is what pushes the subject right and clears more
          dark space on the left for the copy. Mobile keeps the plain crop. */}
      <Image
        src="/work/imported/portraits/toby-about.avif"
        alt="Portrait of Toby Johnson"
        fill
        sizes="100vw"
        className="object-cover object-[58%_56%] md:origin-right md:scale-[1.45] md:translate-x-[10%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
      {/* Mobile: copy overlaps more, so add a vertical darken too. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent md:hidden" />

      <div className="relative w-full px-6 py-24 md:px-10 md:py-32">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/65">
          About
        </div>

        <h2 className="font-display uppercase max-w-4xl text-[clamp(1.8rem,5vw,4.2rem)] leading-[0.98] tracking-tight">
          {BIO_LEAD}
          <span className="text-accent">{BIO_ACCENT}</span>
          {BIO_TAIL}
        </h2>

        <p className="mt-7 max-w-md text-base leading-relaxed text-paper/80 md:text-lg">
          {BIO_SECONDARY}
        </p>

        <SocialLinks size={22} tone="paper" className="mt-8" />
      </div>
    </section>
  );
}
