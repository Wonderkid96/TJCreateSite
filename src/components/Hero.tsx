"use client";

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
  "Graphic + motion designer building visual systems for record labels, artists, and ambitious brands.";

// Source image pixel dimensions expressed as width ÷ height.
// Used by safeTranslate to derive the rendered layer height at any viewport width.
const SKY_ASPECT = 1581 / 4451;   // sky-long.avif:   1581 px wide × 4451 px tall
const CLOUD_ASPECT = 3269 / 8125; // cloud-long.avif: 3269 px wide × 8125 px tall

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Target frame index, updated on every scroll event. A rAF loop reads
  // it and draws at most once per animation frame — keeps draws smooth
  // even when scroll events fire faster than 60Hz.
  const targetProgressRef = useRef(0);

  useEffect(() => {
    preloadFallingFrames();
  }, []);

  // rAF draw loop — paints the current target frame to canvas. Runs for
  // the life of the component; cheap when idle (draws only on change).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let lastDrawn = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = targetProgressRef.current;
      const idx = Math.min(
        FALLING_FRAME_COUNT - 1,
        Math.max(0, Math.floor(p * FALLING_FRAME_COUNT)),
      );
      if (idx === lastDrawn) return;
      const img = getFallingFrame(p);
      // Paint whatever is loaded now — don't gate on full readiness. The
      // first frame is available almost instantly since it starts loading
      // at the top of the module; subsequent frames fill in as they arrive.
      if (!img || !img.complete || img.naturalWidth === 0) return;
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Scroll -> target progress. Actual draw happens in the rAF loop above
  // so we never paint more than once per frame regardless of scroll rate.
  useMotionValueEvent(progress, "change", (p) => {
    targetProgressRef.current = p;
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
   */
  const safeTranslate = (aspect: number, p: number, widthVw = 100) => {
    if (typeof window === "undefined") return 0;
    const layerW = window.innerWidth * (widthVw / 100);
    const layerH = layerW / aspect;
    const max = Math.max(0, layerH - window.innerHeight);
    return -p * max;
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
  //
  // Scroll indicator — floats on the right edge, drifts downward as the
  // user scrolls. Fades in quickly at the start, holds through most of the
  // range, then fades out just before the hero unpins (threshold 0.72–0.88).
  const scrollIndicatorOpacity = useTransform(
    progress,
    [0, 0.06, 0.72, 0.88], // fade in → hold → fade out
    [0,    1,    1,    0],
  );
  const scrollIndicatorY = useTransform(
    progress,
    [0,    0.85],
    ["0%", "52%"], // drifts ~half the container height downward
  );

  // Title — slides in from the left on entry (0 → 0.18), holds position
  // through the middle of the scroll, then drifts fractionally rightward
  // at the end (parallax carry-through as the section unpins).
  const titleX = useTransform(
    progress,
    [0,      0.18,  0.6,  1],
    ["-30%", "0%", "1%", "2%"],
  );
  const titleOpacity = useTransform(
    progress,
    [0, 0.1,  0.92, 1],
    [0,   1,    1,   0.9],
  );

  // Subtitle — same drift logic as the title but enters slightly later
  // (0.08 → 0.25) to create a natural stagger between headline and sub-text.
  const subX = useTransform(
    progress,
    [0,      0.22,  0.6,  1],
    ["-20%", "0%", "1%", "2%"],
  );
  const subOpacity = useTransform(
    progress,
    [0.08, 0.25, 0.92, 1],
    [0,      1,    1,   0.9],
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
      className="relative w-full h-[260vh] sm:h-[280vh] md:h-[300vh] lg:h-[320vh]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#c9d8e2]">
        {/* Sky */}
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
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "url(/work/imported/bg/sky-long.avif)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center top",
            }}
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
          className={`absolute top-0 will-change-transform opacity-95${isMobile ? "" : " mix-blend-screen"}`}
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
              ImageBitmaps. See src/lib/falling-frames.ts. */}
          <canvas
            ref={canvasRef}
            width={FALLING_FRAME_WIDTH}
            height={FALLING_FRAME_HEIGHT}
            className="h-[42%] sm:h-[46%] md:h-[50%] lg:h-[56%] w-auto object-contain"
            style={{
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

        {/* Scroll indicator — floats on the right, drifts downward with
            scroll progress so it acts as a subtle live position marker.
            Extracted from the bottom-stack motion so it never slides away. */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity, y: scrollIndicatorY }}
          className="absolute hidden md:flex right-10 top-[28%] flex-col items-center gap-2 pointer-events-none will-change-transform font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60"
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            ↓
          </motion.span>
          <span>Scroll</span>
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
          <h1 className={`font-display hero-line text-[clamp(2.2rem,8.8vw,4.8rem)] md:text-[clamp(2.6rem,10vw,11rem)] tracking-[-0.035em] -ml-[0.02em] text-ink${isMobile ? "" : " mix-blend-multiply"}`}>
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
            className="flex flex-col gap-5 md:gap-7"
          >
            <p className="text-[0.95rem] sm:text-base md:text-xl leading-snug max-w-xl text-ink/90">
              {SUB}
            </p>

            <div className="flex flex-wrap gap-2.5 md:gap-3">
              <HeroButton href="#work" label="Portfolio." />
              <HeroButton href="#contact" label="Contact." variant="outline" />
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
