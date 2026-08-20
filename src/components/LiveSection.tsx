"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { Project } from "@/lib/content";

// Deferred like WorkGallery's copy: click-only UI, so the chunk stays out of
// the initial bundle. Both call sites share the same async chunk.
const ProjectModal = dynamic(() => import("./ProjectModal"), { ssr: false });

// The most-viewed live visual: One Mississippi / Boutique Taberna, filmed for
// Mahogany in an abandoned warehouse (2019). Kept out of the PROJECTS array on
// purpose so it never appears in the Selected Work grid — it's a personal
// facet, surfaced only here. Reuses ProjectModal so it inherits the showcase
// modal's behaviour (portal, focus trap, Escape, muted autoplay with controls).
// `satisfies` keeps the literal's own types (image is known-present here),
// so no non-null assertion is needed at the <Image src> below.
const PERFORMANCE = {
  slug: "live-one-mississippi",
  title: "One Mississippi",
  client: "Mahogany",
  year: "2019",
  category: "Music",
  tags: ["Live", "Vocal"],
  blurb:
    "Before moving fully into design, I spent several years as a recording artist signed to Mahogany Recordings (2018–2022): three solo EPs, over 22 million streams, and a European tour supporting Jack Savoretti and Dotan. This is a live session, One Mississippi into Boutique Taberna, filmed in an abandoned warehouse. That background still feeds into how I work now, particularly around music, campaigns and building a visual world around an idea rather than treating every asset separately.",
  image: "/work/imported/live/one-mississippi-mahogany.jpg",
  alt: "Toby Johnson performing One Mississippi live for a Mahogany Session in an abandoned warehouse",
  previewYouTubeId: "r9tFqEYP7yo",
  bg: "#0a0a0a",
} satisfies Project;

// Spotify embed src (the `https://open.spotify.com/embed/...` URL from Share →
// Embed). Toby Johnson's artist page, dark theme.
const SPOTIFY_EMBED_URL =
  "https://open.spotify.com/embed/artist/6aWiYkCceJsc6lorPBdvIg?utm_source=generator&theme=0";

export default function LiveSection() {
  const [open, setOpen] = useState(false);
  // Latches true on first open so the dynamic modal chunk only downloads
  // then, but the component stays mounted for AnimatePresence's exit.
  const [modalWanted, setModalWanted] = useState(false);
  const openModal = () => {
    setModalWanted(true);
    setOpen(true);
  };

  return (
    <section
      id="live"
      aria-label="Toby Johnson live music"
      className="bg-ink text-paper px-6 py-24 md:px-10 md:py-36"
    >
      <div>
        <h2 className="font-display uppercase text-[clamp(1.6rem,4vw,2.8rem)] leading-[1.02] tracking-tight">
          My <span className="text-accent">Music.</span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-paper/80 md:text-lg">
          {PERFORMANCE.blurb}
        </p>
      </div>

      {/* Split: the live video on one side, the Spotify embed on the other. */}
      <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 md:items-stretch md:gap-8">
        {/* Video — click to open the performance in the showcase modal */}
        <button
          type="button"
          onClick={openModal}
          aria-label="Play One Mississippi, live Mahogany Session"
          className="group relative block h-full min-h-[320px] w-full overflow-hidden rounded-[10px] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:min-h-[420px]"
        >
          <Image
            src={PERFORMANCE.image}
            alt={PERFORMANCE.alt ?? PERFORMANCE.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
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

          {/* Title only — the mono kicker label was removed. */}
          <span className="absolute bottom-4 left-4 font-display text-xl uppercase leading-none tracking-tight md:text-2xl">
            {PERFORMANCE.title}
          </span>
        </button>

        {/* Spotify embed */}
        <div className="relative min-h-[320px] overflow-hidden rounded-[10px] bg-paper/5 md:min-h-[420px]">
          {SPOTIFY_EMBED_URL ? (
            <iframe
              src={SPOTIFY_EMBED_URL}
              title="Toby Johnson on Spotify"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
                Spotify embed
              </span>
              <span className="max-w-xs text-sm text-paper/40">
                Add the embed URL from Spotify (Share → Embed) to
                SPOTIFY_EMBED_URL.
              </span>
            </div>
          )}
        </div>
      </div>

      {modalWanted && (
        <ProjectModal
          project={open ? PERFORMANCE : null}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}
