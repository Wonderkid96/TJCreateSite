"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const PARAGRAPH =
  "I'm Toby Johnson, a creative partner for ambitious brands, agencies and creators. With nearly 10 years in graphic and motion design, I integrate quickly into teams and deliver work that's clear and effective.";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const { scrollYProgress: ruleProgress } = useScroll({
    target: ruleRef,
    offset: ["start 92%", "start 52%"],
  });
  const ruleScaleX = useTransform(ruleProgress, [0, 1], [0, 1]);

  const words = PARAGRAPH.split(" ");

  return (
    <section id="about" ref={ref} className="relative px-6 md:px-10 py-24 md:py-40">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted mb-4">
            [ 04 / About ]
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
        {/* Portrait: ~35% on desktop so it doesn't dominate the text. */}
        <div className="md:col-span-4">
          <div
            className="relative w-full md:max-w-none aspect-[4/5] md:aspect-auto md:h-full md:min-h-[460px] overflow-hidden rounded-[2px] border border-line/60 bg-ink/5"
          >
            <Image
              src="/work/imported/portraits/toby-about.jpg"
              alt="Portrait of Toby Johnson"
              fill
              className="object-cover object-[52%_84%] scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 24vw, 300px"
            />
          </div>
        </div>

        <div className="md:col-span-8">
          <div
            className="h-full border border-line/60 bg-paper/40 rounded-[2px] p-6 md:p-10 flex flex-col justify-between"
          >
            <p className="max-w-[24ch] font-display text-[clamp(1.45rem,3vw,2.8rem)] lg:text-[clamp(1.8rem,4.2vw,3.8rem)] leading-[1.15] tracking-tight">
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
              <p className="mt-5 text-sm md:text-base text-muted max-w-[58ch] leading-relaxed">
                Lincoln, UK
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8">
        {[
          { k: "Discipline", v: "Graphic · Motion · 3D", dot: false },
          { k: "Mode", v: "Remote / Hybrid", dot: false },
          { k: "Currently", v: "Accepting projects", dot: true },
        ].map((item, index) => (
          <div
            key={item.k}
            data-reveal="item"
            style={{ "--reveal-delay": `${90 + index * 80}ms` } as React.CSSProperties}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
              {item.k}
            </div>
            <div className="font-display text-2xl md:text-3xl leading-tight inline-flex items-center gap-3 flex-wrap">
              {item.v}
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
