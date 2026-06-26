"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { SocialLinks } from "./SocialIcons";

// Central constant so the address only needs updating in one place.
const CONTACT_EMAIL = "hello@tjcreate.co.uk";

/**
 * The "Say hello" moment — a full-bleed slide panel. Legal disclosures and the
 * footer live in SiteFooter below the deck, so this fits one viewport and can
 * pin/slide cleanly as the closing panel of the stacked deck.
 */
export default function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact — say hello"
      style={
        {
          "--paper": "#fffdf8",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-ink px-6 py-16 text-paper md:px-10 md:py-20"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">
        <span>Let&apos;s make something</span>
        {/* Availability status — pulsing signal dot + label. */}
        <span className="inline-flex items-center gap-2 text-paper/75">
          <span aria-hidden className="relative inline-flex h-1.5 w-1.5 shrink-0">
            <span
              className="absolute inset-0 rounded-full opacity-70 animate-ping"
              style={{ backgroundColor: "var(--signal)" }}
            />
            <span
              className="relative inline-block rounded-full h-1.5 w-1.5"
              style={{ backgroundColor: "var(--signal)" }}
            />
          </span>
          Available for work
        </span>
      </div>

      {/* Bold "Say hello" — the email is the headline. */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={`Say hello — email ${CONTACT_EMAIL}`}
        data-cursor="view"
        data-cursor-label="EMAIL"
        className="group mt-6 block md:mt-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1, ease: EASE }}
          className="font-display uppercase text-[clamp(3rem,15vw,11rem)] leading-[0.84] tracking-tight transition-colors group-hover:text-accent"
        >
          Say
          <br />
          hello<span className="text-accent">.</span>
        </motion.div>
      </a>

      {/* Email + socials — no labels or divider, so it reads as one section. */}
      <div className="mt-8 flex flex-col gap-6 md:mt-10">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          data-cursor="hover"
          className="w-fit text-lg transition-colors hover:text-accent md:text-xl"
        >
          {CONTACT_EMAIL}
        </a>
        <SocialLinks size={22} tone="paper" />
      </div>
    </section>
  );
}
