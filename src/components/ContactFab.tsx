"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { useEffect, useState } from "react";

// Single source for the address — matches Contact.tsx.
const CONTACT_EMAIL = "hello@tjcreate.co.uk";

/**
 * Mobile-only floating contact button. A persistent mail CTA so the visitor
 * can reach out from anywhere without scrolling to the Contact panel. Opens
 * the OS mail composer via mailto (no backend, no perf cost).
 *
 * Choreography:
 *   - Appears once past the hero (same 700px threshold as BackToTop).
 *   - Hides while the Contact section is on screen — the giant "Say hello."
 *     is the CTA there, so a floating one would just double up.
 *
 * Desktop is intentionally excluded (md:hidden): the header already carries a
 * Contact link there, and the right edge is busy with the scroll indicator.
 * BackToTop moves to the bottom-left on mobile so the two never overlap.
 */
export default function ContactFab() {
  const [pastHero, setPastHero] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtContact(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  const show = pastHero && !atContact;

  return (
    <motion.a
      href={`mailto:${CONTACT_EMAIL}`}
      aria-label={`Email ${CONTACT_EMAIL}`}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        y: show ? 0 : 14,
        pointerEvents: show ? "auto" : "none",
      }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed z-[85] bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white shadow-[0_8px_28px_rgba(10,10,10,0.2)] transition-[filter] duration-300 hover:brightness-110 md:hidden"
    >
      <MailGlyph />
      <span>Email</span>
    </motion.a>
  );
}

/** Hairline envelope, stroke weight tuned to the brand's thin-line rules. */
function MailGlyph() {
  return (
    <svg
      aria-hidden
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <rect x="1.5" y="3" width="13" height="10" />
      <path d="M2 4 L8 8.5 L14 4" />
    </svg>
  );
}
