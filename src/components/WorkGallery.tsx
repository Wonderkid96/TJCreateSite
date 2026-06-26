"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { PROJECTS, type Project } from "@/lib/content";
import ProjectTile from "./ProjectTile";
import ProjectModal from "./ProjectModal";

// Per-tile parallax strength (px) for the inner media layer.
const PARALLAX = [30, 40, 55, 25, 45, 50, 20, 42, 60];

// Past this much pointer travel a press counts as a drag, not a click, so we
// suppress the tile's open action when the user was scrubbing the row.
const DRAG_THRESHOLD_PX = 6;

/**
 * Selected work. Desktop locks the section to the screen and maps vertical
 * scroll onto horizontal travel, sliding a single large row of square tiles
 * sideways so the whole catalogue passes through one pinned viewport (still
 * native vertical scroll — only the visual axis is remapped). Mobile /
 * reduced-motion get a plain swipeable strip with no pinning.
 */
export default function WorkGallery() {
  const [active, setActive] = useState<Project | null>(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);
  // Scroll distance the lock spans. Capped so a long row pans briskly instead
  // of trapping the user for many screens of scroll.
  const [lockPx, setLockPx] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Measure how far the track must travel so the last column ends flush, then
  // re-measure on resize / content changes.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) {
        setMaxX(0);
        setLockPx(0);
        return;
      }
      // Travel is measured against the inset viewport (not the full window) so
      // the last column lands flush inside the right gutter.
      const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setMaxX(travel);
      // Cap the lock at ~4 screens — beyond that the horizontal pan just runs
      // faster per scroll rather than locking the user in place for longer.
      setLockPx(Math.min(travel, window.innerHeight * 4));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isDesktop]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  const open = (p: Project) => {
    if (p.externalUrl) {
      window.open(p.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      setActive(p);
    }
  };

  const tile = (p: Project, i: number, sizeClass: string) => (
    <div key={p.slug} className={`shrink-0 ${sizeClass}`}>
      <ProjectTile
        project={p}
        index={i}
        parallaxStrength={PARALLAX[i % PARALLAX.length]}
        onOpen={() => open(p)}
      />
    </div>
  );

  const pin = isDesktop && !reduce;

  return (
    <>
      {pin ? (
        // Desktop: pinned, vertical scroll drives horizontal travel. The slot is
        // one viewport tall plus the horizontal distance, so the mapping is 1:1.
        <section
          ref={sectionRef}
          id="work"
          aria-label="Selected work"
          className="relative bg-paper"
          style={{ height: `calc(100svh + ${lockPx}px)` }}
        >
          <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-10 md:pt-14">
            <Header className="mb-6 md:mb-8" />
            {/* Inset viewport: side gutters match the other sections' padding,
                so the gallery stays contained instead of bleeding to the edge. */}
            <div
              ref={viewportRef}
              className="relative mx-6 min-h-0 flex-1 overflow-hidden md:mx-10"
            >
              <motion.div
                ref={trackRef}
                style={{ x }}
                className="absolute inset-y-0 left-0 flex items-center gap-6 pb-10 will-change-transform lg:gap-8"
              >
                {PROJECTS.map((p, i) =>
                  tile(p, i, "h-full max-h-[560px] aspect-square")
                )}
              </motion.div>
            </div>
          </div>
        </section>
      ) : (
        // Mobile / reduced-motion: single swipeable strip, no pinning. The ref
        // is still attached here so useScroll always has a hydrated target
        // (the desktop transform just isn't consumed in this branch).
        <section
          ref={sectionRef}
          id="work"
          aria-label="Selected work"
          className="relative bg-paper py-24 md:py-32"
        >
          <Header />
          <DragScroll className="flex gap-5 px-6 pb-4">
            {PROJECTS.map((p, i) =>
              tile(p, i, "aspect-square w-[78vw] sm:w-[48vw]")
            )}
          </DragScroll>
        </section>
      )}

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}

type DragScrollProps = {
  children: React.ReactNode;
  className?: string;
  /** Enable click-and-drag scrubbing (desktop only — trackpads swipe natively). */
  enableDrag?: boolean;
};

/**
 * Horizontal overflow container with optional click-and-drag scrubbing. Native
 * scroll stays the source of truth (keyboard, trackpad, scrollbar all work); we
 * only translate a mouse drag into scrollLeft and suppress the click that would
 * otherwise open a tile mid-drag.
 */
function DragScroll({ children, className = "", enableDrag = false }: DragScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [grabbing, setGrabbing] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    setGrabbing(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setGrabbing(false);
  };

  // Swallow the click that follows a drag so the user doesn't open a tile they
  // were only scrubbing past.
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      className={`overflow-x-auto ${enableDrag ? (grabbing ? "cursor-grabbing select-none" : "cursor-grab") : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function Header({ className = "mb-8 md:mb-12" }: { className?: string }) {
  return (
    <div className={`px-6 md:px-10 ${className}`}>
      <h2 className="section-heading">Selected work</h2>
    </div>
  );
}
