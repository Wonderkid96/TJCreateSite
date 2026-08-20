"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { useMediaQuery } from "@/lib/use-media-query";
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
  // True while the cursor/focus is on the tile. Read by the video's
  // onCanPlay so a clip that was still buffering on first hover starts
  // as soon as it has data, instead of silently staying on the poster.
  const hoverVideoActiveRef = useRef(false);
  const hoverVideoReverseRaf = useRef(0);
  // Hydration-safe: false on the server and the first client render, real
  // value after — the render branches below (hover-video, parallax insets)
  // must match server HTML or React throws #418 on touch devices.
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  // Gates autoplay and JS-driven motion (WCAG 2.2.2 / 2.3.3). Posters and
  // static frames render instead.
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [dayNightIsNight, setDayNightIsNight] = useState(false);
  // hover-video: true whenever the static poster still should be showing
  // (never hovered yet, or fully rewound back to it). Flips false the
  // moment playback starts, and back to true once the leave-rewind
  // reaches the start — so the tile always settles back on the thumbnail.
  const [hoverVideoIdle, setHoverVideoIdle] = useState(true);

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

  // Hover-video tiles render with preload="none" so an off-screen tile
  // costs nothing. Promote to "metadata" once the tile is close to the
  // viewport: that fetches the moov atom and first frames, so the first
  // hover starts near-instantly without having pulled the whole clip.
  // Same promotion pattern the kind === "video" branch above uses.
  useEffect(() => {
    if (isTouchDevice || project.kind !== "hover-video") return;
    const v = hoverVideoRef.current;
    if (!v) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (v.preload === "none") {
            v.preload = "metadata";
            try { v.load(); } catch {}
          }
          // One-shot: once promoted there is nothing left to watch for.
          io.disconnect();
        }
      },
      // Generous bottom margin so the promotion lands before the tile
      // is actually on screen.
      { threshold: 0, rootMargin: "0px 0px 400px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [isTouchDevice, project.kind]);

  const onLeave = () => {
    // Hover-video: always rewind back to the start (and the poster still
    // takes back over) regardless of how far playback got — the tile
    // should never settle on a mid- or end-of-clip frame.
    const hv = hoverVideoRef.current;
    if (hv) {
      cancelAnimationFrame(hoverVideoReverseRaf.current);
      hoverVideoActiveRef.current = false;
      hv.pause();

      if (hv.currentTime <= 0.02) {
        hv.currentTime = 0;
        setHoverVideoIdle(true);
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
          setHoverVideoIdle(true);
          return;
        }
        hv.currentTime = next;
        hoverVideoReverseRaf.current = requestAnimationFrame(tick);
      };
      hoverVideoReverseRaf.current = requestAnimationFrame(tick);
    }
  };
  const onEnter = () => {
    // Same WCAG 2.3.3 gate as every other autoplay path in this file: with
    // reduced motion on, hover/focus keeps the static poster.
    if (prefersReducedMotion) return;
    // Hover-video: cancel any ongoing reverse, play forward from the start
    const hv = hoverVideoRef.current;
    if (hv) {
      cancelAnimationFrame(hoverVideoReverseRaf.current);
      hoverVideoActiveRef.current = true;
      // First hover on a still-deferred clip: promote to full buffering.
      // The poster stays up until playback actually starts, so the wait
      // is invisible, and onCanPlay below starts it once data arrives.
      if (hv.preload !== "auto") {
        hv.preload = "auto";
        try { hv.load(); } catch {}
      }
      setHoverVideoIdle(false);
      hv.currentTime = 0;
      hv.play().catch(() => {});
    }
  };

  const kind = project.kind ?? "image";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      // Keyboard parity: focus mirrors hover so tab users get the same
      // visual feedback (hover-video) as mouse users.
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
      className="hover-tile group relative block w-full h-full text-left"
      // Pin --paper/--ink locally so overlay text stays readable on both
      // light and dark themes (tiles always sit over darkened imagery).
      style={
        {
          "--paper": "#fffdf8",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2px]">
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
                style={{ objectPosition: project.focal }}
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
                  style={{ objectPosition: project.focal, opacity: isTouchDevice ? (dayNightIsNight ? 0 : 1) : undefined }}
                />
                <Image
                  src={project.imageHover}
                  alt={project.alt ? `${project.alt} (night)` : `${project.title} (night)`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-[1200ms] ease-[var(--ease)] opacity-0 group-hover:opacity-100"
                  style={{ objectPosition: project.focal, opacity: isTouchDevice ? (dayNightIsNight ? 1 : 0) : undefined }}
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
                style={{ objectPosition: project.focal }}
              />
            )}

            {kind === "hover-video" && project.video && (
              <>
                {/* Poster still — the resting thumbnail on every device.
                    On desktop it crossfades out on hover and back in once
                    the leave-rewind reaches the start; on touch it's the
                    only thing rendered, since the video below never mounts. */}
                {project.videoPoster && (
                  <Image
                    src={project.videoPoster}
                    alt={project.alt ?? project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-opacity duration-300 ease-[var(--ease)] ${
                      isTouchDevice || hoverVideoIdle ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ objectPosition: project.focal }}
                    priority={index < 2}
                  />
                )}
                {/* Desktop: video element, hidden until hover starts it. */}
                {!isTouchDevice && (
                  <video
                    ref={hoverVideoRef}
                    src={project.video}
                    muted
                    playsInline
                    // Deferred: with 8 hover-video tiles on the page,
                    // preload="auto" pulled ~12.5MB down on every desktop
                    // visit whether or not the tile was ever scrolled to,
                    // competing with the hero video for bandwidth. The
                    // observer effect above promotes this to "metadata"
                    // as the tile nears the viewport, and onEnter promotes
                    // it to "auto" on first hover.
                    preload="none"
                    onCanPlay={() => {
                      // Buffering finished after the hover already started.
                      const hv = hoverVideoRef.current;
                      if (!hv || !hoverVideoActiveRef.current || !hv.paused) return;
                      hv.play().catch(() => {});
                    }}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-[var(--ease)] ${
                      hoverVideoIdle ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ objectPosition: project.focal }}
                  />
                )}
              </>
            )}

            {kind === "falling" && <FallingOnSky />}
          </motion.div>
        </div>


        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55 pointer-events-none" />

        {/* Year only. The `(01)` bracket-counter that used to sit opposite is
            retired brand-wide: it read as CAD annotation and numbered the work
            for no reason a visitor cares about. */}
        <div className="absolute top-5 left-6 right-6 flex items-start justify-end font-mono text-[10px] uppercase tracking-[0.2em] text-paper/90 mix-blend-difference">
          <span>{project.year}</span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-paper">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/80 mb-1">
            {project.category} · {project.client}
          </div>
          <h3 className="font-display text-xl md:text-2xl lg:text-3xl leading-[1.05] tracking-tight">
            {project.title}
          </h3>
        </div>
      </div>
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
  // Gates both the frame-sequence preload and the cloud background-image —
  // both are fetch-triggering and both belong to one below-the-fold tile,
  // so one observer promotes both together instead of running two.
  const [tileNear, setTileNear] = useState(false);

  // The 82-frame sequence is 743KB across 42 requests (mobile stride) even
  // with fetchPriority "low" on every frame — low priority still consumes
  // real connection slots and bandwidth. cloud-bg (globals.css) is another
  // 67-270KB CSS background-image with no lazy mechanism at all — browsers
  // fetch a matched background-image as soon as the element exists in the
  // DOM, regardless of scroll position. Neither should start until this
  // tile (one of 15 in the grid) is actually near the viewport.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          preloadFallingFrames();
          setTileNear(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "800px 0px" }
    );
    io.observe(canvas);
    return () => io.disconnect();
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
        className={`cloud-drift bg-center absolute inset-0 opacity-60 ${
          tileNear ? "cloud-bg cloud-blend" : ""
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
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
