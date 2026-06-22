"use client";

import { motion } from "motion/react";

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
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="font-display uppercase text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-tight"
    >
      {children}
    </motion.h2>
  );
}
