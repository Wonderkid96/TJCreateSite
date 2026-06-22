"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type Props = {
  children: React.ReactNode;
  /**
   * Background/utility classes for the panel. Must include an opaque
   * background so the panel fully covers the one beneath it as it slides over.
   */
  className?: string;
  /**
   * The final panel in a stack has nothing sliding over it, so it should not
   * scale or dim away.
   */
  last?: boolean;
};

/**
 * Full-bleed sticky panel for the stacked-scroll deck — on desktop.
 *
 * Desktop (≥768px, motion allowed): each panel is `sticky top-0`, one viewport
 * tall, so panel N pins while the next slides up and covers it, scaling back
 * and dimming as it goes.
 *
 * Mobile / reduced-motion: the deck is dropped. Panels become plain
 * full-height sections that grow with their content (no clipping, no
 * scroll-jacking), which is both safer for tall content and better touch UX.
 */
export default function SectionPanel({
  children,
  className = "",
  last = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // 0 while pinned at the top, 1 once fully scrolled away under the next panel.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, last ? 1 : 0.92]);
  const filter = useTransform(
    scrollYProgress,
    (p) => `brightness(${1 - (last ? 0 : 0.45) * p})`,
  );

  const slide = isDesktop && !reduce;

  return (
    <motion.section
      ref={ref}
      style={slide ? { scale, filter, transformOrigin: "50% 35%" } : undefined}
      className={
        slide
          ? `sticky top-0 h-screen w-full overflow-hidden ${className}`
          : `relative w-full ${className}`
      }
    >
      {children}
    </motion.section>
  );
}
