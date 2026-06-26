"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { EASE } from "@/lib/motion";
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
  // Detect "mobile-ish" synchronously on first render so RAF-heavy effects
  // can short-circuit before they ever allocate. SSR returns false; the
  // resize/MQ listener below corrects it.
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

  // rAF draw loop — paints the current target frame to canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    let raf = 0;
    let lastDrawn = -1;

    const loop = () => {
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

      if (idx === lastDrawn) return;
      lastDrawn = idx;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll progress (0 → 1 across the hero's sticky scroll range).
  const progress = useMotionValue(0);

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

  // Detect touch/small viewports synchronously on mount so layout-sensitive
  // values (parallax layer widths, the canvas mask/drop-shadow) can switch to
  // their mobile variants without a flash.
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
          "--paper": "#fffdf8",
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
            // Slight saturation lift so the sky reads richer without tipping
            // into oversaturated — keeps the dark heading legible over it.
            className="object-cover object-top saturate-[1.2]"
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
          {/* Falling man — canvas driven by a rAF loop that paints one
              decoded frame per scroll position. A single drawImage per frame
              change; soft edges come from the CSS mask below, not per-frame
              canvas work. */}
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
            continuous loop so the motion itself reads as "scroll like this".
            Also a real link: clicking it jumps past the hero to the work grid,
            so the nudge doubles as a working control rather than pure decoration.
            Pointer events + tab focus are disabled while it's faded out so the
            invisible link can't swallow clicks or trap the keyboard. */}
        <motion.a
          href="#work"
          aria-label="Scroll to work"
          data-cursor="hover"
          tabIndex={showScrollPrompt ? 0 : -1}
          initial={{ opacity: 1 }}
          animate={{ opacity: showScrollPrompt ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`absolute hidden md:flex right-10 top-[24%] flex-col items-center will-change-transform font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70 ${
            showScrollPrompt ? "pointer-events-auto" : "pointer-events-none"
          }`}
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
        </motion.a>

        {/* Bottom stack */}
        <motion.div
          style={{ opacity: titleOpacity, x: titleX }}
          className="absolute inset-x-6 md:inset-x-10 bottom-5 sm:bottom-8 md:bottom-14 flex flex-col gap-4 sm:gap-5 md:gap-8 will-change-transform"
        >
          <h1
            // Solid ink, no mix-blend-multiply. Blending the heading against
            // the parallax sky forced a full-region layer composite on every
            // scroll paint; with the wide, heavy display face that overdraw
            // got expensive enough to read as scroll jank. Near-black ink reads
            // cleanly over the muted sky on its own — no glow needed.
            //
            // Set on a single line (whitespace-nowrap). The clamp is sized so
            // the wide expanded face still fits one line on small phones, and
            // stays deliberately restrained on desktop rather than filling the
            // full width.
            className="font-display uppercase hero-line whitespace-nowrap text-[clamp(1.35rem,7vw,1.85rem)] md:text-[clamp(2rem,4.4vw,3.6rem)] tracking-[-0.02em] text-ink"
          >
            {WORDS.join(" ")}
            <span className="text-accent">.</span>
          </h1>

          {/* Plain div, not a second motion layer. The drift/fade is owned
              entirely by the bottom-stack wrapper above so the heading,
              subtitle and buttons move as one coordinated unit. A second
              transform here made the subtitle drift and fade at roughly double
              the heading's rate, which read as the text "moving at different
              times". */}
          <div className="flex flex-col gap-5 md:gap-7">
            <p className="text-[0.95rem] sm:text-base md:text-xl leading-snug max-w-xl text-ink/90">
              {SUB}
            </p>

            <div className="flex flex-wrap gap-2.5 md:gap-3">
              <HeroButton href="#work" label="View work" />
              <HeroButton href="#contact" label="Email me" variant="outline" />
            </div>
          </div>
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
