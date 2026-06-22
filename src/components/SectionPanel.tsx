"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

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
  /**
   * Extra viewport-heights the panel stays pinned and fully visible before the
   * next panel begins sliding over it. Higher = more dwell time per section.
   */
  dwellVh?: number;
};

const DEFAULT_DWELL_VH = 80;

/**
 * Full-bleed sticky panel for the stacked-scroll deck — on desktop.
 *
 * Desktop (≥768px, motion allowed): each panel pins for one viewport plus a
 * `dwellVh` hold, so the section sits and reads before the next panel slides
 * up and covers it (scaling back + dimming as it goes).
 *
 * Mobile / reduced-motion: the deck is dropped. Panels become plain
 * full-height sections that grow with their content (no clipping, no
 * scroll-jacking), which is both safer for tall content and better touch UX.
 */
export default function SectionPanel({
  children,
  className = "",
  last = false,
  dwellVh = DEFAULT_DWELL_VH,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Progress across the panel's whole slot (pinned hold + the slide-over).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Light spring so the cover scale/dim eases smoothly instead of tracking
  // raw scroll 1:1 (which can read as mechanical at the section boundaries).
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    mass: 0.35,
  });

  // The cover only happens in the final viewport of the slot; before that the
  // panel is held fully visible (the dwell).
  const coverStart = dwellVh / (100 + dwellVh);
  const scale = useTransform(smooth, [coverStart, 1], [1, last ? 1 : 0.92]);
  const filter = useTransform(smooth, (p) => {
    const t = Math.max(0, Math.min(1, (p - coverStart) / (1 - coverStart)));
    return `brightness(${1 - (last ? 0 : 0.45) * t})`;
  });

  const slide = isDesktop && !reduce;

  if (!slide) {
    return (
      <div ref={ref} className={`relative w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ height: `${100 + dwellVh}vh` }} className="relative w-full">
      <motion.section
        style={{ scale, filter, transformOrigin: "50% 35%" }}
        className={`sticky top-0 h-screen w-full overflow-hidden ${className}`}
      >
        {children}
      </motion.section>
    </div>
  );
}
