"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import ScrambleText from "./ScrambleText";

type Props = {
  project: Project;
  index: number;
  parallaxStrength?: number;
  onOpen?: () => void;
};

function ProjectTile({
  project,
  index,
  parallaxStrength = 40,
  onOpen,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  // Cursor tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { damping: 20, stiffness: 150 });
  const sy = useSpring(my, { damping: 20, stiffness: 150 });
  const rX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rY = useTransform(sx, [-0.5, 0.5], [-4, 4]);

  // Scroll parallax for inner media
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxStrength, -parallaxStrength]
  );

  // Autoplay looping videos when in viewport.
  // "falling" drives its own ping-pong inside FallingOnSky (skip here).
  // `pingPong: true` projects run a manual RAF ping-pong below.
  const fallingKind = project.kind === "falling";
  const pingPong = project.pingPong ?? false;
  useEffect(() => {
    if (fallingKind || pingPong) return;
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [fallingKind, pingPong]);

  // Ping-pong playback — forward, then reverse, forever. No loop-reset jump.
  useEffect(() => {
    if (!pingPong) return;
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let last = performance.now();
    let dir = 1;
    v.pause();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (v.readyState < 2 || !v.duration || Number.isNaN(v.duration)) {
        last = now;
        return;
      }
      const delta = (now - last) / 1000;
      last = now;
      const next = v.currentTime + dir * delta;
      if (next >= v.duration - 0.05) {
        v.currentTime = v.duration - 0.05;
        dir = -1;
      } else if (next <= 0.05) {
        v.currentTime = 0.05;
        dir = 1;
      } else {
        v.currentTime = next;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pingPong]);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };
  const onEnter = () => setHovered(true);

  const kind = project.kind ?? "image";
  const cursorLabel = project.externalUrl
    ? "YOUTUBE ↗"
    : kind === "video"
      ? "PLAY"
      : kind === "falling"
        ? "WATCH"
        : kind === "day-night"
          ? "FLIP"
          : "VIEW";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="view"
      data-cursor-label={cursorLabel}
      className="hover-tile group relative block w-full h-full text-left"
      // Pin --paper/--ink locally so overlay text stays readable on both
      // light and dark themes (tiles always sit over darkened imagery).
      style={
        {
          perspective: "1000px",
          "--paper": "#f4f1e9",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
    >
      <motion.div
        style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full overflow-hidden rounded-[2px] md:aspect-auto aspect-[4/5]"
      >
        <div
          className="hover-tile-media absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)]"
          style={{ background: project.bg ?? "#111" }}
        >
          <motion.div
            ref={mediaRef}
            className="absolute"
            // Inset equal to 1.3× parallaxStrength on every side so the media
            // always extends beyond the tile further than the max Y translation,
            // guaranteeing the tile's own background never leaks through.
            style={{
              y: mediaY,
              inset: `-${Math.ceil(parallaxStrength * 1.3)}px`,
            }}
          >
            {kind === "image" && project.image && (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={index < 2}
              />
            )}

            {kind === "day-night" && project.image && project.imageHover && (
              <>
                <Image
                  src={project.image}
                  alt={`${project.title} (day)`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-[700ms] ease-[cubic-bezier(.2,.8,.2,1)] opacity-100 group-hover:opacity-0"
                />
                <Image
                  src={project.imageHover}
                  alt={`${project.title} (night)`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-[700ms] ease-[cubic-bezier(.2,.8,.2,1)] opacity-0 group-hover:opacity-100"
                />
              </>
            )}

            {kind === "video" && project.video && (
              <video
                ref={videoRef}
                src={project.video}
                poster={project.videoPoster}
                muted
                loop
                playsInline
                // ping-pong tiles need the browser to know duration + a
                // seekable index, so they stay on "metadata". Regular tiles
                // defer all fetches until the IntersectionObserver plays them.
                preload={pingPong ? "metadata" : "none"}
                onEnded={(e) => {
                  // Belt + braces: restart manually if the browser drops the loop.
                  const el = e.currentTarget;
                  el.currentTime = 0;
                  el.play().catch(() => {});
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {kind === "falling" && <FallingOnSky videoRef={videoRef} />}
          </motion.div>
        </div>


        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55 pointer-events-none" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/90 mix-blend-difference">
          <span>({String(index + 1).padStart(2, "0")})</span>
          <span>{project.year}</span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-paper">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/80 mb-1">
              {project.category} · {project.client}
            </div>
            <div className="font-display text-3xl md:text-5xl leading-none tracking-tight">
              <ScrambleText text={project.title} active={hovered} />
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70">
            {project.tags.map((t) => (
              <span key={t}>#{t.replace(/\s+/g, "")}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </button>
  );
}

// Tiles live inside a motion.div grid in WorkGrid — without memo, every
// parent animation frame would re-render all 15 tiles. Props are stable
// (project objects are module-level, onOpen is a parent arrow), so shallow
// equality is sufficient.
export default memo(ProjectTile);

function FallingOnSky({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  // Ping-pong playback: advance currentTime forward until end, then backward,
  // avoiding the jarring loop reset.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let last = performance.now();
    let dir = 1;
    // We drive currentTime manually, so pause the native playback.
    v.pause();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (v.readyState < 2 || !v.duration || Number.isNaN(v.duration)) {
        last = now;
        return;
      }
      const delta = (now - last) / 1000;
      last = now;
      const next = v.currentTime + dir * delta;
      if (next >= v.duration - 0.05) {
        v.currentTime = v.duration - 0.05;
        dir = -1;
      } else if (next <= 0.05) {
        v.currentTime = 0.05;
        dir = 1;
      } else {
        v.currentTime = next;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [videoRef]);

  return (
    <>
      <Image
        src="/work/imported/bg/sky-long.avif"
        alt=""
        fill
        sizes="50vw"
        className="object-cover object-center scale-110"
      />
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          backgroundImage: "url(/work/imported/bg/cloud-long.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "cloudDrift 60s linear infinite",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          src="/work/imported/motion/falling-alpha.mp4"
          muted
          playsInline
          preload="auto"
          className="h-[55%] w-auto object-contain"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 70% at 50% 50%, black 55%, transparent 92%)",
            maskImage:
              "radial-gradient(ellipse 60% 70% at 50% 50%, black 55%, transparent 92%)",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
    </>
  );
}
