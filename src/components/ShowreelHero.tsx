"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";

const VIDEO_SRC = "/work/imported/videos/intro-section.mp4";
const VIDEO_POSTER = "/work/imported/videos/intro-section-poster.webp";

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Showreel hero — the whole hero IS the footage, statement overlaid at the foot.
 *
 * Owns id="top": the Nav's show/hide observer and the wordmark's "#top" anchor
 * both target it, inherited from the retired falling-clouds hero.
 *
 * One landscape (16:9) cut, used everywhere. Below the md breakpoint the
 * frame is portrait, so a second copy of the same clip sits behind it,
 * scaled up and blurred, filling the edges the sharp copy's object-contain
 * leaves bare — the sharp copy never gets cropped, and there's no manually
 * cut portrait edit to keep in sync. Autoplay is muted, looping and inline,
 * and is skipped for prefers-reduced-motion. The pause control is not
 * optional (WCAG 2.2.2 — anything moving over five seconds needs a stop).
 */
export default function ShowreelHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  // null = no explicit choice yet; autoplay applies unless reduced motion.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const wantsPlay = userPaused === null ? !reducedMotion : !userPaused;

  // Above the fold, so no lazy-promotion observer — but it still pauses once
  // scrolled past rather than decoding video nobody can see. Drives the
  // blurred backdrop copy in lockstep so a paused hero is fully paused.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && wantsPlay) {
          // Mobile browsers can still refuse a muted autoplay; the poster stays
          // up and the control is right there, so it is left paused.
          video.play().catch(() => {});
          bgVideoRef.current?.play().catch(() => {});
        } else {
          video.pause();
          bgVideoRef.current?.pause();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(video);
    return () => io.disconnect();
  }, [wantsPlay]);

  // The backdrop copy mounts/unmounts as isMobile flips (crossing the md
  // breakpoint on resize) — sync it to whatever the foreground copy is
  // actually doing right now, since the IntersectionObserver above only
  // re-fires on scroll, not on this element appearing.
  useEffect(() => {
    const bg = bgVideoRef.current;
    const video = videoRef.current;
    if (!bg || !video) return;
    if (video.paused) {
      bg.pause();
    } else {
      bg.play().catch(() => {});
    }
  }, [isMobile]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
      bgVideoRef.current?.play().catch(() => {});
    } else {
      setUserPaused(true);
      video.pause();
      bgVideoRef.current?.pause();
    }
  };

  return (
    // Pin-and-reveal: this outer box is 2 viewports tall so the hero (sticky,
    // pinned to top:0 inside it) holds still for a full extra scroll before
    // WorkGallery's opaque section rises up and covers it from the bottom.
    // svh (not vh) on both this and the inner section, so mobile's collapsing
    // URL bar can't cause a jump — svh is already the smallest/safe value.
    // Requires nothing from Lenis: sticky is native-scroll-driven, and touch
    // devices already run native scroll (see SmoothScroll.tsx).
    <div className="relative h-[200svh]">
      <section
        id="top"
        // Full-bleed reel: the whole hero IS the footage. No plate, no band, no
        // gradient slab — the statement is overlaid on the video with only a
        // bottom scrim to hold legibility. bg-ink is just the pre-load ground.
        className="sticky top-0 z-0 h-svh min-h-[560px] w-full overflow-hidden bg-ink text-paper"
      >
      <h1 className="sr-only">Toby Johnson, freelance graphic and motion designer in Lincoln</h1>

      {/* Blurred backdrop: only needed below md, where object-contain leaves
          the frame's sides bare. Mounted conditionally so desktop never
          fetches a second copy of the clip. Decorative — hidden from AT and
          silently follows the foreground copy's play state above. */}
      {isMobile && (
        <video
          ref={bgVideoRef}
          src={VIDEO_SRC}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
        />
      )}

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
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-10 md:pb-14">
        <p className="max-w-xl text-base leading-snug text-paper md:text-lg">
          Graphic design, motion and 3D for brands, agencies and businesses.
          From campaign artwork and identity through to animation and 3D,
          based in Lincoln and working remotely.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5 md:mt-7 md:gap-3">
          <HeroButton href="#work" label="View work" />
          <HeroButton href="#contact" label="Email me" variant="outline" />
        </div>
      </div>

      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause showreel" : "Play showreel"}
        className="absolute right-4 top-24 z-10 rounded-full border border-paper/25 bg-ink/60 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper backdrop-blur transition-colors hover:border-paper/60 md:right-6"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      </section>
    </div>
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
