"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useRef } from "react";
import { SocialLinks } from "./SocialIcons";

const PARAGRAPH =
  "I'm Toby Johnson, a graphic and motion designer based in Lincoln, UK, working with record labels, artists, agencies and brands on campaign artwork, visual identity and motion graphics. Nearly 10 years in, I integrate quickly into teams and deliver work that's clear and effective.";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 40%", "center center"],
  });
  const { scrollYProgress: ruleProgress } = useScroll({
    target: ruleRef,
    offset: ["start 65%", "start 25%"],
  });
  const ruleScaleX = useTransform(ruleProgress, [0, 1], [0, 1]);

  const words = PARAGRAPH.split(" ");

  return (
    <section
      id="about"
      aria-label="About Toby Johnson"
      ref={ref}
      className="relative px-6 md:px-10 py-24 md:py-40"
    >
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
            [ 04 / About ]
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            About <span className="italic">Me</span>
          </motion.h2>
        </div>

        <div className="hidden md:block font-mono text-[11px] uppercase tracking-[0.2em] text-muted text-right">
          Est. 2022
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 md:items-stretch">
        {/* Portrait grid: 2×2 */}
        <div className="md:col-span-6">
          <PortraitTilt />
        </div>

        <div className="md:col-span-6 w-full">
          <div
            className="w-full flex flex-col gap-10"
          >
            {/* Paragraph fills the panel on smaller viewports; capped at
                ~28ch on large desktops for comfortable reading measure. */}
            <p className="w-full lg:max-w-[28ch] font-display text-[clamp(1.45rem,3vw,2.8rem)] lg:text-[clamp(1.8rem,4.2vw,3.8rem)] leading-[1.15] tracking-tight">
              {words.map((w, i) => {
                const start = i / words.length;
                const end = start + 1 / words.length;
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end]}>
                    {w}
                  </Word>
                );
              })}
            </p>

            <div className="mt-8">
              <motion.div
                ref={ruleRef}
                className="h-[2px] w-full rounded-full origin-left"
                style={{
                  scaleX: ruleScaleX,
                  background:
                    "linear-gradient(90deg, #E6352A 0%, #F4F1E9 38%, #C8DB45 68%, #C4A9D0 100%)",
                }}
              />
              <SocialLinks size={22} tone="ink" className="mt-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-line pt-10 md:pt-12">
        {[
          // `sep` is the character inserted between parts in accent orange.
          // `dot: true` appends the animated green "accepting" indicator.
          {
            k: "Discipline",
            parts: ["Graphic", "Motion", "3D"],
            sep: ".",
            dot: false,
          },
          {
            k: "Location",
            parts: ["Lincoln, UK"],
            sep: "",
            dot: false,
          },
          {
            k: "Mode",
            parts: ["Remote", "Hybrid"],
            sep: "/",
            dot: false,
          },
          {
            k: "Currently",
            parts: ["Accepting projects"],
            sep: "",
            dot: true,
          },
        ].map((item, index) => (
          <div
            key={item.k}
            data-reveal="item"
            style={{ "--reveal-delay": `${90 + index * 80}ms` } as React.CSSProperties}
            className="group text-left"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
              {item.k}
            </div>
            {/* Value row — Space Grotesk bold in full caps for a solid,
                functional feel that contrasts the serif above. Only the
                Discipline row gets the orange full-stop punctuation
                between words; the others read as plain caps. Subtle
                letter-spacing expand on hover keeps the stretch flourish. */}
            <div className="font-sans font-bold text-base md:text-lg leading-tight inline-flex items-center gap-3 flex-wrap tracking-normal group-hover:tracking-[0.03em] transition-[letter-spacing] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap">
              <span className="inline-flex items-baseline flex-wrap gap-x-[0.45em]">
                {item.parts.map((word, i) => (
                  <span key={i} className="inline-flex items-baseline">
                    {i > 0 && item.sep && (
                      <span
                        aria-hidden
                        className="inline-block text-accent mr-[0.45em]"
                      >
                        {item.sep}
                      </span>
                    )}
                    <span>{word}</span>
                  </span>
                ))}
              </span>
              {item.dot && (
                <span
                  aria-hidden
                  className="relative inline-flex h-2.5 w-2.5 shrink-0"
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-70 animate-ping"
                    style={{ backgroundColor: "#80EF80" }}
                  />
                  <span
                    className="relative inline-block rounded-full h-2.5 w-2.5"
                    style={{ backgroundColor: "#80EF80" }}
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

function PortraitTilt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const isHovered = useMotionValue(0);
  // overlayOpacity removed — colour sweep effect disabled per user preference

  const springConfig = { stiffness: 120, damping: 18 };
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-9, 9]), springConfig);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [7, -7]), springConfig);
  const scale = useSpring(useTransform(isHovered, [0, 1], [1, 1.03]), springConfig);

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
      onMouseLeave={() => {
        isHovered.set(0);
        rawX.set(0);
        rawY.set(0);
      }}
      style={{ perspective: 800 }}
      className="relative w-full aspect-[3/4] md:h-full md:min-h-[460px] md:aspect-auto cursor-crosshair"
    >
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="relative w-full h-full overflow-hidden rounded-[2px] border border-line/60"
      >
        <Image
          src="/work/imported/portraits/toby-about.jpg"
          alt="Portrait of Toby Johnson"
          fill
          className="object-cover object-[52%_84%]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
    </motion.div>
  );
}

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className="bio-word inline-block mr-[0.25em] transition-[color,transform] duration-220 ease-[cubic-bezier(.2,.8,.2,1)]"
    >
      {children}
    </motion.span>
  );
}
