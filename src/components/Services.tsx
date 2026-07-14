"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { SERVICES } from "@/lib/content";
import SectionTitle from "./SectionTitle";

export default function Services() {
  return (
    <section
      id="services"
      aria-label="Services — what I do"
      className="relative flex min-h-screen flex-col px-6 md:px-10 py-16 md:py-20 bg-ink text-paper"
      style={
        {
          "--paper": "#fffdf8",
          "--ink": "#0a0a0a",
          "--muted": "#8a8378",
          "--line": "rgba(255, 253, 248, 0.14)",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-1 min-h-0 flex-col justify-center">
        <div className="mb-12 md:mb-16">
          <SectionTitle>Services</SectionTitle>
        </div>

        {/* Three columns on desktop, one per discipline, stacking to rows on
            mobile where side-by-side columns would crush the copy. Hairline
            dividers via gap-px. */}
        <div className="grid grid-cols-1 gap-px bg-paper/10 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          // Outer div stays bg-ink at all times so the gap-px divider lines
          // render correctly. Animating opacity on the column itself would
          // make it transparent, letting the grid's bg-paper/10 bleed
          // through the full area before it transitions in.
          <div
            key={s.title}
            className="bg-ink p-8 md:px-10 md:py-12 group relative overflow-hidden"
          >
            {/* Hover accent bar — lives on the outer div so it's always
                clipped correctly and unaffected by the inner animation. */}
            <div
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[var(--ease)]"
              style={{
                background: "var(--spectrum)",
              }}
            />
            {/* Inner content fades + slides in — outer column bg stays solid.
                Opt the whole column out of the global RevealObserver
                typewriter: the column owns its reveal here, so letting the
                observer also tag/animate the inner h3/p/li double-controlled
                them and left words un-animated. */}
            <motion.div
              data-no-auto-text-reveal
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: EASE,
              }}
              className="flex h-full flex-col gap-6"
            >
              <h3 className="font-display uppercase text-[clamp(1.4rem,2.2vw,2.4rem)] leading-[0.95] tracking-tight">
                {s.title}
              </h3>
              <p className="text-paper/80 leading-relaxed">{s.blurb}</p>
              {/* Pushed to the bottom of the column so the item lists align
                  across all three, regardless of blurb length. */}
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
      </div>
    </section>
  );
}
