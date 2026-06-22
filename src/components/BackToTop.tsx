"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

type LenisLite = {
  scrollTo: (target: number | string, opts?: { duration?: number }) => void;
};

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    const lenis = (window as unknown as { __lenis?: LenisLite }).__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(0, { duration: 1.05 });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      type="button"
      onClick={goTop}
      data-cursor="hover"
      aria-label="Back to top"
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 14,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed z-[85] bottom-5 right-5 md:bottom-7 md:right-7 h-11 w-11 rounded-full bg-accent text-white shadow-[0_8px_28px_rgba(10,10,10,0.2)] transition-[filter] duration-300 hover:brightness-110"
    >
      <span aria-hidden className="text-base leading-none">
        ↑
      </span>
    </motion.button>
  );
}
