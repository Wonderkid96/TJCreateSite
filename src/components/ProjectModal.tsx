"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/content";
import {
  FALLING_FRAME_COUNT,
  FALLING_FRAME_HEIGHT,
  FALLING_FRAME_WIDTH,
  getFallingFrameByIndex,
  preloadFallingFrames,
} from "@/lib/falling-frames";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  // Ancestor transforms (framer-motion, parallax, ThemeProvider, etc.)
  // create new containing blocks that break `position: fixed`, making the
  // overlay inherit the full-page height of its parent instead of the
  // viewport. Rendering into document.body via portal dodges that entirely.
  if (!mounted) return null;

  const tree = (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] bg-ink/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-4 md:inset-10 overflow-hidden rounded-[3px] bg-paper text-ink flex flex-col"
          >
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-line">
              <div className="flex items-baseline gap-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {project.category}
                </div>
                <div className="font-display text-2xl md:text-3xl leading-none tracking-tight">
                  {project.title}
                </div>
                <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {project.client} · {project.year}
                </div>
              </div>

              <button
                onClick={onClose}
                data-cursor="hover"
                className="font-mono text-[11px] uppercase tracking-[0.2em] hover:text-accent transition-colors flex items-center gap-3"
              >
                <span className="hidden md:inline">Close</span>
                <span className="relative w-5 h-5">
                  <span className="absolute inset-0 m-auto w-full h-px bg-current rotate-45" />
                  <span className="absolute inset-0 m-auto w-full h-px bg-current -rotate-45" />
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 p-6 md:p-10">
                <div
                  // Fixed aspect + minimum height give the media area an
                  // intrinsic size. Without this, every `kind` collapses to
                  // 0×0 because its children are all absolute / fill, and
                  // grid row stretch can't pick up a height to match.
                  className="md:col-span-8 relative w-full overflow-hidden rounded-[2px] aspect-[4/5] md:aspect-auto md:min-h-[65vh] lg:min-h-[70vh]"
                  style={{ background: project.bg ?? "#111" }}
                >
                  <ModalMedia project={project} />
                </div>

                <aside className="md:col-span-4 flex flex-col gap-10">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
                      Overview
                    </div>
                    <p className="font-display text-2xl md:text-3xl leading-snug tracking-tight">
                      {project.blurb}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-line pt-6">
                    <Meta k="Client" v={project.client} />
                    <Meta k="Year" v={project.year} />
                    <Meta k="Category" v={project.category} />
                    <Meta k="Tags" v={project.tags.join(" · ")} />
                  </dl>

                  <div className="mt-auto font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    More detail on request.{" "}
                    <a
                      href={`mailto:hello@tjcreate.co.uk?subject=${encodeURIComponent("RE: " + project.title)}`}
                      data-cursor="hover"
                      className="text-ink hover:text-accent transition-colors"
                    >
                      hello@tjcreate.co.uk
                    </a>
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(tree, document.body);
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
        {k}
      </dt>
      <dd className="text-base">{v}</dd>
    </div>
  );
}

function ModalMedia({ project }: { project: Project }) {
  const kind = project.kind ?? "image";
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [dayNightIsNight, setDayNightIsNight] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!isTouchDevice || kind !== "day-night") return;
    const id = window.setInterval(() => {
      setDayNightIsNight((prev) => !prev);
    }, 3200);
    return () => window.clearInterval(id);
  }, [isTouchDevice, kind]);

  if (kind === "image" && project.image) {
    return (
      <Image
        src={project.image}
        alt={project.alt ?? project.title}
        fill
        sizes="(max-width: 768px) 100vw, 66vw"
        className="object-cover"
      />
    );
  }

  if (kind === "day-night" && project.image && project.imageHover) {
    return (
      <div className="group absolute inset-0">
        <Image
          src={project.image}
          alt={project.alt ? `${project.alt} (day)` : `${project.title} (day)`}
          fill
          sizes="66vw"
          className="object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(.2,.8,.2,1)] opacity-100 group-hover:opacity-0"
          style={{ opacity: isTouchDevice ? (dayNightIsNight ? 0 : 1) : undefined }}
        />
        <Image
          src={project.imageHover}
          alt={project.alt ? `${project.alt} (night)` : `${project.title} (night)`}
          fill
          sizes="66vw"
          className="object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(.2,.8,.2,1)] opacity-0 group-hover:opacity-100"
          style={{ opacity: isTouchDevice ? (dayNightIsNight ? 1 : 0) : undefined }}
        />
        <div className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/90 bg-ink/70 px-2 py-1 rounded-sm pointer-events-none">
          {isTouchDevice ? "Day ↔ Night" : "Hover → flip"}
        </div>
      </div>
    );
  }

  if (kind === "video" && project.video) {
    return (
      <video
        src={project.video}
        autoPlay
        muted
        loop
        playsInline
        controls
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  if (kind === "falling") {
    return <FallingModalMedia />;
  }

  return null;
}

function FallingModalMedia() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    preloadFallingFrames();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FPS = 24;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let dir = 1;
    let lastIdx = -1;
    const totalT = FALLING_FRAME_COUNT / FPS;

    // Ping-pong playback — advance forward to the last frame, then reverse
    // back to the first, repeating forever. Matches the tile preview so
    // the motion feels continuous between preview and expanded modal.
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
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
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <Image
        src="/work/imported/bg/sky-long.avif"
        alt=""
        fill
        sizes="66vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          backgroundImage: "url(/work/imported/bg/cloud-long.avif)",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={FALLING_FRAME_WIDTH}
          height={FALLING_FRAME_HEIGHT}
          className="h-[70%] w-auto object-contain"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 65% at 50% 50%, black 55%, transparent 92%)",
            maskImage:
              "radial-gradient(ellipse 55% 65% at 50% 50%, black 55%, transparent 92%)",
          }}
        />
      </div>
    </>
  );
}
