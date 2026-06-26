"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <motion.h2
      // This heading owns its own reveal (whileInView). Opt out of the global
      // RevealObserver typewriter so the two systems don't both animate it —
      // double control left the title's words stuck/un-animated.
      data-no-auto-text-reveal
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="section-heading"
    >
      {children}
    </motion.h2>
  );
}
