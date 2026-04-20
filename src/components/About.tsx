"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const PARAGRAPH =
  "I'm a graphic and motion designer based in Lincoln, UK. I work with record labels, artists, and ambitious brands on identity, motion, and editorial. I care about type that has a point of view, films that don't waste your time, and printed things that feel like objects. If your project calls for any of those, let's talk.";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const words = PARAGRAPH.split(" ");

  return (
    <section id="about" ref={ref} className="relative px-6 md:px-10 py-24 md:py-40">
      <div className="flex items-start justify-between mb-16 md:mb-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          [ 04 — About ]
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted text-right">
          Lincoln, UK
          <br />
          Est. 2022
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-2 md:sticky md:top-32 self-start">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Bio
          </div>
          <div className="mt-3 text-sm text-muted leading-relaxed">
            BA, University of Bristol. Now based in Lincoln.
          </div>
        </div>

        <p className="md:col-span-10 font-display text-[clamp(1.8rem,4.2vw,3.8rem)] leading-[1.15] tracking-tight">
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={i} progress={scrollYProgress} range={[start, end]}>{w}</Word>;
          })}
        </p>
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 border-t border-line pt-10">
        {[
          { k: "Discipline", v: "Graphic · Motion · 3D" },
          { k: "Based in", v: "Lincoln, UK" },
          { k: "Working since", v: "2022" },
          { k: "Currently", v: "Accepting projects" },
        ].map((item) => (
          <div key={item.k}>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
              {item.k}
            </div>
            <div className="font-display text-2xl md:text-3xl leading-tight">
              {item.v}
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
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  );
}
