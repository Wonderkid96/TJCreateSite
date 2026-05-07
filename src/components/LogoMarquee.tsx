"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

type LogoItem = {
  name: string;
  logo: string | null;
  url?: string;
};

type Props = {
  items: LogoItem[];
  speed?: "normal" | "fast";
};

// Auto-scroll speeds in px/s for each marquee mode.
const SPEEDS = { normal: 22, fast: 50 } as const;
// How long after the user stops dragging/scrolling before auto-scroll resumes.
// Long enough to feel deliberate rather than snapping back immediately.
const RESUME_DELAY_MS = 1200;

// Colours pulled from Toby's palette, picked at random on hover so every pass
// feels fresh and the wordmark doesn't look like it was forced into one brand.
const HOVER_COLOURS = ["#E6352A", "#C8DB45", "#C4A9D0"] as const;
// A/B toggle for default logo weight without touching every logo asset.
// "strong" = crisp ink (recommended), "muted" = softer look.
const LOGO_TONE: "strong" | "muted" = "strong";

const CONTAINER_H_CLASS = "h-40 md:h-48";
// Each slot sits at 75% of the container height, uniform width, generous gap
// between them so logos breathe.
const SLOT_CLASS =
  "shrink-0 flex items-center justify-center h-[75%] w-40 md:w-48";

export default function LogoMarquee({ items, speed = "normal" }: Props) {
  const row = [...items, ...items];
  const x = useMotionValue(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Reduced-motion users start paused so the strip doesn't auto-drift.
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
      className={`relative w-full overflow-hidden border-y border-line select-none bg-paper ${CONTAINER_H_CLASS}`}
    >
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: -Infinity, right: Infinity }}
        dragElastic={0.12} // light rubber-band feel at the ends of the drag range
        dragMomentum={true}
        onDragStart={pause}
        onDrag={normalize}
        onDragEnd={() => {
          normalize();
          scheduleResume();
        }}
        style={{ x }}
        className="flex items-center gap-16 md:gap-24 whitespace-nowrap cursor-grab active:cursor-grabbing will-change-transform h-full"
      >
        {row.map((item, i) => (
          <LogoSlot key={`${item.name}-${i}`} item={item} isPaused={paused} />
        ))}
      </motion.div>
    </div>
  );
}

function LogoSlot({ item, isPaused }: { item: LogoItem; isPaused: boolean }) {
  // Default is "var(--ink)" — flips automatically with the theme so logos
  // read as dark on cream (light mode) and cream on dark (dark mode).
  const [color, setColor] = useState<string>("var(--ink)");

  const onEnter = () => {
    setColor(
      HOVER_COLOURS[Math.floor(Math.random() * HOVER_COLOURS.length)],
    );
  };
  const onLeave = () => setColor("var(--ink)");

  const inner = item.logo ? (
    <div
      aria-hidden
      className="h-full w-full transition-colors duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${item.logo})`,
        maskImage: `url(${item.logo})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  ) : (
    <span
      className="font-sans font-bold tracking-tight text-xl md:text-2xl leading-tight transition-colors duration-500"
      style={{ color }}
    >
      {item.name}
    </span>
  );

  const toneClass =
    LOGO_TONE === "strong" ? "opacity-100" : "opacity-80 hover:opacity-100";
  const baseClass = `${SLOT_CLASS} ${toneClass} transition-opacity duration-500`;

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.name} (opens in new tab)`}
        data-cursor="hover"
        className={baseClass}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={(e) => {
          // Suppress nav while the marquee is being drag-scrubbed.
          if (isPaused) e.preventDefault();
        }}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className={baseClass}
      aria-label={item.name}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {inner}
    </div>
  );
}
