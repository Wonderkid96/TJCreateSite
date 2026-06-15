"use client";

import { motion } from "motion/react";

interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
    >
      {children}
    </motion.h2>
  );
}
