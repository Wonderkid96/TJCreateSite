"use client";

import { motion } from "motion/react";
import { SERVICES } from "@/lib/content";

export default function Services() {
  return (
    <section
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
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-4">
            [ 02 / Services ]
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            What I <span className="italic">do</span>
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-paper/10">
        {SERVICES.map((s, i) => (
          // Outer div stays bg-ink at all times so the gap-px grid lines
          // render correctly. Animating opacity on the card itself would
          // make it transparent, letting the grid's bg-paper/10 bleed
          // through the full card area before it transitions in.
          <div
            key={s.num}
            className="bg-ink p-8 md:p-12 flex flex-col gap-8 group relative overflow-hidden"
          >
            {/* Hover accent bar — lives on the outer div so it's always
                clipped correctly and unaffected by the inner animation. */}
            <div
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{
                background:
                  "linear-gradient(90deg, #E6352A 0%, #F4F1E9 38%, #C8DB45 68%, #C4A9D0 100%)",
              }}
            />
            {/* Inner content fades + slides in — outer card bg stays solid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="flex flex-col gap-8 h-full"
            >
              <div className="absolute top-8 right-8 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
                {s.num} / 03
              </div>
              <h3 className="font-display text-4xl md:text-5xl leading-none tracking-tight mt-10">
                {s.title.split(" ")[0]}
                <span className="italic"> {s.title.split(" ").slice(1).join(" ")}</span>
              </h3>
              <p className="text-paper/80 max-w-[30ch] leading-relaxed">
                {s.blurb}
              </p>
              <ul className="mt-auto space-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-3">
                    <span className="inline-block h-1 w-1 rounded-full bg-accent" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
