"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  fallingFramesProgress,
  fallingFramesReady,
  preloadFallingFrames,
} from "@/lib/falling-frames";

const SESSION_KEY = "tjcreate.splashSeen";
// Minimum time the splash stays visible even if everything's already cached
// — a cold flash would feel janky. Also gives fonts a beat to settle.
const MIN_SHOW_MS = 650;

/**
 * First-visit loading gate. Shows a gradient progress bar tied to the
 * falling-man frame preload (the heaviest asset set on the page), locks
 * scroll until ready, then fades out. Skipped entirely on subsequent
 * navigations within the same session.
 */
export default function Splash() {
  // Start with `null` so SSR renders nothing — we decide on the client
  // whether to show the splash based on sessionStorage.
  const [visible, setVisible] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Private mode / disabled storage — just always show. Harmless.
    }

    if (alreadySeen) {
      setVisible(false);
      return;
    }

    setVisible(true);

    // Lock scroll: Lenis + native fallback. Restored when splash hides.
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const mountedAt = performance.now();
    const minEndsAt = mountedAt + MIN_SHOW_MS;
    let raf = 0;
    let finished = false;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      setProgress(fallingFramesProgress());
      const now = performance.now();
      if (fallingFramesReady() && now >= minEndsAt && !finished) {
        finished = true;
        cancelAnimationFrame(raf);
        setProgress(1);
        // Brief delay for the bar to visibly complete, then hide.
        window.setTimeout(() => {
          setVisible(false);
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {}
        }, 280);
      }
    };

    // Start preload + progress tracking.
    preloadFallingFrames();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // Always clean scroll lock when the splash unmounts / hides.
  useEffect(() => {
    if (visible === false) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          // Sits above everything including the nav (z-50) and back-to-top
          // (z-85), but below the theme's no-flash script.
          className="fixed inset-0 z-[120] flex items-center justify-center bg-paper"
        >
          <div className="flex flex-col items-center gap-6 px-6 w-full max-w-[320px]">
            <div className="font-sans font-bold text-ink text-2xl leading-none tracking-[-0.01em] inline-flex items-baseline">
              TJCREATE<span className="text-accent ml-[0.05em]">.</span>
            </div>
            {/* Gradient progress bar — red → lime → lilac, matches site palette. */}
            <div className="relative h-[2px] w-full overflow-hidden bg-ink/10">
              <div
                className="absolute inset-y-0 left-0 will-change-transform"
                style={{
                  width: "100%",
                  transform: `scaleX(${progress})`,
                  transformOrigin: "left",
                  transition: "transform 220ms cubic-bezier(.2,.8,.2,1)",
                  background:
                    "linear-gradient(90deg, #E6352A 0%, #C8DB45 50%, #C4A9D0 100%)",
                }}
              />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted tabular-nums">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
