"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { SERVICES } from "@/lib/content";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 25%"],
  });

  // Smooth line draw driven by scroll through the section.
  const rawScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scaleY = useSpring(rawScaleY, { stiffness: 55, damping: 18 });

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="Services — what I do"
      className="relative px-6 md:px-10 py-24 md:py-40 bg-ink text-paper"
      style={
        {
          "--paper": "#f4f1e9",
          "--ink": "#0a0a0a",
          "--muted": "#8a8378",
          "--line": "rgba(244, 241, 233, 0.14)",
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-20 md:mb-28">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-4">
            [ 02 / Services ]
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            What I <span className="italic">do</span>
          </motion.h2>
        </div>
      </div>

      {/* Journey */}
      <div className="relative">
        {/* Track — faint guide line, full height */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-paper/8"
        />
        {/* Gradient fill — draws downward with scroll */}
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 w-[2px] origin-top"
          style={{
            scaleY,
            height: "100%",
            background:
              "linear-gradient(to bottom, #E6352A 0%, #F4F1E9 38%, #C8DB45 68%, #C4A9D0 100%)",
          }}
        />

        {SERVICES.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.9,
              delay: 0.08,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="relative pl-10 md:pl-20 group"
          >
            {/* Horizontal branch — sweeps right from the vertical line */}
            <motion.div
              aria-hidden
              className="absolute left-0 top-0 h-[2px] w-full origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              style={{
                background:
                  "linear-gradient(to right, #E6352A 0%, #F4F1E9 38%, #C8DB45 68%, #C4A9D0 100%)",
              }}
            />

            <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
              {/* Left — number + large title */}
              <div className="md:col-span-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/35 mb-5">
                  {s.num} / 03
                </div>
                <h3 className="font-display text-[clamp(2.6rem,5.5vw,5rem)] leading-none tracking-tight">
                  {s.title.split(" ")[0]}
                  <span className="italic block">
                    {s.title.split(" ").slice(1).join(" ")}
                  </span>
                </h3>
              </div>

              {/* Right — blurb + 2-col skill grid */}
              <div className="md:col-span-7 flex flex-col justify-center gap-6">
                <p className="text-paper/75 text-lg leading-relaxed max-w-[40ch]">
                  {s.blurb}
                </p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="inline-block h-1 w-1 rounded-full bg-accent shrink-0"
                      />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
