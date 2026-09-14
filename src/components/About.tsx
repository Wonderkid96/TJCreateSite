"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { SocialLinks } from "./SocialIcons";

// ─── Copy ────────────────────────────────────────────────────────────────────

const BIO_LEAD = "A multidisciplinary designer working across ";
const BIO_ACCENT = "graphic design, motion and 3D";
const BIO_TAIL = " for brands, artists and agencies.";
const BIO_SECONDARY = [
  "I started in music, creating artwork and motion for artists and labels, including two years working with Marathon Music Group. My work now spans campaign visuals, social content and 3D for brands and agency teams.",
  "I can work from an existing creative direction, join an agency team, or take a project from the first idea through to finished assets.",
];

// Pin the palette dark so the overlaid copy stays readable in either theme,
// matching how Services/Contact lock their own dark backgrounds.
const DARK_VARS = {
  "--paper": "#ffffff",
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
      {/* Portrait anchored to the right at a natural scale. The image (4:5
          portrait) lives in a right-hand column so it isn't blown up to cover
          the whole landscape panel; the left stays dark for the copy. On
          mobile it covers the full panel. */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[56%] lg:w-[48%]">
        <Image
          src="/work/imported/portraits/toby-about.avif"
          alt="Portrait of Toby Johnson"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-[52%_40%]"
        />
        {/* Darken the portrait's left into the panel. Extended a few px past
            the image's left edge (-left-2) so the gradient always covers it,
            with no sub-pixel sliver of the bright backdrop showing as a seam. */}
        <div className="absolute inset-y-0 -left-2 right-0 hidden bg-gradient-to-r from-ink via-ink/40 to-[#0a0a0a00] md:block" />
      </div>
      {/* Mobile: darken so the copy stays legible over the full-bleed portrait. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/80 to-[#0a0a0a00] md:hidden" />

      <div className="about-content relative w-full px-6 py-16 md:px-10 md:py-20">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/65">
          About
        </div>

        <h2 className="section-heading">
          I&apos;m Toby<span className="text-accent">.</span>
        </h2>
        <p className="about-lead">
          {BIO_LEAD}
          <span>{BIO_ACCENT}</span>
          {BIO_TAIL}
        </p>

        <div className="about-body mt-7 flex max-w-lg flex-col gap-4 text-base leading-relaxed text-paper/80 md:text-lg">
          {BIO_SECONDARY.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>

        <SocialLinks size={22} tone="paper" className="mt-8" />
      </div>
    </section>
  );
}
