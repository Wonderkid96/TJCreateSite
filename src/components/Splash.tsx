"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  fallingFramesProgress,
  fallingFramesReady,
  preloadFallingFrames,
  FALLING_FRAME_COUNT,
  FALLING_FRAME_HEIGHT,
  FALLING_FRAME_WIDTH,
  getFallingFrameByIndex,
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
      // Normal path: frames ready + min display time satisfied.
      if (fallingFramesReady() && now >= minEndsAt) {
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
            {/* Falling-man ping-pong — draws as frames arrive from R2 */}
            <PingPongCanvas />

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

/** Ping-pong canvas — falling-man frames cycling forward/back on the splash. */
function PingPongCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FPS = 24;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let dir = 1;
    let lastIdx = -1;
    const totalT = FALLING_FRAME_COUNT / FPS;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const delta = Math.min(0.1, (now - last) / 1000);
      last = now;
      t += dir * delta;
      if (t >= totalT) { t = totalT; dir = -1; }
      else if (t <= 0) { t = 0; dir = 1; }
      const idx = Math.min(FALLING_FRAME_COUNT - 1, Math.max(0, Math.floor(t * FPS)));
      const img = getFallingFrameByIndex(idx);
      if (!img || !img.complete || img.naturalWidth === 0) return;
      // Always draw if the frame changed OR if we've never drawn yet
      if (idx === lastIdx) return;
      lastIdx = idx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={FALLING_FRAME_WIDTH}
      height={FALLING_FRAME_HEIGHT}
      className="w-44 h-auto"
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 80% at 50% 50%, black 50%, transparent 90%)",
        maskImage:
          "radial-gradient(ellipse 70% 80% at 50% 50%, black 50%, transparent 90%)",
      }}
      aria-hidden
    />
  );
}
