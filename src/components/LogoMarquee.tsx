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
  /** Drop the bordered dark strip — transparent background, no top/bottom rule. */
  bare?: boolean;
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

const CONTAINER_H_CLASS = "h-32 md:h-40";
// Slightly smaller than before so the strip reads as supporting proof rather
// than competing with the main sections.
const SLOT_CLASS =
  "shrink-0 flex items-center justify-center h-[68%] w-36 md:w-44";

export default function LogoMarquee({ items, speed = "normal", bare = false }: Props) {
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
      // Pin the strip dark regardless of theme: a black background with
      // off-white logos, matching how the other dark sections lock their
      // palette locally.
      style={
        { "--ink": "#0a0a0a", "--paper": "#fffdf8" } as React.CSSProperties
      }
      className={`relative w-full overflow-hidden select-none ${CONTAINER_H_CLASS} ${
        bare ? "" : "border-y border-line bg-ink"
      }`}
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
        className="flex items-center gap-14 md:gap-20 whitespace-nowrap cursor-grab active:cursor-grabbing will-change-transform h-full"
      >
        {row.map((item, i) => (
          <LogoSlot key={`${item.name}-${i}`} item={item} isPaused={paused} />
        ))}
      </motion.div>
    </div>
  );
}

function LogoSlot({ item, isPaused }: { item: LogoItem; isPaused: boolean }) {
  // Off-white by default so logos read as cream on the strip's pinned black
  // background. Hover still flips to a random palette accent.
  const [color, setColor] = useState<string>("var(--paper)");

  const onEnter = () => {
    setColor(
      HOVER_COLOURS[Math.floor(Math.random() * HOVER_COLOURS.length)],
    );
  };
  const onLeave = () => setColor("var(--paper)");

  const inner = item.logo ? (
    <div
      aria-hidden
      className="h-full w-full transition-colors duration-500 ease-[var(--ease)]"
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
