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
        {/* Track — faint full-height background line */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-px bg-paper/10"
        />
        {/* Animated accent fill — draws downward with scroll */}
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 w-px bg-accent origin-top"
          style={{ scaleY, height: "100%" }}
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
            {/* Stop dot — pops in when card enters view */}
            <motion.div
              aria-hidden
              className="absolute left-0 top-10 md:top-14 -translate-x-1/2 w-3 h-3 rounded-full bg-ink border-2 border-accent"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.25,
                type: "spring",
                stiffness: 380,
                damping: 18,
              }}
            />

            <div
              className={`py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 ${
                i < SERVICES.length - 1 ? "border-b border-paper/10" : ""
              }`}
            >
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

            {/* Gradient rule — sweeps left→right on hover */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{
                background:
                  "linear-gradient(90deg, #E6352A 0%, #F4F1E9 38%, #C8DB45 68%, #C4A9D0 100%)",
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
