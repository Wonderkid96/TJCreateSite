"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  FALLING_FRAME_COUNT,
  FALLING_FRAME_HEIGHT,
  FALLING_FRAME_WIDTH,
  getFallingFrame,
  preloadFallingFrames,
} from "@/lib/falling-frames";

const WORDS = ["Toby", "Johnson"];
const SUB =
  "Graphic and motion design for record labels, artists and brands. Campaign artwork, identity, motion and 3D, based in Lincoln and working remotely.";

// Source image pixel dimensions expressed as width ÷ height.
// Used by safeTranslate to derive the rendered layer height at any viewport width.
const SKY_ASPECT = 1581 / 4451;   // sky-long.avif:   1581 px wide × 4451 px tall
const CLOUD_ASPECT = 3269 / 8125; // cloud-long.avif: 3269 px wide × 8125 px tall

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollVelRef      = useRef(0);   // smoothed absolute velocity in px/s
  const scrollVelSignedRef = useRef(0);  // smoothed signed velocity in px/s
  const scrollRangeRef    = useRef(1);   // total hero scroll range in px (breakpoint-aware)
  const lastScrollEventRef = useRef(0);  // performance.now() of last scroll tick
  // Detect "mobile-ish" synchronously on first render so RAF-heavy effects
  // (speed lines, velocity tracking) can short-circuit before they ever
  // allocate. SSR returns false; the resize/MQ listener below corrects it.
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef       = useRef(isMobile);
  // Mirror state into a ref so non-React hot paths (canvas RAF closures
  // captured at mount) can read the latest value without re-binding.
  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);
  // Cached viewport dimensions — read once on mount + on resize, instead
  // of inside useTransform on every scroll tick. Mobile scroll is sensitive
  // to any window.innerWidth/innerHeight reads in hot paths.
  const dimsRef           = useRef({ vw: 0, vh: 0 });
  // Target frame index, updated on every scroll event. A rAF loop reads
  // it and draws at most once per animation frame — keeps draws smooth
  // even when scroll events fire faster than 60Hz.
  const targetProgressRef = useRef(0);

  useEffect(() => {
    preloadFallingFrames();
  }, []);

  // rAF draw loop — paints the current target frame to canvas. Rather than
  // abstract "speed lines", fast scroll produces a velocity-driven smear on
  // the body itself: a few vertically offset ghost passes plus a tiny blur on
  // the live frame. The trail direction flips with scroll direction.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    let raf = 0;
    let lastDrawn = -1;
    let lastTrail = 0;
    let drivenTrail = 0;
    const TRAIL_SHOW = 360;
    const TRAIL_FULL = 1850;

    const drawFeatheredFrame = (
      image: HTMLImageElement,
      blurPx = 0.75,
      chokePx = 0.9,
    ) => {
      // Base draw.
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Gentle matte cleanup: slightly contract the alpha, then blur the mask
      // a fraction so the white fringe and stair-stepping on the cutout edge
      // do not read as harsh pixels at large desktop sizes.
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.filter = `blur(${blurPx}px)`;
      ctx.drawImage(
        image,
        chokePx,
        chokePx,
        canvas.width - chokePx * 2,
        canvas.height - chokePx * 2,
      );
      ctx.restore();
    };

    const drawEdgeStroke = (
      image: HTMLImageElement,
      strength = 0.18,
    ) => {
      // Rebuild the white contour from tiny sub-pixel halo passes rather than
      // trusting the baked frame edge. This smooths the highlight without
      // drawing a chunky new outer stroke.
      const passes = [
        { dx: -0.45, dy: 0, alpha: 0.18 },
        { dx: 0.45, dy: 0, alpha: 0.18 },
        { dx: 0, dy: -0.45, alpha: 0.16 },
        { dx: 0, dy: 0.45, alpha: 0.16 },
        { dx: -0.35, dy: -0.35, alpha: 0.11 },
        { dx: 0.35, dy: -0.35, alpha: 0.11 },
        { dx: -0.35, dy: 0.35, alpha: 0.11 },
        { dx: 0.35, dy: 0.35, alpha: 0.11 },
      ];

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.filter = "blur(0.45px)";
      for (const pass of passes) {
        ctx.globalAlpha = strength * pass.alpha;
        ctx.drawImage(
          image,
          pass.dx,
          pass.dy,
          canvas.width,
          canvas.height,
        );
      }
      ctx.restore();
    };

    const loop = (ts: DOMHighResTimeStamp) => {
      raf = requestAnimationFrame(loop);
      const p = targetProgressRef.current;
      const idx = Math.min(
        FALLING_FRAME_COUNT - 1,
        Math.max(0, Math.floor(p * FALLING_FRAME_COUNT)),
      );
      const img = getFallingFrame(p);
      // Paint whatever is loaded now — don't gate on full readiness. The
      // first frame is available almost instantly since it starts loading
      // at the top of the module; subsequent frames fill in as they arrive.
      if (!img || !img.complete || img.naturalWidth === 0) return;

      if (ts - lastScrollEventRef.current > 80) scrollVelSignedRef.current = 0;
      const rawSigned = scrollVelSignedRef.current;
      drivenTrail += (rawSigned - drivenTrail) * (Math.abs(rawSigned) > Math.abs(drivenTrail) ? 0.28 : 0.16);

      const trailT = Math.max(
        0,
        Math.min(1, (Math.abs(drivenTrail) - TRAIL_SHOW) / (TRAIL_FULL - TRAIL_SHOW)),
      );
      const trailPx = trailT * 34;

      if (idx === lastDrawn && Math.abs(trailPx - lastTrail) < 0.35) return;
      lastDrawn = idx;
      lastTrail = trailPx;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trailT > 0.01) {
        const dir = Math.sign(drivenTrail) || 1;
        const ghostCount = 4;

        // Sky wake — keeps the sense of speed in the background under the
        // body instead of smearing the figure itself.
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.filter = `blur(${8 + trailT * 14}px)`;
        const wakeCenterX = canvas.width * 0.5;
        const wakeTop = canvas.height * 0.44;
        const wakeLen = 38 + trailPx * 2.1;
        const wakeWidth = canvas.width * (0.08 + trailT * 0.05);
        const wake = ctx.createLinearGradient(
          wakeCenterX,
          wakeTop,
          wakeCenterX,
          wakeTop + wakeLen,
        );
        wake.addColorStop(0, "rgba(255,255,255,0)");
        wake.addColorStop(0.22, `rgba(255,255,255,${0.04 + trailT * 0.06})`);
        wake.addColorStop(0.55, `rgba(190,235,255,${0.06 + trailT * 0.08})`);
        wake.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = wake;
        ctx.fillRect(
          wakeCenterX - wakeWidth * 0.5,
          wakeTop,
          wakeWidth,
          wakeLen,
        );

        const sideWakeOffset = canvas.width * 0.08;
        for (const side of [-1, 1]) {
          const sideWake = ctx.createLinearGradient(
            wakeCenterX + side * sideWakeOffset,
            wakeTop + 10,
            wakeCenterX + side * sideWakeOffset,
            wakeTop + wakeLen * 0.92,
          );
          sideWake.addColorStop(0, "rgba(255,255,255,0)");
          sideWake.addColorStop(0.35, `rgba(180,225,255,${0.035 + trailT * 0.05})`);
          sideWake.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = sideWake;
          ctx.fillRect(
            wakeCenterX + side * sideWakeOffset - wakeWidth * 0.22,
            wakeTop + 6,
            wakeWidth * 0.44,
            wakeLen * 0.92,
          );
        }
        ctx.restore();

        for (let i = ghostCount; i >= 1; i--) {
          const t = i / ghostCount;
          const y = -dir * trailPx * t;
          const stretch = 1 + t * 0.11 * trailT;
          const alpha = 0.045 + t * 0.075 * trailT;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.filter = `blur(${0.8 + t * 1.6}px) saturate(1.04)`;
          ctx.translate(0, y - (canvas.height * (stretch - 1) * 0.5));
          ctx.scale(1, stretch);
          drawFeatheredFrame(img, 0.9, 1.1);
          ctx.restore();
        }

        // Velocity filaments — thin white shear lines that hug the figure
        // rather than screen-wide streaks. Think condensation off an edge,
        // driven by the body's movement through air.
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.filter = `blur(${0.4 + trailT * 0.9}px)`;

        const centerX = canvas.width * 0.5;
        const centerY = canvas.height * 0.5;
        const baseLen = 9 + trailPx * 0.95;
        const sideOffset = canvas.width * 0.11;
        const topOffset = canvas.height * 0.13;
        const lowerOffset = canvas.height * 0.06;
        const filamentSets = [
          { x: centerX - sideOffset, y: centerY - topOffset, len: baseLen * 0.95, width: 0.9 + trailT * 0.45 },
          { x: centerX + sideOffset, y: centerY - topOffset * 0.92, len: baseLen * 1.05, width: 0.85 + trailT * 0.4 },
          { x: centerX - sideOffset * 0.62, y: centerY + lowerOffset, len: baseLen * 0.72, width: 0.7 + trailT * 0.35 },
          { x: centerX + sideOffset * 0.66, y: centerY + lowerOffset * 1.05, len: baseLen * 0.76, width: 0.7 + trailT * 0.35 },
        ];

        filamentSets.forEach((filament, index) => {
          const sway = (index % 2 === 0 ? -1 : 1) * trailT * 1.8;
          const y0 = filament.y - dir * 2;
          const y1 = filament.y - dir * filament.len;
          const x0 = filament.x;
          const x1 = filament.x + sway;
          const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
          gradient.addColorStop(0, `rgba(255,255,255,${0.6 + trailT * 0.2})`);
          gradient.addColorStop(0.35, `rgba(255,255,255,${0.3 + trailT * 0.2})`);
          gradient.addColorStop(1, "rgba(255,255,255,0)");
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = filament.width;
          ctx.stroke();
        });

        // A faint centre filament stops the effect reading as four detached
        // strokes and helps tie it back into the body's spine.
        const centerGrad = ctx.createLinearGradient(
          centerX,
          centerY - dir * 4,
          centerX,
          centerY - dir * (baseLen * 0.9),
        );
        centerGrad.addColorStop(0, `rgba(255,255,255,${0.34 + trailT * 0.16})`);
        centerGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - dir * 4);
        ctx.lineTo(centerX, centerY - dir * (baseLen * 0.9));
        ctx.strokeStyle = centerGrad;
        ctx.lineWidth = 0.6 + trailT * 0.3;
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.filter = "none";
      drawFeatheredFrame(img, 0.68, 0.82);
      drawEdgeStroke(img, 0.16);
      ctx.restore();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll progress (0 → 1 across the hero's sticky scroll range).
  const progress = useMotionValue(0);

  // ── Motion-trail velocity tracking ───────────────────────────────────────
  // Converts scroll progress/s → physical px/s using the live scroll range.
  // This makes thresholds consistent across all breakpoints: a 500 px/s scroll
  // always feels the same whether the hero is 260 vh (mobile) or 320 vh (lg).
  useEffect(() => {
    let smoothSigned = 0;
    let lastP = 0;
    let lastT = performance.now();

    const unsubscribe = progress.on("change", (p: number) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const rawSigned = ((p - lastP) / (dt * 0.001)) * scrollRangeRef.current;
      smoothSigned += (rawSigned - smoothSigned) * (Math.abs(rawSigned) > Math.abs(smoothSigned) ? 0.55 : 0.14);
      scrollVelSignedRef.current = smoothSigned;
      scrollVelRef.current = Math.abs(smoothSigned);
      lastScrollEventRef.current = now;
      lastP = p;
      lastT = now;
    });

    return unsubscribe;
  }, [progress]);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    // Cached dimensions — only recomputed on resize.
    let sectionTopAbs = 0;
    let sectionH = 0;
    let vh = 0;
    const measure = () => {
      const rect = section.getBoundingClientRect();
      sectionTopAbs = rect.top + window.scrollY;
      sectionH = rect.height;
      vh = window.innerHeight;
      // Keep the scroll range ref in sync so velocity tracking can
      // convert progress/s → px/s regardless of which breakpoint is active.
      scrollRangeRef.current = Math.max(1, sectionH - vh);
      // Cache viewport dims for the parallax transforms — these run on
      // every scroll tick, so reading window.* there is wasteful.
      dimsRef.current = { vw: window.innerWidth, vh };
    };

    const compute = (scrollY: number) => {
      const rectTop = sectionTopAbs - scrollY;
      const total = sectionH - vh;
      const scrolled = Math.max(0, Math.min(total, -rectTop));
      progress.set(total > 0 ? scrolled / total : 0);
    };

    measure();
    compute(window.scrollY);

    // Subscribe to Lenis's scroll event when available — synced to its
    // interpolation clock, no double-buffering with the browser's scroll event.
    type LenisLite = {
      on: (e: string, cb: (d: { scroll: number }) => void) => void;
      off?: (e: string, cb: (d: { scroll: number }) => void) => void;
    };
    const lenis = (window as unknown as { __lenis?: LenisLite }).__lenis;

    let cleanupScroll: () => void;
    if (lenis && typeof lenis.on === "function") {
      const handler = ({ scroll }: { scroll: number }) => compute(scroll);
      lenis.on("scroll", handler);
      cleanupScroll = () => lenis.off?.("scroll", handler);
    } else {
      let raf = 0;
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          compute(window.scrollY);
          raf = 0;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanupScroll = () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
      };
    }

    const onResize = () => {
      measure();
      compute(window.scrollY);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cleanupScroll();
      window.removeEventListener("resize", onResize);
    };
  }, [progress]);

  // Detect touch/small viewports synchronously on mount so subsequent
  // effects (speed lines, etc.) can short-circuit before allocating RAF
  // loops they're never going to use on mobile.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const sync = () => { setIsMobile(mq.matches); isMobileRef.current = mq.matches; };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Scroll prompt — visible on first paint to nudge the user. Hides
  // while they're actively moving, returns after 3s of stillness so the
  // hint reappears if they pause without progressing. Permanently
  // dismissed once 70% of the hero has been consumed (they've got it).
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const scrollPromptIdleRef = useRef<number | null>(null);
  const scrollPromptDismissedRef = useRef(false);
  const lastPromptProgressRef = useRef(0);

  // Scroll -> target progress. Actual draw happens in the rAF loop above
  // so we never paint more than once per frame regardless of scroll rate.
  // Doubles as the visibility driver for the scroll prompt: any meaningful
  // movement hides it, a 3 s idle window brings it back, crossing 70 %
  // dismisses it for the rest of the session.
  useMotionValueEvent(progress, "change", (p) => {
    targetProgressRef.current = p;

    if (scrollPromptDismissedRef.current) return;

    const movement = Math.abs(p - lastPromptProgressRef.current);
    lastPromptProgressRef.current = p;
    // Ignore Lenis settle and sub-pixel jitter so the prompt doesn't flicker.
    if (movement < 0.005) return;

    if (p > 0.7) {
      scrollPromptDismissedRef.current = true;
      setShowScrollPrompt(false);
      if (scrollPromptIdleRef.current) {
        window.clearTimeout(scrollPromptIdleRef.current);
        scrollPromptIdleRef.current = null;
      }
      return;
    }

    setShowScrollPrompt(false);
    if (scrollPromptIdleRef.current) {
      window.clearTimeout(scrollPromptIdleRef.current);
    }
    scrollPromptIdleRef.current = window.setTimeout(() => {
      if (!scrollPromptDismissedRef.current) setShowScrollPrompt(true);
    }, 3000);
  });

  // Responsive parallax — translate each layer by (layerH − viewportH) at max
  // scroll so the image always fully covers the viewport.
  //
  // Mobile layers are intentionally wider than 100vw so the extra height created
  // by the larger width gives enough vertical travel for the parallax without
  // revealing bare edges at the sides.
  const skyWidthVw = isMobile ? 132 : 100;
  const cloudWidthVw = isMobile ? 144 : 100;

  /**
   * Returns the Y offset (px) for a parallax layer at scroll progress `p` (0–1).
   * Computes the maximum possible shift as (layerHeight − viewportHeight) so the
   * image travels exactly as far as needed — never over- or under-shooting.
   *
   * Reads cached viewport dims (synced in measure()/onResize) so the hot
   * scroll path never touches window.innerWidth/innerHeight directly.
   */
  const safeTranslate = (aspect: number, p: number, widthVw = 100) => {
    const { vw, vh } = dimsRef.current;
    if (vw === 0) return 0;
    const layerW = vw * (widthVw / 100);
    const layerH = layerW / aspect;
    return -p * Math.max(0, layerH - vh);
  };
  const skyY = useTransform(progress, (p) =>
    safeTranslate(SKY_ASPECT, p, skyWidthVw)
  );
  const cloudY = useTransform(progress, (p) =>
    safeTranslate(CLOUD_ASPECT, p, cloudWidthVw)
  );

  const fallingScale = useTransform(progress, [0, 0.5, 1], [0.98, 1, 1.04]);

  // ─── Scroll-driven animation choreography ────────────────────────────────
  //
  // All values below are progress thresholds in the range [0, 1] where:
  //   0   = hero scroll start (page top)
  //   1   = hero scroll end (section fully consumed, about to unpin)

  // Detect prefers-reduced-motion so the descending arrow loop can be
  // swapped for a static glyph. Live-listens for system pref changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Clean up the idle timer on unmount so a queued reappear can't fire
  // after the hero has gone away.
  useEffect(
    () => () => {
      if (scrollPromptIdleRef.current) {
        window.clearTimeout(scrollPromptIdleRef.current);
      }
    },
    [],
  );

  // Title — slides in from the left on entry (0 → 0.18), holds position
  // through the middle of the scroll, then drifts fractionally rightward
  // at the end (parallax carry-through as the section unpins).
  const titleX = useTransform(
    progress,
    [0, 0.6, 1],
    ["0%", "1%", "2%"],
  );
  const titleOpacity = useTransform(
    progress,
    [0, 0.92, 1],
    [1, 1, 0.9],
  );

  // Subtitle — same drift logic as the title but enters slightly later
  // (0.08 → 0.25) to create a natural stagger between headline and sub-text.
  const subX = useTransform(
    progress,
    [0, 0.6, 1],
    ["0%", "1%", "2%"],
  );
  const subOpacity = useTransform(
    progress,
    [0, 0.92, 1],
    [1, 1, 0.9],
  );

  return (
    <section
      id="top"
      aria-label="Toby Johnson — intro"
      ref={ref}
      // Keep hero typography/controls in a fixed ink-on-paper palette in both
      // light and dark modes; clouds stay bright so dark text reads best.
      style={
        {
          "--ink": "#0a0a0a",
          "--paper": "#f4f1e9",
        } as React.CSSProperties
      }
      className="relative w-full h-[260vh] sm:h-[280vh] md:h-[300vh] lg:h-[320vh] bg-[#c9d8e2]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#c9d8e2] isolate">
        {/* Sky. Rendered as a Next.js Image with priority so the browser
            treats it as the LCP candidate and fetches it before anything
            else. Previously this was a CSS background-image, which
            does not benefit from priority hints and could paint after
            the splash dismissed, leaving a brief flash of the section
            fallback colour. */}
        <motion.div
          style={{
            y: skyY,
            x: "-50%",
            left: "50%",
            width: `${skyWidthVw}vw`,
            height: `calc(${skyWidthVw}vw / ${SKY_ASPECT})`,
          }}
          className="absolute top-0 will-change-transform"
        >
          <Image
            src="/work/imported/bg/sky-long.avif"
            alt=""
            fill
            priority
            sizes={`${skyWidthVw}vw`}
            className="object-cover object-top"
          />
        </motion.div>

        {/* Clouds */}
        <motion.div
          style={{
            y: cloudY,
            x: "-50%",
            left: "50%",
            width: `${cloudWidthVw}vw`,
            height: `calc(${cloudWidthVw}vw / ${CLOUD_ASPECT})`,
          }}
          className="absolute top-0 will-change-transform opacity-95 mix-blend-screen"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "url(/work/imported/bg/cloud-long.avif)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center top",
            }}
          />
        </motion.div>

        {/* Falling man */}
        <motion.div
          style={{ scale: fallingScale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
        >
          {/* Falling man — canvas driven by rAF draws of pre-decoded
              ImageBitmaps. Fast scroll adds a velocity-driven smear to
              the body itself instead of decorative screen-wide streaks. */}
          <canvas
            ref={canvasRef}
            width={FALLING_FRAME_WIDTH}
            height={FALLING_FRAME_HEIGHT}
            className="h-[42%] sm:h-[46%] md:h-[50%] lg:h-[56%] w-auto object-contain"
            style={isMobile ? undefined : {
              WebkitMaskImage:
                "radial-gradient(ellipse 55% 70% at 50% 48%, black 58%, transparent 92%)",
              maskImage:
                "radial-gradient(ellipse 55% 70% at 50% 48%, black 58%, transparent 92%)",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))",
            }}
          />
        </motion.div>

        {/* Vignette — passive, no cursor-tracking */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.2)_100%)]" />

        {/* Scroll prompt — visible from first paint, hides on scroll, returns
            after 3 s of stillness, dismissed permanently past 70 % of the
            hero. The capsule (circle + arrow + label) drifts downward on a
            continuous loop so the motion itself reads as "scroll like this". */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: showScrollPrompt ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute hidden md:flex right-10 top-[24%] flex-col items-center pointer-events-none will-change-transform font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70"
        >
          {reducedMotion ? (
            // Static fallback — no drift, no fade cycle. Circle stays put
            // so the visual idea (capsule with arrow + label) is intact.
            <div className="relative flex h-[78px] w-[78px] flex-col items-center justify-center gap-1.5">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-ink/25 bg-ink/[0.04]"
              />
              <span aria-hidden className="relative text-[14px] leading-none">↓</span>
              <span className="relative">Scroll</span>
            </div>
          ) : (
            <motion.div
              className="relative flex h-[78px] w-[78px] flex-col items-center justify-center gap-1.5"
              animate={{ y: [0, 0, 110, 110] }}
              transition={{
                // 2.4 s cycle: ~0.4 s settle, ~1.5 s drift, ~0.4 s release.
                duration: 2.4,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1],
                times: [0, 0.18, 0.82, 1],
              }}
            >
              {/* Circle bg — fades in slightly after the text so it reads
                  as appearing behind the label, not wrapping it from
                  the start. Holds during the drift, fades out at bottom. */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border border-ink/30 bg-ink/[0.04]"
                animate={{ opacity: [0, 0, 1, 1, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.08, 0.22, 0.82, 1],
                }}
              />
              {/* Arrow + label — share a single fade so they always
                  appear/disappear together. Drift comes from the parent. */}
              <motion.div
                className="relative flex flex-col items-center gap-1.5"
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.1, 0.82, 1],
                }}
              >
                <span aria-hidden className="text-[14px] leading-none">↓</span>
                <span>Scroll</span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Top chrome */}
        <div className="absolute top-24 md:top-28 inset-x-6 md:inset-x-10 flex items-center justify-end font-mono text-[11px] uppercase tracking-[0.2em]">
          <span className="hidden md:inline text-white/85">
            Est. Lincoln, UK
          </span>
        </div>

        {/* Bottom stack */}
        <motion.div
          style={{ opacity: titleOpacity, x: titleX }}
          className="absolute inset-x-6 md:inset-x-10 bottom-5 sm:bottom-8 md:bottom-14 flex flex-col gap-4 sm:gap-5 md:gap-8 will-change-transform"
        >
          <h1
            // mix-blend-multiply on a large display heading forces a layer
            // composite on every paint as the parallax bg slides under it.
            // On mobile that's a lot of overdraw for marginal aesthetic
            // benefit, so drop the blend mode there. A faint cream
            // text-shadow restores readability over the busy cloud layer.
            className={
              "font-display hero-line text-[clamp(2.2rem,8.8vw,4.8rem)] md:text-[clamp(2.6rem,10vw,11rem)] tracking-[-0.025em] md:tracking-[-0.035em] text-ink" +
              (isMobile ? "" : " mix-blend-multiply")
            }
            style={isMobile ? { textShadow: "0 1px 14px rgba(244,241,233,0.45)" } : undefined}
          >
            {WORDS.map((w) => (
              <span key={w} className="block">
                {w === "Johnson" ? (
                  <>
                    <span className="italic">J</span>ohnson
                    <span className="text-accent">.</span>
                  </>
                ) : (
                  w
                )}
              </span>
            ))}
          </h1>

          <motion.div
            style={{ opacity: subOpacity, x: subX }}
            className="flex flex-col gap-5 md:gap-7 will-change-transform"
          >
            <p className="text-[0.95rem] sm:text-base md:text-xl leading-snug max-w-xl text-ink/90">
              {SUB}
            </p>

            <div className="flex flex-wrap gap-2.5 md:gap-3">
              <HeroButton href="#work" label="View work" />
              <HeroButton href="#contact" label="Email me" variant="outline" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroButton({
  href,
  label,
  variant = "solid",
}: {
  href: string;
  label: string;
  variant?: "solid" | "outline";
}) {
  const base =
    "hero-btn-lift relative inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-full font-sans font-semibold tracking-tight text-base md:text-lg transition-colors transition-transform duration-300";
  const skin =
    variant === "solid"
      ? "border border-ink bg-ink text-paper hover:border-accent hover:bg-accent"
      : "border border-ink text-ink hover:border-accent hover:text-accent";

  return (
    <a href={href} data-cursor="hover" className={`${base} ${skin}`}>
      <span className="relative z-10 tabular-nums">{label}</span>
      <span className="relative z-10">→</span>
    </a>
  );
}
