"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

const VIDEO_SRC = "/work/imported/videos/intro-section.mp4";
const VIDEO_POSTER = "/work/imported/videos/intro-section-poster.webp";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Showreel hero — the whole hero IS the footage, statement overlaid at the foot.
 *
 * Owns id="top": the Nav's show/hide observer and the wordmark's "#top" anchor
 * both target it, inherited from the retired falling-clouds hero.
 *
 * One landscape (16:9) cut, used everywhere. Below the md breakpoint the
 * frame is portrait, so a blurred copy of the poster fills the edges behind
 * the sharp, uncropped reel. Autoplay is muted, looping and inline, and is
 * skipped for prefers-reduced-motion. The pause control is not optional
 * (WCAG 2.2.2 — anything moving over five seconds needs a stop).
 */
export default function ShowreelHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  // null = no explicit choice yet; autoplay applies unless reduced motion.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const wantsPlay = userPaused === null ? !reducedMotion : !userPaused;

  // Above the fold, so no lazy-promotion observer — but it still pauses once
  // scrolled past rather than decoding video nobody can see.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && wantsPlay) {
          // Mobile browsers can still refuse a muted autoplay; the poster stays
          // up and the control is right there, so it is left paused.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(video);
    return () => io.disconnect();
  }, [wantsPlay]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  return (
    <section
      id="top"
      // Full-bleed reel: the whole hero IS the footage. No plate, no band, no
      // gradient slab — the statement is overlaid on the video with only a
      // bottom scrim to hold legibility. bg-ink is just the pre-load ground.
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-ink text-paper"
    >
      <h1 className="sr-only">Toby Johnson, freelance graphic and motion designer in Lincoln</h1>

      {/* Blurred poster backdrop: fills the portrait frame without downloading
          and decoding a second copy of the showreel. Desktop remains full-bleed. */}
      <div
        aria-hidden
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-60 blur-2xl md:hidden"
        style={{ backgroundImage: `url(${VIDEO_POSTER})` }}
      />

      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Showreel"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={(e) => {
          // Belt + braces: restart manually if the browser drops the loop.
          const el = e.currentTarget;
          el.currentTime = 0;
          el.play().catch(() => {});
        }}
        className="absolute inset-0 h-full w-full object-contain md:object-cover"
      />

      {/* Bottom-weighted scrim only: darkens the foot of the frame so the
          overlaid statement reads, while the top stays clear footage. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
      />

      {/* Statement overlaid on the footage, bottom-left. */}
      <div className="hero-introduction absolute inset-x-0 bottom-0 px-6 pb-10 md:px-10 md:pb-14">
        <p className="max-w-xl text-base leading-snug text-paper md:text-lg">
          I’m Toby, a freelance graphic and motion designer based in Lincoln.
          I work across campaign artwork, motion and 3D for brands, artists
          and agencies.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5 md:mt-7 md:gap-3">
          <HeroButton href="#work" label="View work" />
          <HeroButton href="#contact" label="Get in touch" variant="outline" />
        </div>
      </div>

      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause showreel" : "Play showreel"}
        // Quiet by default: this is a required control (WCAG 2.2.2), not a
        // feature worth advertising, so it sits back until hovered/focused
        // rather than reading as a second CTA in the top-right of the reel.
        // Still ≥24px on its shortest side (WCAG 2.5.8 target size).
        className="absolute right-4 top-24 z-10 rounded-full border border-paper/15 bg-ink/50 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/60 backdrop-blur transition-colors hover:border-paper/50 hover:text-paper focus-visible:border-paper/50 focus-visible:text-paper md:right-6"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </section>
  );
}

/**
 * Rectangular CTA: sharp 2px radius, red accent fill with ink text for the
 * primary (ink on accent passes AA where paper doesn't), a paper hairline
 * outline for the secondary.
 */
function HeroButton({
  href,
  label,
  variant = "accent",
}: {
  href: string;
  label: string;
  variant?: "accent" | "outline";
}) {
  const base =
    "hero-btn-lift inline-flex items-center justify-center rounded-[2px] px-6 py-3.5 text-[0.95rem] font-medium transition-[background-color,border-color,color,transform] duration-[220ms] ease-[var(--ease)]";
  const skin =
    variant === "accent"
      ? "bg-accent text-ink hover:bg-accent/85"
      : "border border-paper/40 text-paper hover:bg-paper hover:text-ink";

  return (
    <a href={href} className={`${base} ${skin}`}>
      {label}
    </a>
  );
}
