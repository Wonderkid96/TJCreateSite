"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/content";
import { useMounted } from "@/lib/use-mounted";
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
  // Portal only after mount so SSR and the client's first render match —
  // same pattern as Clients.tsx (avoids a hydration mismatch).
  const mounted = useMounted();
  const dialogRef = useRef<HTMLDivElement>(null);
  // Portal target's own top-level node — used to tell it apart from its
  // siblings in document.body when marking the rest of the page inert.
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus trap + return-focus: when the modal opens, remember whatever was
  // focused (the tile button), move focus to the close control, cycle Tab
  // within the dialog, and restore focus on close so keyboard users land
  // back on the tile they came from. WCAG 2.1.2 / 2.4.3.
  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    const getFocusable = () =>
      dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
            ),
          ).filter((el) => el.offsetParent !== null || el === document.activeElement)
        : [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    // The dialog renders through a portal straight into <body>, so its
    // siblings there (Nav, main, ContactFab, BackToTop, ...) are exactly what
    // a screen reader's virtual cursor could still browse into behind the
    // overlay. `inert` removes them from the accessibility tree and the tab
    // order without touching layout. Derived from the DOM rather than a
    // hardcoded component list, and only elements we inert ourselves are
    // recorded, so cleanup never strips an `inert` set for another reason.
    const overlay = overlayRef.current;
    const inertedSiblings: HTMLElement[] = [];
    if (overlay) {
      Array.from(document.body.children).forEach((el) => {
        if (el !== overlay && el instanceof HTMLElement && !el.hasAttribute("inert")) {
          el.setAttribute("inert", "");
          inertedSiblings.push(el);
        }
      });
    }

    // Initial focus: the close button is the natural first target.
    const focusFrame = requestAnimationFrame(() => {
      const closeBtn = dialog?.querySelector<HTMLElement>("[data-modal-close]");
      closeBtn?.focus();
    });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(focusFrame);
      inertedSiblings.forEach((el) => el.removeAttribute("inert"));
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  // Ancestor transforms (framer-motion, parallax, etc.)
  // create new containing blocks that break `position: fixed`, making the
  // overlay inherit the full-page height of its parent instead of the
  // viewport. Rendering into document.body via portal dodges that entirely.
  if (!mounted) return null;

  const tree = (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] bg-ink/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-4 md:inset-10 overflow-hidden rounded-[2px] bg-paper text-ink flex flex-col focus:outline-none"
          >
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-line">
              <div className="flex items-baseline gap-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {project.category}
                </div>
                <h2
                  id="project-modal-title"
                  className="font-display text-2xl md:text-3xl leading-none tracking-tight"
                >
                  {project.title}
                </h2>
                <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {project.client} · {project.year}
                </div>
              </div>

              <button
                type="button"
                data-modal-close
                onClick={onClose}
                aria-label={`Close ${project.title} details`}
                // Padding + negative margin grow the hit area to ~44px
                // (WCAG 2.5.8) without shifting the visual layout.
                className="font-mono text-[11px] uppercase tracking-[0.2em] hover:text-accent-link transition-colors flex items-center gap-3 rounded-[2px] p-3 -m-3 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span className="hidden md:inline">Close</span>
                <span aria-hidden className="relative w-5 h-5">
                  <span className="absolute inset-0 m-auto w-full h-px bg-current rotate-45" />
                  <span className="absolute inset-0 m-auto w-full h-px bg-current -rotate-45" />
                </span>
              </button>
            </div>

            {/* No internal scroll — media + details adapt to fit the modal
                together. Media fills the available space, the detail column
                sits beside it on desktop and below it on mobile. */}
            <div className="min-h-0 flex-1 p-5 md:p-8">
              <div className="flex h-full flex-col gap-5 md:flex-row md:gap-8">
                <div
                  // Stable hook for the visual test suite (visual.spec.ts) —
                  // class-based selectors here have gone stale before.
                  data-modal-media
                  // min-h-[45%] (mobile only): with the column layout, a long
                  // overview would otherwise squeeze the media to a sliver —
                  // the aside's copy scrolls within the remainder instead.
                  className="relative min-h-[45%] flex-1 overflow-hidden rounded-[2px] md:min-h-0 md:flex-[1.7]"
                  style={{ background: project.bg ?? "#0a0a0a" }}
                >
                  <ModalMedia project={project} />
                </div>

                <aside className="flex min-h-0 flex-col gap-5 overflow-hidden md:w-[clamp(17rem,30%,23rem)] md:shrink-0">
                  {/* Scrollable on mobile so the full blurb stays reachable
                      once the media takes its guaranteed share; desktop keeps
                      the no-internal-scroll fit. */}
                  <div className="min-h-0 overflow-y-auto md:overflow-hidden">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Overview
                    </div>
                    <p className="text-sm leading-relaxed text-ink/85 md:text-[15px]">
                      {project.blurb}
                    </p>
                  </div>

                  <dl className="grid shrink-0 grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5">
                    <Meta k="Client" v={project.client} />
                    <Meta k="Year" v={project.year} />
                    <Meta k="Category" v={project.category} />
                    <Meta k="Tags" v={project.tags.join(" · ")} />
                  </dl>

                  <div className="mt-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    More detail on request.{" "}
                    <a
                      href={`mailto:hello@tjcreate.co.uk?subject=${encodeURIComponent("RE: " + project.title)}`}
                      className="text-ink hover:text-accent-link transition-colors"
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

// Memoised — only re-renders when the project reference changes (i.e. when a
// different tile is opened), not on every parent state tick.
const ModalMedia = memo(function ModalMedia({ project }: { project: Project }) {
  const kind = project.kind ?? "image";
  const [isTouchDevice] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
  );
  // Reduced-motion users get the poster/first frame; they can start
  // playback themselves where controls exist (WCAG 2.2.2).
  const [prefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [dayNightIsNight, setDayNightIsNight] = useState(false);

  useEffect(() => {
    if (!isTouchDevice || kind !== "day-night") return;
    const id = window.setInterval(() => {
      setDayNightIsNight((prev) => !prev);
    }, 3200); // 3.2 s per state — slow enough to feel intentional, not a rapid flash
    return () => window.clearInterval(id);
  }, [isTouchDevice, kind]);

  // An "image" tile can still carry a motion piece: the grid shows the still,
  // but the modal plays this video. Takes precedence over the static image.
  if (project.modalVideo) {
    return (
      <video
        src={project.modalVideo}
        poster={project.image}
        preload="none"
        autoPlay={!prefersReducedMotion}
        muted
        loop
        playsInline
        controls
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  // YouTube preview overrides all other media in the modal
  if (project.previewYouTubeId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${project.previewYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${project.previewYouTubeId}&controls=1&rel=0&modestbranding=1&playsinline=1`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
        title={project.title}
      />
    );
  }

  if (kind === "image" && project.image) {
    // Only steer the crop with `focal` when actually cropping (cover). With
    // "contain" the full frame is already visible — an off-centre position
    // would just shift it lopsided inside its own letterbox for no reason.
    const isContain = project.modalFit === "contain";
    return (
      <Image
        src={project.image}
        alt={project.alt ?? project.title}
        fill
        sizes="(max-width: 768px) 100vw, 66vw"
        className={isContain ? "object-contain" : "object-cover"}
        style={{ objectPosition: isContain ? undefined : project.focal }}
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
          className="object-cover transition-opacity duration-[1200ms] ease-[var(--ease)] opacity-100 group-hover:opacity-0"
          style={{ opacity: isTouchDevice ? (dayNightIsNight ? 0 : 1) : undefined }}
        />
        <Image
          src={project.imageHover}
          alt={project.alt ? `${project.alt} (night)` : `${project.title} (night)`}
          fill
          sizes="66vw"
          className="object-cover transition-opacity duration-[1200ms] ease-[var(--ease)] opacity-0 group-hover:opacity-100"
          style={{ opacity: isTouchDevice ? (dayNightIsNight ? 1 : 0) : undefined }}
        />
        <div className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/90 bg-ink/70 px-2 py-1 rounded-[2px] pointer-events-none">
          {isTouchDevice ? "Day ↔ Night" : "Hover → flip"}
        </div>
      </div>
    );
  }

  if (kind === "video" && project.video) {
    return (
      <video
        src={project.video}
        poster={project.videoPoster}
        preload="none"
        autoPlay={!prefersReducedMotion}
        muted
        loop
        playsInline
        controls
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  if (kind === "hover-video") {
    // Same fit/crop rules as the plain "image" kind — a product render on a
    // matching flat background (modalFit: "contain") needs the full frame
    // letterboxed rather than cropped, same as Health Plus/Huel/Game Boy.
    // `focal` only steers a cover crop; with contain the full frame already
    // shows, so an off-centre position would just shift it lopsided.
    const isContain = project.modalFit === "contain";
    const fitClass = isContain ? "object-contain" : "object-cover";
    const focalPosition = isContain ? undefined : project.focal;
    return (
      <>
        {/* Poster always visible — no black flash waiting for video */}
        {project.videoPoster && (
          <Image
            src={project.videoPoster}
            alt={project.alt ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className={fitClass}
            style={{ objectPosition: focalPosition }}
            priority
          />
        )}
        {project.video && (
          <video
            src={project.video}
            muted
            autoPlay={!prefersReducedMotion}
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 h-full w-full ${fitClass}`}
            style={{ objectPosition: focalPosition }}
          />
        )}
      </>
    );
  }

  if (kind === "falling") {
    return <FallingModalMedia />;
  }

  return null;
});

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
        className="cloud-bg cloud-blend absolute inset-0 opacity-60"
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
