"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  items: string[];
  sep?: string;
  italic?: boolean;
  speed?: "normal" | "fast";
};

// Pixels per second for auto-scroll.
const SPEEDS = { normal: 28, fast: 60 } as const;
// Auto-scroll pauses for this long after user interaction ends.
const RESUME_DELAY_MS = 1200;

export default function Marquee({
  items,
  sep = "✦",
  italic,
  speed = "normal",
}: Props) {
  const row = [...items, ...items]; // duplicated once so we can seamlessly wrap.
  const x = useMotionValue(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Honour the user's motion preference: start paused so the auto-scroll
  // never kicks in. Drag/wheel still works for users who explicitly want
  // to interact with it.
  const [paused, setPaused] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const resumeTimeout = useRef<number | null>(null);

  const pause = () => {
    setPaused(true);
    if (resumeTimeout.current) window.clearTimeout(resumeTimeout.current);
  };
  const scheduleResume = () => {
    if (resumeTimeout.current) window.clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(() => setPaused(false), RESUME_DELAY_MS);
  };

  // Auto-scroll loop.
  useAnimationFrame((_, delta) => {
    if (paused) return;
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (half === 0) return;
    let next = x.get() - (delta / 1000) * SPEEDS[speed];
    while (next <= -half) next += half;
    while (next > 0) next -= half;
    x.set(next);
  });

  // Horizontal trackpad wheel (two-finger swipe on laptop) → scrub.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;
      const half = track.scrollWidth / 2;
      if (half === 0) return;
      let next = x.get() - e.deltaX;
      while (next <= -half) next += half;
      while (next > 0) next -= half;
      x.set(next);
      pause();
      scheduleResume();
    };

    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, [x]);

  // Normalize after drag so we wrap nicely.
  const normalize = () => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (half === 0) return;
    let n = x.get();
    while (n <= -half) n += half;
    while (n > 0) n -= half;
    x.set(n);
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden py-8 border-y border-line select-none"
    >
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: -Infinity, right: Infinity }}
        dragElastic={0.12}
        dragMomentum={true}
        onDragStart={pause}
        onDrag={normalize}
        onDragEnd={() => {
          normalize();
          scheduleResume();
        }}
        style={{ x }}
        className="flex gap-10 whitespace-nowrap cursor-grab active:cursor-grabbing will-change-transform"
      >
        {row.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className={`font-display text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-tight ${
              italic ? "italic" : ""
            }`}
          >
            {t}
            <span className="mx-8 text-accent">{sep}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
