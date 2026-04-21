"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import ScrambleText from "./ScrambleText";

const WORDS = ["Toby", "Johnson"];
const SUB =
  "Graphic + motion designer building visual systems for record labels, artists, and ambitious brands.";

const SKY_ASPECT = 1581 / 4451;
const CLOUD_ASPECT = 3269 / 8125;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Scroll-scrub the falling-man video.
  useMotionValueEvent(progress, "change", (p) => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    v.currentTime = Math.min(v.duration - 0.05, p * v.duration);
  });

  // Responsive parallax — translate each layer by (layerH - viewportH) at max
  // scroll so the image always fully covers the viewport.
  const safeTranslate = (aspect: number, p: number) => {
    if (typeof window === "undefined") return 0;
    const layerH = window.innerWidth / aspect;
    const max = Math.max(0, layerH - window.innerHeight);
    return -p * max;
  };
  const skyY = useTransform(progress, (p) => safeTranslate(SKY_ASPECT, p));
  const cloudY = useTransform(progress, (p) => safeTranslate(CLOUD_ASPECT, p));

  const fallingScale = useTransform(progress, [0, 0.5, 1], [0.98, 1, 1.04]);

  // Title + sub — slide in from left, drift continuously (never static, never
  // off-screen), scroll carries them upward at the end via the natural sticky
  // unpin.
  const titleX = useTransform(
    progress,
    [0, 0.18, 0.6, 1],
    ["-30%", "0%", "1%", "2%"],
  );
  const titleOpacity = useTransform(progress, [0, 0.1, 0.92, 1], [0, 1, 1, 0.9]);
  const subX = useTransform(
    progress,
    [0, 0.22, 0.6, 1],
    ["-20%", "0%", "1%", "2%"],
  );
  const subOpacity = useTransform(
    progress,
    [0.08, 0.25, 0.92, 1],
    [0, 1, 1, 0.9],
  );

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full h-[260vh] sm:h-[280vh] md:h-[300vh] lg:h-[320vh]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#c9d8e2]">
        {/* Sky */}
        <motion.div
          style={{ y: skyY, height: `calc(100vw / ${SKY_ASPECT})` }}
          className="absolute inset-x-0 top-0 w-full will-change-transform"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "url(/work/imported/bg/sky-long.avif)",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          />
        </motion.div>

        {/* Clouds */}
        <motion.div
          style={{ y: cloudY, height: `calc(100vw / ${CLOUD_ASPECT})` }}
          className="absolute inset-x-0 top-0 w-full will-change-transform mix-blend-screen opacity-95"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "url(/work/imported/bg/cloud-long.avif)",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          />
        </motion.div>

        {/* Falling man */}
        <motion.div
          style={{ scale: fallingScale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
        >
          <video
            ref={videoRef}
            src="/work/imported/motion/falling-alpha.mp4"
            muted
            playsInline
            preload="auto"
            className="h-[36%] sm:h-[42%] md:h-[50%] lg:h-[56%] w-auto object-contain"
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

        {/* Top chrome */}
        <div className="absolute top-24 md:top-28 inset-x-6 md:inset-x-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          <span>[ Portfolio / 2026 ]</span>
          <span className="hidden md:inline">
            Est. Lincoln, UK · Available for select projects
          </span>
        </div>

        {/* Bottom stack */}
        <motion.div
          style={{ opacity: titleOpacity, x: titleX }}
          className="absolute inset-x-6 md:inset-x-10 bottom-8 md:bottom-14 flex flex-col gap-5 md:gap-8 will-change-transform"
        >
          <h1 className="font-display hero-line text-[clamp(2.6rem,10vw,11rem)] tracking-[-0.035em] -ml-[0.02em] text-ink mix-blend-multiply">
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <p className="md:col-span-8 text-base md:text-xl leading-snug max-w-xl text-ink/90">
                {SUB}
              </p>

              <div className="hidden md:flex md:col-span-4 md:justify-end font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 text-right">
                <div>
                  <div>↓</div>
                  <div className="mt-2">Scroll</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
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
  const [hovered, setHovered] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const anchorRef = useRef<HTMLAnchorElement>(null);
  // Stable, guaranteed-unique gradient id per button instance.
  const gradId = useId();

  // Measure the button's actual rendered size so the SVG can trace exactly
  // its pill perimeter — no offset, no letterboxed overlay.
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const update = () => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const base =
    "relative inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-full font-sans font-semibold tracking-tight text-base md:text-lg group transition-colors duration-300";
  const skin =
    variant === "solid"
      ? "bg-ink text-paper hover:bg-ink/95"
      : "border border-ink text-ink hover:bg-ink hover:text-paper";

  const { w, h } = dims;
  const strokeW = 2;
  // Pill radius = half the shorter side. Because h < w for pill buttons, h/2.
  const r = h > 0 ? h / 2 - strokeW / 2 : 0;

  return (
    <a
      ref={anchorRef}
      href={href}
      data-cursor="hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${base} ${skin}`}
    >
      {/* Trim-path stroke — SVG sized to exact button dimensions so the rect
          traces the actual pill perimeter, not an offset shape. */}
      {w > 0 && (
        <svg
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6352A" />
              <stop offset="33%" stopColor="#C8DB45" />
              <stop offset="66%" stopColor="#C4A9D0" />
              <stop offset="100%" stopColor="#E6352A" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 0.5 0.5"
                to="360 0.5 0.5"
                dur="4s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          <rect
            x={strokeW / 2}
            y={strokeW / 2}
            width={w - strokeW}
            height={h - strokeW}
            rx={r}
            ry={r}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeW}
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={hovered ? 0 : 100}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          />
        </svg>
      )}

      <span className="relative z-10 tabular-nums">
        <ScrambleText
          text={label}
          active={hovered}
          colors={["#E6352A", "#C8DB45", "#C4A9D0", "#F4F1E9"]}
          duration={500}
        />
      </span>
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}
