"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { SocialLinks } from "./SocialIcons";

// ─── Copy ────────────────────────────────────────────────────────────────────

const BIO_LEAD = "I'm Toby Johnson, a multidisciplinary designer working across ";
const BIO_ACCENT = "graphic design, motion and 3D";
const BIO_TAIL = " for brands, artists and agencies.";
const BIO_SECONDARY = [
  "I've worked independently across design and motion for over seven years, starting in music and increasingly working across brand, product and agency projects.",
  "A lot of my work crosses disciplines. An identity might need to become a campaign, a piece of artwork might need to move, or a product might need to be built in 3D before it can go anywhere. Being able to work across those stages means the same visual idea can carry through the whole job rather than feeling stitched together at the end.",
  "I can work from an existing creative direction, slot into an agency team, or take something from an early idea through to finished assets.",
];

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
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-[#0a0a0a00] md:hidden" />

      <div className="relative w-full px-6 py-16 md:px-10 md:py-20">
        <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/65">
          About
        </div>

        <h2 className="font-display uppercase max-w-4xl text-[clamp(1.8rem,5vw,4.2rem)] leading-[0.98] tracking-tight">
          {BIO_LEAD}
          <span className="text-accent">{BIO_ACCENT}</span>
          {BIO_TAIL}
        </h2>

        <div className="mt-7 flex max-w-lg flex-col gap-4 text-base leading-relaxed text-paper/80 md:text-lg">
          {BIO_SECONDARY.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>

        <SocialLinks size={22} tone="paper" className="mt-8" />
      </div>
    </section>
  );
}
