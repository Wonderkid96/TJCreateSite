"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { getLenis } from "@/lib/lenis";
import { PAST_HERO_SCROLL_Y, useScrolledPast } from "@/lib/use-scrolled-past";

export default function BackToTop() {
  const visible = useScrolledPast(PAST_HERO_SCROLL_Y);

  const goTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.05 });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      // Invisible below the 700px threshold, so pull it out of the tab order
      // and the accessibility tree too — otherwise keyboard/AT users land on
      // a control they can't see. Matches ContactFab's show/hide pattern.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 14,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.35, ease: EASE }}
      // Bottom-left on mobile so it never overlaps the contact FAB (which
      // owns the bottom-right there); back to bottom-right on desktop, where
      // there is no FAB.
      className="fixed z-[85] bottom-5 left-5 md:bottom-7 md:left-auto md:right-7 h-11 w-11 rounded-full bg-accent text-white shadow-[0_8px_28px_rgba(10,10,10,0.2)] transition-[filter] duration-300 hover:brightness-110"
    >
      <span aria-hidden className="text-base leading-none">
        ↑
      </span>
    </motion.button>
  );
}
