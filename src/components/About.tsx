"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import SectionTitle from "./SectionTitle";
import { useRef } from "react";
import { SocialLinks } from "./SocialIcons";

// ─── Copy ────────────────────────────────────────────────────────────────────

const BIO_PRIMARY =
  "I'm Toby Johnson, a graphic and motion designer based in Lincoln, UK. Most of my work sits around music, culture and brand campaigns, especially where print, motion and 3D need to feel like one system rather than separate jobs.";
const BIO_SECONDARY =
  "I like projects with a strong point of view, clear references and room to make the idea sharper. That can be a tour poster, a release campaign, a motion system or a visual identity that needs to hold together across formats.";

// Shown in the stat grid below the bio.
const STATS = [
  // `sep` is the accent-coloured character inserted between each part.
  // `dot: true` appends the animated green "accepting work" indicator.
  { k: "Discipline", parts: ["Graphic", "Motion", "3D"], sep: ".", dot: false },
  { k: "Location",   parts: ["Lincoln, UK"],              sep: "",  dot: false },
  { k: "Mode",       parts: ["Remote", "Hybrid"],         sep: "/", dot: false },
  { k: "Currently",  parts: ["Accepting projects"],       sep: "",  dot: true  },
] as const;

// ─── Section ─────────────────────────────────────────────────────────────────

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  // The horizontal rule below the bio animates from 0 → full width.
  const { scrollYProgress: ruleProgress } = useScroll({
    target: ruleRef,
    offset: ["start 90%", "start 50%"],
  });
  const ruleScaleX = useTransform(ruleProgress, [0, 1], [0, 1]);

  return (
    <section
      id="about"
      aria-label="About Toby Johnson"
      ref={ref}
      className="relative px-6 md:px-10 pt-24 md:pt-40 pb-16 md:pb-20"
    >
      {/* Section header */}
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <SectionTitle>
            About <span className="italic">Toby</span>
          </SectionTitle>
        </div>

        <div className="hidden md:block font-mono text-[11px] uppercase tracking-[0.2em] text-muted text-right">
          Lincoln, UK
        </div>
      </div>

      {/* Portrait + bio */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 md:items-stretch">
        <div className="md:col-span-6">
          <PortraitTilt />
        </div>

        <div className="md:col-span-6 flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-5"
          >
            <p className="w-full lg:max-w-[26ch] font-display text-[clamp(1.45rem,3vw,2.7rem)] lg:text-[clamp(1.8rem,4vw,3.4rem)] leading-[1.12] tracking-tight">
              {BIO_PRIMARY}
            </p>
            <p className="max-w-[38rem] text-base md:text-lg leading-relaxed text-ink/72">
              {BIO_SECONDARY}
            </p>
          </motion.div>

          {/* Animated rule + social links */}
          <div className="mt-8">
            <motion.div
              ref={ruleRef}
              className="h-[2px] w-full rounded-full origin-left"
              style={{
                scaleX: ruleScaleX,
                background: "var(--spectrum)",
              }}
            />
            <SocialLinks size={22} tone="ink" className="mt-5" />
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-t border-line pt-7 md:pt-8">
        {STATS.map((item, index) => (
          <div
            key={item.k}
            data-reveal="item"
            // 90 ms base delay + 80 ms per item — staggers each stat card into view
            style={{ "--reveal-delay": `${90 + index * 80}ms` } as React.CSSProperties}
            className="group text-left"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
              {item.k}
            </div>

            <div className="font-sans font-bold text-base md:text-lg leading-tight inline-flex items-center gap-3 flex-wrap tracking-normal group-hover:tracking-[0.03em] transition-[letter-spacing] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap">
              <span className="inline-flex items-baseline flex-wrap gap-x-[0.45em]">
                {item.parts.map((word, i) => (
                  <span key={i} className="inline-flex items-baseline">
                    {i > 0 && item.sep && (
                      <span aria-hidden className="inline-block text-accent mr-[0.45em]">
                        {item.sep}
                      </span>
                    )}
                    <span>{word}</span>
                  </span>
                ))}
              </span>

              {/* Pulsing green dot — "Accepting projects" indicator */}
              {item.dot && (
                <span aria-hidden className="relative inline-flex h-2.5 w-2.5 shrink-0">
                  <span
                    className="absolute inset-0 rounded-full opacity-70 animate-ping"
                    style={{ backgroundColor: "var(--signal)" }}
                  />
                  <span
                    className="relative inline-block rounded-full h-2.5 w-2.5"
                    style={{ backgroundColor: "var(--signal)" }}
                  />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Portrait card with mouse-tracked 3D tilt on hover. */
function PortraitTilt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  // Spring config for the portrait tilt — responsive but not over-bouncy.
  const springConfig = { stiffness: 120, damping: 18 };
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-9, 9]), springConfig);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]), springConfig);
  const scale   = useSpring(useTransform(isHovered, [0, 1], [1, 1.03]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isHovered.set(1)}
      onMouseLeave={() => { isHovered.set(0); rawX.set(0); rawY.set(0); }}
      style={{ perspective: 800 }}
      className="relative w-full aspect-[3/4] md:h-full md:min-h-[460px] md:aspect-auto cursor-crosshair"
    >
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="relative w-full h-full overflow-hidden rounded-[2px] border border-line/60"
      >
        <Image
          src="/work/imported/portraits/toby-about.avif"
          alt="Portrait of Toby Johnson"
          fill
          className="object-cover object-[52%_84%]"
          sizes="(max-width: 767px) 100vw, 50vw"
        />
      </motion.div>
    </motion.div>
  );
}
