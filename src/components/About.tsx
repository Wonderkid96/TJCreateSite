"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const PARAGRAPH =
  "I'm Toby Johnson, a creative partner for ambitious brands, agencies and creators. With nearly 10 years in graphic and motion design, I integrate quickly into teams and deliver work that's clear and effective.";

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
          [ 04 / About ]
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
            University of Bristol. Solo artist + designer.
            <br />
            Now based in Lincoln.
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
          { k: "Discipline", v: "Graphic · Motion · 3D", dot: false, splitCommas: false },
          {
            k: "Clients",
            v: "Agencies, Labels, Artists, Brands",
            dot: false,
            splitCommas: true,
          },
          { k: "Based in", v: "Lincoln, UK", dot: false, splitCommas: false },
          { k: "Currently", v: "Accepting projects", dot: true, splitCommas: false },
        ].map((item) => (
          <div key={item.k}>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
              {item.k}
            </div>
            <div className="font-display text-2xl md:text-3xl leading-tight inline-flex items-center gap-3 flex-wrap">
              {item.splitCommas ? <CommaSplit text={item.v} /> : item.v}
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

function CommaSplit({ text }: { text: string }) {
  // Replace each comma with a red full stop in the brand accent. The trailing
  // space after the comma is preserved as natural word spacing.
  const parts = text.split(",").map((p) => p.trim());
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && (
            <span className="text-accent">.</span>
          )}
          {i < parts.length - 1 && " "}
        </span>
      ))}
    </>
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
