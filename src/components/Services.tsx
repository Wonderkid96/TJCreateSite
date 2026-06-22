"use client";

import { motion } from "motion/react";
import { SERVICES } from "@/lib/content";
import SectionTitle from "./SectionTitle";

export default function Services() {
  return (
    <section
      id="services"
      aria-label="Services — what I do"
      className="relative px-6 md:px-10 py-24 md:py-40 bg-ink text-paper"
      style={
        {
          "--paper": "#fffdf8",
          "--ink": "#0a0a0a",
          "--muted": "#8a8378",
          "--line": "rgba(255, 253, 248, 0.14)",
        } as React.CSSProperties
      }
    >
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <SectionTitle>Services</SectionTitle>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-paper/10">
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
                background: "var(--spectrum)",
              }}
            />
            {/* Inner content fades + slides in — outer card bg stays solid.
                Opt the whole card out of the global RevealObserver typewriter:
                the card owns its reveal here, so letting the observer also
                tag/animate the inner h3/p/li double-controlled them and left
                words un-animated. */}
            <motion.div
              data-no-auto-text-reveal
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
              <h3 className="font-display uppercase text-[clamp(1.4rem,2.2vw,2.4rem)] leading-[0.95] tracking-tight mt-10">
                {s.title}
              </h3>
              <p className="text-paper/80 max-w-[30ch] leading-relaxed">
                {s.blurb}
              </p>
              <ul className="mt-auto space-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
                {s.items.map((it) => (
                  <li key={it} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
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
