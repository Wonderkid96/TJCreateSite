"use client";

import { motion, AnimatePresence } from "motion/react";
import { EASE } from "@/lib/motion";
import { useEffect, useState } from "react";

const SESSION_KEY = "tjcreate.splashSeen";
// Fixed, self-contained duration. This used to block on the falling-man frame
// preload (fallingFramesReady / fallingFramesScrollReady) with a 3.5s ceiling,
// which scroll-locked every first-time visitor for 650ms-3500ms waiting on a
// decorative asset that belongs to one below-the-fold tile. FallingOnSky kicks
// off that preload itself on mount and already degrades gracefully while
// frames arrive, so there is nothing here worth waiting for.
const SHOW_MS = 900;

/**
 * First-visit brand moment. Holds for a fixed short beat, then fades out.
 * Deliberately NOT a real loading gate: it does not wait on any asset, so the
 * time to interactive is predictable rather than network-dependent. Skipped
 * entirely on subsequent navigations within the same session, and for
 * prefers-reduced-motion.
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

    // Users who have asked the OS for reduced motion get the splash skipped
    // entirely (WCAG 2.3.3 / 2.2.1). The progress bar and fade are decorative,
    // the site does not depend on them.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadySeen || prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
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
    const endsAt = mountedAt + SHOW_MS;
    let raf = 0;
    let finished = false;
    let hideTimeout = 0;
    // Only push a state update when the visible whole-percent changes —
    // the rAF loop runs at 60Hz but the bar only has ~100 distinct states.
    let lastPct = -1;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setProgress(1);
      hideTimeout = window.setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      }, 280);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      // Progress is the elapsed fraction of SHOW_MS, not asset progress. The
      // bar is a brand flourish; tying it to a real download is what made
      // dismissal unpredictable.
      const p = Math.min(1, (now - mountedAt) / SHOW_MS);
      const pct = Math.round(p * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        setProgress(p);
      }
      if (now >= endsAt) finish();
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hideTimeout);
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
          transition={{ duration: 0.45, ease: EASE }}
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
              {/* Wordmark matches the nav: display face at 400 (never bolded)
                  with the brand's -0.02em wordmark tracking. */}
              <div className="font-display text-ink text-2xl leading-none tracking-[-0.02em] inline-flex items-baseline">
                TJCREATE<span className="text-accent ml-[0.05em]">.</span>
              </div>
              {/* Progress bar — solid brand red. */}
              <div
                role="progressbar"
                aria-label="Loading site"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                className="relative h-[2px] w-full overflow-hidden bg-ink/10"
              >
                <div
                  className="absolute inset-y-0 left-0 will-change-transform"
                  style={{
                    width: "100%",
                    transform: `scaleX(${progress})`,
                    transformOrigin: "left",
                    transition: "transform 220ms var(--ease)",
                    background: "var(--accent)",
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

