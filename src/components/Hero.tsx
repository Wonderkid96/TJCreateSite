"use client";

import { motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

const WORDS = ["Toby", "Johnson"];
const SUB =
  "Graphic + motion designer building visual systems for record labels, artists, and ambitious brands.";

// Image aspect ratios (width / height).
// Sky: 1581 × 4451 → ratio 1 : 2.816 (very tall)
// Cloud: 3269 × 8125 → ratio 1 : 2.486 (very tall)
// Both scaled to full viewport width become MUCH taller than viewport height,
// giving us a tall canvas to scroll through vertically.
const SKY_ASPECT = 1581 / 4451; // ≈ 0.355 (w/h)
const CLOUD_ASPECT = 3269 / 8125; // ≈ 0.402 (w/h)

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Manual scroll progress (0 → 1 across the hero's sticky scroll range).
  const progress = useMotionValue(0);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.max(0, Math.min(total, -rect.top));
      progress.set(total > 0 ? scrolled / total : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  // Scroll-scrub the falling-man video.
  useMotionValueEvent(progress, "change", (p) => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    v.currentTime = Math.min(v.duration - 0.05, p * v.duration);
  });

  // Translate each layer over the scroll so its top edge moves to the bottom
  // of the viewport — i.e. we see top of image at scroll=0 and bottom at scroll=1.
  // Using % of the element's own height: translateY from 0 to -(1 - vh/layerH).
  // For layer that is 2.82× viewport tall (sky), that's -(1 - 1/2.82) = -64.5%
  // For cloud layer 2.49× tall: -(1 - 1/2.49) = -59.8%
  const skyY = useTransform(progress, [0, 1], ["0%", "-64.5%"]);
  const cloudY = useTransform(progress, [0, 1], ["0%", "-59.8%"]);

  // Falling man: stays centered throughout. The natural sticky scroll carries
  // him upward out of view when the user reaches the end of the hero.
  const fallingScale = useTransform(progress, [0, 0.5, 1], [0.98, 1, 1.04]);

  // Text reveal on scroll.
  const titleOpacity = useTransform(progress, [0, 0.1, 0.55, 0.85], [0, 1, 1, 0]);
  const titleY = useTransform(progress, [0, 0.1, 0.55, 0.85], [60, 0, -10, -60]);
  const subOpacity = useTransform(progress, [0.08, 0.22, 0.65, 0.82], [0, 1, 1, 0]);

  // Each layer's height is calculated from its aspect ratio so that when width
  // = 100vw, the layer's height = 100vw / aspectRatio.
  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full"
      style={{ height: "280vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#c9d8e2]">
        {/* Sky — back layer, full-width panorama scrolling vertically */}
        <motion.div
          style={{
            y: skyY,
            height: `calc(100vw / ${SKY_ASPECT})`,
          }}
          className="absolute inset-x-0 top-0 w-full will-change-transform"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "url(/hero/sky-long.jpg)",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          />
        </motion.div>

        {/* Clouds — mid layer, same panorama treatment, blends over sky */}
        <motion.div
          style={{
            y: cloudY,
            height: `calc(100vw / ${CLOUD_ASPECT})`,
          }}
          className="absolute inset-x-0 top-0 w-full will-change-transform mix-blend-screen opacity-95"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "url(/hero/cloud-long.jpg)",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          />
        </motion.div>

        {/* Falling man — stays centered; natural sticky unpin carries him upward */}
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
            className="h-[48%] w-auto object-contain"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 55% 70% at 50% 48%, black 58%, transparent 92%)",
              maskImage:
                "radial-gradient(ellipse 55% 70% at 50% 48%, black 58%, transparent 92%)",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.35))",
            }}
          />
        </motion.div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.2)_100%)]" />

        {/* Top-of-hero chrome */}
        <div className="absolute top-24 md:top-28 inset-x-6 md:inset-x-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70">
          <span>[ Portfolio — 2026 ]</span>
          <span className="hidden md:inline">
            Est. Lincoln, UK · Available for select projects
          </span>
        </div>

        {/* Scroll-in title */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-x-6 md:inset-x-10 bottom-16 md:bottom-20 flex flex-col gap-6 will-change-transform"
        >
          <h1 className="font-display hero-line text-[clamp(2.8rem,10.5vw,11rem)] tracking-[-0.035em] -ml-[0.02em] text-ink mix-blend-multiply">
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
              <div>↓</div>
              <div className="mt-2">Scroll</div>
            </div>
            <motion.p
              style={{ opacity: subOpacity }}
              className="md:col-span-6 text-lg md:text-2xl leading-snug max-w-xl text-ink/90"
            >
              {SUB}
            </motion.p>
            <motion.div
              style={{ opacity: subOpacity }}
              className="md:col-span-5 md:text-right font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70"
            >
              <div>Selected work below</div>
              <div className="mt-1">
                <a
                  href="#work"
                  data-cursor="hover"
                  className="text-ink hover:text-accent transition-colors"
                >
                  View portfolio →
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
