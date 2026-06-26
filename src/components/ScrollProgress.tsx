"use client";

import { useEffect, useRef, useState } from "react";

// Hide the indicator this long after the user stops scrolling.
const IDLE_HIDE_MS = 900;

/**
 * Minimal scroll-progress hairline. A thin vertical line down the right edge
 * fills with the page's scroll progress and only shows while the user is
 * actively scrolling, fading out once they stop. mix-blend-difference keeps it
 * legible over both the light and dark sections. Desktop only — it would
 * crowd the narrow mobile viewport. Honours prefers-reduced-motion by staying
 * hidden (no fades, no distraction).
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      setVisible(true);
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setVisible(false), IDLE_HIDE_MS);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference transition-opacity duration-500 md:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-[34vh] w-px bg-white/25">
        <div
          className="absolute inset-x-0 top-0 bg-white"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
