"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { SocialLinks } from "./SocialIcons";
import ContactForm from "./ContactForm";

const CONTACT_EMAIL = "hello@tjcreate.co.uk";

/** Closing contact panel with direct details and an accessible enquiry form. */
export default function Contact() {
  const reduced = useReducedMotion();
  return (
    <section
      id="contact"
      aria-label="Contact — say hello"
      style={{ "--paper": "#ffffff", "--ink": "#0a0a0a" } as React.CSSProperties}
      className="contact-section relative w-full overflow-hidden bg-ink px-6 py-16 text-paper md:px-10 md:py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">
            <span>Let&apos;s make something</span>
            <span className="inline-flex items-center gap-2 text-paper/75">
              <span aria-hidden className="relative inline-flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inset-0 animate-ping rounded-full opacity-70" style={{ backgroundColor: "var(--signal)" }} />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--signal)" }} />
              </span>
              Available for work
            </span>
          </div>

          <a href={`mailto:${CONTACT_EMAIL}`} aria-label={`Email ${CONTACT_EMAIL}`} className="group mt-6 block w-fit md:mt-8">
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: reduced ? 0 : 1, ease: EASE }}
              className="font-display text-[clamp(2.5rem,7vw,6rem)] uppercase leading-[0.95] tracking-tight transition-colors group-hover:text-accent"
            >
              Say hello<span className="text-accent">.</span>
            </motion.h2>
          </a>

          <p className="mt-6 max-w-md text-base leading-relaxed text-paper/75 md:mt-8 md:text-lg">
            If you&apos;ve got a project, campaign or idea that could use graphic design, motion or 3D, get in touch. I take on direct client work and agency projects, and retained monthly work for teams that need consistent capacity.
          </p>

          <div className="contact-details mt-6 flex flex-col gap-6">
            <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit text-lg transition-colors hover:text-accent md:text-xl">
              {CONTACT_EMAIL}
            </a>
            <SocialLinks size={22} tone="paper" />
          </div>
        </div>

        <ContactForm email={CONTACT_EMAIL} />
      </div>
    </section>
  );
}
