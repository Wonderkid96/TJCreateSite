"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type LogoItem = {
  name: string;
  logo: string | null;
};

type Props = {
  items: LogoItem[];
  speed?: "normal" | "fast";
};

const SPEEDS = { normal: 22, fast: 50 } as const;
const RESUME_DELAY_MS = 1200;

export default function LogoMarquee({ items, speed = "normal" }: Props) {
  // Duplicate once so we can wrap seamlessly when auto-scrolling.
  const row = [...items, ...items];
  const x = useMotionValue(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const resumeTimeout = useRef<number | null>(null);

  const pause = () => {
    setPaused(true);
    if (resumeTimeout.current) window.clearTimeout(resumeTimeout.current);
  };
  const scheduleResume = () => {
    if (resumeTimeout.current) window.clearTimeout(resumeTimeout.current);
    resumeTimeout.current = window.setTimeout(
      () => setPaused(false),
      RESUME_DELAY_MS,
    );
  };

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
      className="relative w-full overflow-hidden py-10 md:py-14 border-y border-line select-none bg-paper"
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
        className="flex items-center gap-16 md:gap-24 whitespace-nowrap cursor-grab active:cursor-grabbing will-change-transform"
      >
        {row.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="relative shrink-0 flex items-center justify-center h-12 md:h-14 opacity-70 hover:opacity-100 transition-opacity duration-500"
            aria-label={item.name}
          >
            {item.logo ? (
              <Image
                src={item.logo}
                alt={item.name}
                width={200}
                height={56}
                className="h-full w-auto object-contain"
                unoptimized={item.logo.endsWith(".svg")}
              />
            ) : (
              <span className="font-sans font-bold tracking-tight text-ink text-xl md:text-2xl px-2">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
