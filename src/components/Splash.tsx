"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  fallingFramesProgress,
  fallingFramesReady,
  fallingFramesScrollReady,
  preloadFallingFrames,
} from "@/lib/falling-frames";

const SESSION_KEY = "tjcreate.splashSeen";
// Minimum time the splash stays visible even if everything's already cached
// — a cold flash would feel janky. Also gives fonts a beat to settle.
const MIN_SHOW_MS = 650;
// Hard ceiling: if frames never finish preloading (network blip, R2 outage,
// whatever), dismiss the splash anyway so the site stays usable. The falling
// animation will catch up as frames arrive — it already draws whatever's
// been decoded so far and skips frames that haven't.
const MAX_SHOW_MS = 3500;

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

    // Preload the Envelope3D chunk and its font while the splash is visible
    // so the 3D @ symbol is ready by the time the user scrolls to Contact.
    import("@/components/Envelope3D");
    fetch("/fonts/optimer_bold.typeface.json", { priority: "low" } as RequestInit);

    if (alreadySeen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    const hardDeadline = mountedAt + MAX_SHOW_MS;
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setProgress(1);
      window.setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      }, 280);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      setProgress(fallingFramesProgress());
      const now = performance.now();
      // Normal path: enough frames for smooth scroll viewing + min display
      // time satisfied. On fast connections fallingFramesReady() (all 82)
      // fires first; on slower mobile connections fallingFramesScrollReady()
      // (every 3rd frame) lets the splash dismiss sooner so the user isn't
      // staring at a loader while remaining frames fill in behind the scenes.
      if ((fallingFramesReady() || fallingFramesScrollReady()) && now >= minEndsAt) {
        finish();
        return;
      }
      // Failsafe: if we've been sitting here too long, dismiss anyway.
      // Blocking the whole page indefinitely on a network hiccup would
      // be worse than letting the animation catch up silently later.
      if (now >= hardDeadline) finish();
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

  // Manual skip — stops the rAF loop, restores scroll immediately, and
  // sets the sessionStorage flag so it won't show again this session.
  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          // Sits above everything including the nav (z-50) and back-to-top
          // (z-85), but below the theme's no-flash script.
          className="fixed inset-0 z-[120] flex items-center justify-center bg-paper"
        >
          {/* Skip / close button — belt-and-braces escape hatch so the
              splash can never trap the user even if the preload hangs. */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Skip intro"
            className="group absolute top-5 right-5 md:top-7 md:right-7 inline-flex items-center gap-2 px-3 py-2 rounded-full border border-ink/15 bg-paper hover:border-ink/40 transition-colors"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted group-hover:text-ink transition-colors">
              Skip
            </span>
            <span aria-hidden className="relative w-3.5 h-3.5">
              <span className="absolute inset-0 m-auto w-full h-px bg-current rotate-45" />
              <span className="absolute inset-0 m-auto w-full h-px bg-current -rotate-45" />
            </span>
          </button>

          <div className="flex flex-col items-center gap-8 px-6 w-full max-w-[300px]">
            <div className="w-full flex flex-col items-center gap-4">
              <div className="font-sans font-bold text-ink text-2xl leading-none tracking-[-0.01em] inline-flex items-baseline">
                TJCREATE<span className="text-accent ml-[0.05em]">.</span>
              </div>
              {/* Gradient progress bar */}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

