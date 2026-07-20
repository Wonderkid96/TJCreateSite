"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const VIDEO_SRC = "/work/imported/videos/intro-section.mp4";
const VIDEO_POSTER = "/work/imported/videos/intro-section-poster.webp";
// Portrait 9:16 cut so the footage fills a phone without cropping.
const VIDEO_SRC_MOBILE = "/work/imported/videos/intro-section-mobile.mp4";
const VIDEO_POSTER_MOBILE = "/work/imported/videos/intro-section-mobile-poster.webp";

const MOBILE_QUERY = "(max-width: 767px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Media-query subscription via useSyncExternalStore: SSR/first hydration
// render uses the fallback, then resolves on the client — no
// setState-in-effect, so no hydration mismatch and no dev warning.
const subscribeToQuery = (query: string) => (onChange: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const subscribeViewport = subscribeToQuery(MOBILE_QUERY);
const useIsMobile = () =>
  useSyncExternalStore(
    subscribeViewport,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  );
const subscribeReducedMotion = subscribeToQuery(REDUCED_MOTION_QUERY);
const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );

/**
 * Showreel. Two cuts of the intro: a landscape (16:9) cut on desktop and a
 * portrait (9:16) cut on mobile, chosen by viewport so only one ever loads.
 *
 * Desktop: the section is taller than the viewport and the frame is sticky, so
 * it pins centred and holds for a short dwell before releasing (the same
 * sticky-pin "lock" the other sections use). The footage covers the frame.
 *
 * Mobile: a full-height brand-red band with the portrait cut shown in its
 * natural 9:16 frame — fills the screen, no cropping.
 *
 * Loading: preload="metadata" keeps the initial page cheap (the full clip is
 * several MB). An IntersectionObserver with a one-viewport margin promotes the
 * video to full buffering just before it scrolls into view, and a second
 * observer starts/stops playback on screen. Autoplay is skipped for users with
 * prefers-reduced-motion; the pause/play control works for everyone
 * (WCAG 2.2.2).
 */
export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  // null = no explicit choice yet; autoplay applies unless reduced motion.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const src = isMobile ? VIDEO_SRC_MOBILE : VIDEO_SRC;
  const poster = isMobile ? VIDEO_POSTER_MOBILE : VIDEO_POSTER;

  const wantsPlay = userPaused === null ? !reducedMotion : !userPaused;

  // Start buffering the full clip one viewport ahead of arrival so it is
  // ready to play the moment it pins, without taxing visitors who never
  // scroll this far.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let promoted = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || promoted) return;
        promoted = true;
        video.preload = "auto";
        // Only force a load() while paused: on a jump-scroll straight into
        // the section the play observer can fire first, and load() would
        // abort that playback. A playing video is already fetching data.
        if (video.paused) {
          try {
            video.load();
          } catch {}
        }
        io.disconnect();
      },
      { rootMargin: "100% 0px" }
    );

    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  // Play while on screen (unless paused by the user or reduced motion),
  // pause when it leaves.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && wantsPlay) {
          video.play().catch(() => {
            // Autoplay can be refused on some mobile browsers; the poster
            // stays visible and we simply leave it paused rather than throw.
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
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
      aria-label="Showreel"
      // Mobile: one viewport tall. Desktop: one viewport plus a short dwell so
      // the sticky frame pins centred. Brand-dark surround framing the video.
      className="relative h-svh w-full bg-ink md:h-[160svh]"
    >
      {/* Every other section on the page is titled; this one is deliberately
          wordless by design, so the heading is visually hidden rather than
          absent. Without it the showreel is the only section with no heading
          for crawlers or screen-reader users to anchor to. */}
      <h2 className="sr-only">Showreel</h2>
      <div className="flex h-svh w-full items-center justify-center md:sticky md:top-0 md:p-10">
        {/* Mobile: the portrait cut is full-bleed, filling the whole section
            edge to edge (covers, dynamic to any phone). Desktop: padded,
            rounded frame on the red surround. */}
        <div className="relative h-full w-full overflow-hidden bg-ink md:rounded-[2px]">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={(e) => {
              // Belt + braces: restart manually if the browser drops the loop.
              const el = e.currentTarget;
              el.currentTime = 0;
              el.play().catch(() => {});
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause showreel" : "Play showreel"}
            className="absolute bottom-4 right-4 z-10 rounded-full border border-paper/25 bg-ink/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:border-paper/60 md:bottom-6 md:right-6"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </section>
  );
}
