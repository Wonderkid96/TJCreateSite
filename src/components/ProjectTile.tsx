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
import { useMediaQuery } from "@/lib/use-media-query";
import ScrambleText from "./ScrambleText";
import {
  FALLING_FRAME_COUNT,
  FALLING_FRAME_HEIGHT,
  FALLING_FRAME_WIDTH,
  getFallingFrameByIndex,
  preloadFallingFrames,
} from "@/lib/falling-frames";

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
  const hoverVideoRef = useRef<HTMLVideoElement>(null);
  const hoverVideoEndedRef = useRef(false);
  const hoverVideoReverseRaf = useRef(0);
  const [hovered, setHovered] = useState(false);
  // Hydration-safe: false on the server and the first client render, real
  // value after — the render branches below (hover-video, parallax insets)
  // must match server HTML or React throws #418 on touch devices.
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  // Gates autoplay and JS-driven motion (WCAG 2.2.2 / 2.3.3). Posters and
  // static frames render instead.
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [dayNightIsNight, setDayNightIsNight] = useState(false);

  // Cursor tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { damping: 20, stiffness: 150 });
  const sy = useSpring(my, { damping: 20, stiffness: 150 });
  const rX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rY = useTransform(sx, [-0.5, 0.5], [-4, 4]);

  // Scroll parallax for inner media. Disabled on touch devices: with 15
  // tiles each running their own scroll-progress tracker, mobile native
  // scroll + JS-driven transforms get out of sync and the parallax visibly
  // judders. Touch users get a flat (still nicely cropped) media layer.
  const enableParallax = !isTouchDevice;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? [parallaxStrength, -parallaxStrength] : [0, 0]
  );

  // Autoplay looping videos when in viewport.
  // "falling" drives its own ping-pong inside FallingOnSky (skip here).
  // `pingPong: true` projects run a manual RAF ping-pong below.
  const fallingKind = project.kind === "falling";
  const pingPong = project.pingPong ?? false;
  const pingPongEnabled = pingPong && !isTouchDevice && !prefersReducedMotion;
  useEffect(() => {
    if (fallingKind || pingPongEnabled || prefersReducedMotion) return;
    const v = videoRef.current;
    if (!v) return;

    // Mobile autoplay rules: play() can silently reject if the video has
    // preload="none" and no buffered data yet, especially on iOS Safari
    // when the user is mid-scroll. We force a load() the first time the
    // tile enters view, then call play() once enough data is buffered.
    let playRequested = false;
    const tryPlay = () => {
      if (!playRequested) return;
      // Some Android Chrome builds reject play() during touch scroll; the
      // .catch swallow is enough — IO will retry on next intersection.
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    const onCanPlay = () => tryPlay();
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("loadeddata", onCanPlay);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            playRequested = true;
            // Kick off the network/decode if we deferred via preload="none".
            // load() is a no-op once data is already loading or loaded.
            if (v.readyState < 2 && v.preload !== "none") {
              try { v.load(); } catch {}
            } else if (v.preload === "none") {
              // Promote to metadata so iOS will fetch the moov atom and
              // we get a canplay event we can hook into.
              v.preload = "metadata";
              try { v.load(); } catch {}
            }
            tryPlay();
          } else {
            playRequested = false;
            v.pause();
          }
        }
      },
      // Tiny margin on the bottom so videos start fetching before the tile
      // is fully on screen — avoids a visible "frame freeze" while the
      // browser scrambles to decode the first GOP.
      { threshold: 0.1, rootMargin: "0px 0px 200px 0px" }
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("loadeddata", onCanPlay);
    };
  }, [fallingKind, pingPongEnabled, prefersReducedMotion]);

  // Ping-pong playback — forward, then reverse, forever. No loop-reset jump.
  // Gated by IntersectionObserver so the RAF only runs while the tile is
  // actually on screen — scrubbing video.currentTime off-screen burns CPU
  // for zero visual benefit.
  useEffect(() => {
    if (!pingPongEnabled) return;
    const v = videoRef.current;
    if (!v) return;

    let raf = 0;
    let running = false;
    let last = 0;
    let dir = 1;
    v.pause();

    const tick = (now: number) => {
      if (!running) return;
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

    // Run the rAF loop only while the tile is on screen — an always-on
    // loop burns a frame callback per tile even when nothing is visible.
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(v);

    return () => { io.disconnect(); stop(); };
  }, [pingPongEnabled]);

  useEffect(() => {
    if (!isTouchDevice || prefersReducedMotion || project.kind !== "day-night")
      return;
    const id = window.setInterval(() => {
      setDayNightIsNight((prev) => !prev);
    }, 3200);
    return () => window.clearInterval(id);
  }, [isTouchDevice, prefersReducedMotion, project.kind]);

  // Cancel any in-flight reverse RAF when the tile unmounts
  useEffect(() => {
    return () => cancelAnimationFrame(hoverVideoReverseRaf.current);
  }, []);

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
    // Hover-video: behaviour depends on progress through the video.
    // < 50% → reverse back to start.
    // ≥ 50% → continue playing to the end and hold the last frame.
    const hv = hoverVideoRef.current;
    if (hv) {
      cancelAnimationFrame(hoverVideoReverseRaf.current);
      const progress = hv.duration > 0 ? hv.currentTime / hv.duration : 0;

      if (progress >= 0.5) {
        // Past halfway — let it finish naturally; onEnded holds the last frame
        return;
      }

      // Under halfway — reverse back to start
      hv.pause();
      hoverVideoEndedRef.current = false;
      if (hv.currentTime <= 0.02) {
        hv.currentTime = 0;
        return;
      }
      const REVERSE_SPEED = 0.7;
      // Step back one frame synchronously to eliminate the freeze-then-jolt gap
      hv.currentTime = Math.max(0, hv.currentTime - REVERSE_SPEED / 60);
      let last = performance.now();
      const tick = (now: number) => {
        const delta = Math.min((now - last) / 1000, 0.05);
        last = now;
        const next = hv.currentTime - REVERSE_SPEED * delta;
        if (next <= 0) {
          hv.currentTime = 0;
          return;
        }
        hv.currentTime = next;
        hoverVideoReverseRaf.current = requestAnimationFrame(tick);
      };
      hoverVideoReverseRaf.current = requestAnimationFrame(tick);
    }
  };
  const onEnter = () => {
    setHovered(true);
    // Hover-video: cancel any ongoing reverse, play forward from the start
    const hv = hoverVideoRef.current;
    if (hv) {
      cancelAnimationFrame(hoverVideoReverseRaf.current);
      hoverVideoEndedRef.current = false;
      hv.currentTime = 0;
      hv.play().catch(() => {});
    }
  };

  const kind = project.kind ?? "image";
  const cursorLabel = project.externalUrl
    ? "YOUTUBE ↗"
    : kind === "video" || kind === "hover-video"
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
      // Keyboard parity: focus mirrors hover so tab users get the same
      // visual feedback (tilt state + hover-video) as mouse users.
      onFocus={onEnter}
      onBlur={onLeave}
      // The "YOUTUBE ↗" cue is cursor-only, so tell screen reader users a
      // new tab is coming (WCAG 3.2.2). Internal tiles keep their visible
      // text as the accessible name.
      aria-label={
        project.externalUrl
          ? `${project.title} (opens on YouTube in a new tab)`
          : undefined
      }
      data-cursor="view"
      data-cursor-label={cursorLabel}
      className="hover-tile group relative block w-full h-full text-left"
      // Pin --paper/--ink locally so overlay text stays readable on both
      // light and dark themes (tiles always sit over darkened imagery).
      style={
        {
          perspective: "1000px",
          "--paper": "#fffdf8",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
    >
      <motion.div
        style={
          enableParallax
            ? { rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }
            : undefined
        }
        className="relative h-full w-full overflow-hidden rounded-2xl"
      >
        <div
          className="hover-tile-media absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease)]"
          style={{ background: project.bg ?? "#0a0a0a" }}
        >
          <motion.div
            ref={mediaRef}
            className="absolute"
            // Desktop: 1.3× parallaxStrength inset so the media always extends
            // beyond the tile further than the max Y translation, guaranteeing
            // the tile's own background never leaks through.
            // Touch: parallax is disabled, so no inset is needed.
            style={
              enableParallax
                ? {
                    y: mediaY,
                    inset: `-${Math.ceil(parallaxStrength * 1.3)}px`,
                  }
                : { inset: 0 }
            }
          >
            {kind === "image" && project.image && (
              <Image
                src={project.image}
                alt={project.alt ?? project.title}
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
                  alt={project.alt ? `${project.alt} (day)` : `${project.title} (day)`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-[1200ms] ease-[var(--ease)] opacity-100 group-hover:opacity-0"
                  style={{ opacity: isTouchDevice ? (dayNightIsNight ? 0 : 1) : undefined }}
                />
                <Image
                  src={project.imageHover}
                  alt={project.alt ? `${project.alt} (night)` : `${project.title} (night)`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-[1200ms] ease-[var(--ease)] opacity-0 group-hover:opacity-100"
                  style={{ opacity: isTouchDevice ? (dayNightIsNight ? 1 : 0) : undefined }}
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
                // "metadata" everywhere: cheap (just the moov atom + first
                // keyframe) but gives play() a chance to start without the
                // browser refusing because no data is buffered. Critical for
                // iOS Safari mobile autoplay during scroll.
                preload="metadata"
                onEnded={(e) => {
                  // Belt + braces: restart manually if the browser drops the loop.
                  const el = e.currentTarget;
                  el.currentTime = 0;
                  el.play().catch(() => {});
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {kind === "hover-video" && project.video && (
              <>
                {/* Mobile: static image — video never loads so we need a visible fallback */}
                {isTouchDevice && project.videoPoster && (
                  <Image
                    src={project.videoPoster}
                    alt={project.alt ?? project.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
                {/* Desktop: video element — preloads and shows frame 0 at idle */}
                {!isTouchDevice && (
                  <video
                    ref={hoverVideoRef}
                    src={project.video}
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={(e) => {
                      // Seek to frame 0 so the browser renders the first video frame
                      // instead of a blank/black surface before first hover
                      e.currentTarget.currentTime = 0.001;
                    }}
                    onEnded={() => {
                      // Hold the last frame — do NOT reset. Reverse animation on leave.
                      hoverVideoEndedRef.current = true;
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </>
            )}

            {kind === "falling" && <FallingOnSky />}
          </motion.div>
        </div>


        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55 pointer-events-none" />

        <div className="absolute top-5 left-6 right-6 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/90 mix-blend-difference">
          <span>({String(index + 1).padStart(2, "0")})</span>
          <span>{project.year}</span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-paper">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/80 mb-1">
            {project.category} · {project.client}
          </div>
          <h3 className="font-display text-xl md:text-2xl lg:text-3xl leading-[1.05] tracking-tight">
            <ScrambleText text={project.title} active={hovered} lockWidth />
          </h3>
        </div>
      </motion.div>
    </button>
  );
}

// Tiles live inside WorkGallery's motion track — without memo, every
// parent animation frame would re-render all 15 tiles. Props are stable
// (project objects are module-level, onOpen is a parent arrow), so shallow
// equality is sufficient.
export default memo(ProjectTile);

function FallingOnSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    preloadFallingFrames();
  }, []);

  // Ping-pong canvas draw loop — gated by IntersectionObserver so we only
  // burn CPU decoding + painting frames while the tile is actually visible.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion: draw the first frame once it has decoded, then stop —
    // no ping-pong loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let raf = 0;
      const drawOnce = () => {
        const img = getFallingFrameByIndex(0);
        if (!img || !img.complete || img.naturalWidth === 0) {
          raf = requestAnimationFrame(drawOnce);
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      raf = requestAnimationFrame(drawOnce);
      return () => cancelAnimationFrame(raf);
    }

    let isVisible = false;
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const FPS = 24;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let dir = 1;
    let lastIdx = -1;
    const totalT = FALLING_FRAME_COUNT / FPS;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!isVisible) { last = now; return; }
      const delta = Math.min(0.1, (now - last) / 1000);
      last = now;
      t += dir * delta;
      if (t >= totalT) {
        t = totalT;
        dir = -1;
      } else if (t <= 0) {
        t = 0;
        dir = 1;
      }
      const idx = Math.min(
        FALLING_FRAME_COUNT - 1,
        Math.max(0, Math.floor(t * FPS)),
      );
      if (idx === lastIdx) return;
      const img = getFallingFrameByIndex(idx);
      if (!img || !img.complete || img.naturalWidth === 0) return;
      lastIdx = idx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(tick);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

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
        className="cloud-drift absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          backgroundImage: "url(/work/imported/bg/cloud-long.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={FALLING_FRAME_WIDTH}
          height={FALLING_FRAME_HEIGHT}
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
