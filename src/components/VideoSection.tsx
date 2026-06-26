"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/work/imported/videos/intro-section.mp4";
const VIDEO_POSTER = "/work/imported/videos/intro-section-poster.jpg";

/**
 * Contained video band. On desktop the section is taller than the viewport and
 * the frame is sticky, so as the user scrolls in it pins centred and holds for
 * a short dwell before releasing — the same sticky-pin "lock" the Selected Work
 * and deck sections use, which is what reliably frames it centrally (a JS
 * scroll-snap fights Lenis and rarely catches). Mobile gets a plain full-height
 * frame with no pin, matching how the other sections drop pinning on touch.
 *
 * The rounded container fills the viewport minus equal padding and the footage
 * covers it (object-cover), so it always fills the frame edge to edge on any
 * screen, cropping slightly rather than letterboxing or warping.
 *
 * Preloading: preload="auto" buffers the clip up front so it is ready before
 * the user scrolls onto it. An IntersectionObserver only starts playback once
 * it is on screen and pauses it when it leaves, so an off-screen loop never
 * burns CPU/battery.
 */
export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      // Desktop: one viewport tall plus a short dwell, so the sticky frame pins
      // centred and holds before releasing. Mobile: just one viewport tall.
      className="relative h-svh w-full bg-paper md:h-[160svh]"
    >
      <div className="sticky top-0 h-svh w-full p-6 md:p-10">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-ink">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
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
