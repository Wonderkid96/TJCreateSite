"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const VIDEO_SRC = "/work/imported/videos/intro-section.mp4";
const VIDEO_POSTER = "/work/imported/videos/intro-section-poster.jpg";
// Portrait 9:16 cut so the footage fills a phone without cropping.
const VIDEO_SRC_MOBILE = "/work/imported/videos/intro-section-mobile.mp4";
const VIDEO_POSTER_MOBILE = "/work/imported/videos/intro-section-mobile-poster.jpg";

const MOBILE_QUERY = "(max-width: 767px)";

// Viewport check via useSyncExternalStore: SSR/first hydration render assumes
// desktop (false), then resolves on the client — no setState-in-effect, so no
// hydration mismatch and no dev warning.
const subscribeViewport = (onChange: () => void) => {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const useIsMobile = () =>
  useSyncExternalStore(
    subscribeViewport,
    () => window.matchMedia(MOBILE_QUERY).matches,
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
 * Preloading: preload="auto" buffers the clip up front. An IntersectionObserver
 * only starts playback once it is on screen and pauses it when it leaves.
 */
export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  const src = isMobile ? VIDEO_SRC_MOBILE : VIDEO_SRC;
  const poster = isMobile ? VIDEO_POSTER_MOBILE : VIDEO_POSTER;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
  }, []);

  return (
    <section
      aria-label="Showreel"
      // Mobile: one viewport tall. Desktop: one viewport plus a short dwell so
      // the sticky frame pins centred. Brand-dark surround framing the video.
      className="relative h-svh w-full bg-ink md:h-[160svh]"
    >
      <div className="flex h-svh w-full items-center justify-center md:sticky md:top-0 md:p-10">
        {/* Mobile: the portrait cut is full-bleed, filling the whole section
            edge to edge (covers, dynamic to any phone). Desktop: padded,
            rounded frame on the red surround. */}
        <div className="relative h-full w-full overflow-hidden bg-ink md:rounded-2xl">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="auto"
            onEnded={(e) => {
              // Belt + braces: restart manually if the browser drops the loop.
              const el = e.currentTarget;
              el.currentTime = 0;
              el.play().catch(() => {});
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
