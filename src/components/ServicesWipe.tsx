"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";
import { SERVICES } from "@/lib/content";
import { EASE } from "@/lib/motion";
import WorkPackages from "./WorkPackages";
import { getLenis } from "@/lib/lenis";

/**
 * Services as a wipe sequence: each discipline is a full-screen brand-colour
 * panel that wipes up over the previous one as you scroll. One wipe grammar,
 * contained to this one section — not sprinkled across the page.
 *
 * Mechanism is the same sticky-pin the Showreel uses: a tall runway holds a
 * pinned viewport-height stage with the panels stacked absolutely inside it.
 * Scroll position decides which panels should be shown; each reveals with a
 * time-based eased clip-path wipe, so the ease always plays no matter how fast
 * you scroll. No new dependency, no scroll-snap.
 *
 * The wrapper must NOT be overflow-hidden — that would break the sticky stage.
 * The clip lives on the panels; the stage clips its own overflow instead.
 */

type PanelTheme = { bg: string; fg: string; accent: string };

// Monochrome sequence: paper → ink → paper → ink. The panels MUST alternate — the
// wipe effect lives on the reveal line, so three panels of the same colour
// would make each transition invisible. Alternating gives every reveal the
// hardest possible edge.
//
// Everything on a panel (title, full stop, blurb, eyebrow, item dots) takes
// the same tone; `accent` is the fg value so the bullet dots stay monochrome
// rather than reintroducing colour. The title full stop is part of the
// heading text, so it inherits fg too.
// There must be one theme per service, alternating: THEMES is indexed modulo
// its own length, so a service added without a matching theme here wraps round
// and can land the same colour as the panel below it, killing the reveal edge.
const THEMES: PanelTheme[] = [
  { bg: "#ffffff", fg: "#0a0a0a", accent: "#0a0a0a" }, // Paper — Graphic
  { bg: "#0a0a0a", fg: "#ffffff", accent: "#ffffff" }, // Ink   — Motion
  { bg: "#ffffff", fg: "#0a0a0a", accent: "#0a0a0a" }, // Paper — 3D
  { bg: "#0a0a0a", fg: "#ffffff", accent: "#ffffff" }, // Ink — Packages
];

// Runway height per panel, in svh. Taller means each panel holds fully on
// screen for longer before the next reveals, so the sequence can't be scrolled
// past by accident.
const RUNWAY_PER_PANEL_VH = 130;

// Reveals are TIME-BASED, not scroll-position-linked: crossing a panel's
// trigger point plays a fixed eased clip animation over REVEAL_DURATION,
// however fast you are scrolling. Scroll-linking let a quick scroll cross a
// whole reveal in one frame and skip the ease (the "hard hit" and the flicker
// on fast mouse scrolling). Time-based can't be outrun.
const REVEAL_DURATION = 0.75; // seconds
// Deadband around each trigger so hovering on the boundary can't flip a panel
// on and off: it reveals at the trigger, and only hides once scrolled back
// past it by this much.
const REVEAL_HYSTERESIS = 0.06;

export default function ServicesWipe() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const compact = useMediaQuery("(max-width: 1023px), (max-height: 760px)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const atPackageDestination = useRef(true);
  const total = SERVICES.length;
  // Which panels are currently called up. Panel 0 is the base, always shown;
  // the others flip as their trigger points pass. Kept as discrete booleans so
  // the reveal itself is a time-based tween, decoupled from scroll velocity.
  const [shown, setShown] = useState<boolean[]>(() =>
    SERVICES.map((_, i) => i === 0)
  );

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setShown((prev) => {
      let changed = false;
      const next = prev.slice();
      for (let i = 1; i < total; i++) {
        const trigger = i / total; // panel i is called up here
        if (!prev[i] && p >= trigger) {
          next[i] = true;
          changed = true;
        } else if (prev[i] && p < trigger - REVEAL_HYSTERESIS) {
          next[i] = false;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  });

  // Remember proximity before a resize: the new layout can move the anchor
  // outside the viewport before the resize callback gets to inspect it.
  useEffect(() => {
    let frame = 0;
    let aligning = false;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const align = () => {
      if (window.location.hash !== "#packages" || !atPackageDestination.current) return;
      cancelAnimationFrame(frame);
      aligning = true;
      frame = requestAnimationFrame(() => {
        const anchor = document.getElementById("packages");
        if (anchor) {
          const lenis = getLenis();
          if (lenis) {
            lenis.resize();
            lenis.scrollTo(anchor, { immediate: true, force: true });
          } else {
            anchor.scrollIntoView({ behavior: "instant", block: "start" });
          }
          if (!compact && !reduced) setShown(SERVICES.map(() => true));
        }
        width = window.innerWidth;
        height = window.innerHeight;
        aligning = false;
      });
    };
    const trackPosition = () => {
      if (window.location.hash !== "#packages") {
        atPackageDestination.current = false;
        return;
      }
      if (aligning || width !== window.innerWidth || height !== window.innerHeight) return;
      const anchor = document.getElementById("packages");
      atPackageDestination.current = !!anchor && Math.abs(anchor.getBoundingClientRect().top) < height / 2;
    };
    const resize = () => {
      align();
      width = window.innerWidth;
      height = window.innerHeight;
    };
    const hashChange = () => {
      atPackageDestination.current = window.location.hash === "#packages";
      align();
    };
    align();
    window.addEventListener("hashchange", hashChange);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", trackPosition, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", hashChange);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", trackPosition);
    };
  }, [compact, reduced]);

  // Reduced motion: no pin, no clip — just the panels stacked full-height so
  // every service is reachable by plain scrolling.
  if (reduced || compact) {
    return (
      <div ref={ref} id="services" className="services-static" role="region" aria-label="Services — what I do">
        <h2 className="sr-only">Services</h2>
        {SERVICES.map((s, i) => (
          <div key={s.title} id={s.title === "Packages" ? "packages" : undefined} tabIndex={s.title === "Packages" ? -1 : undefined} style={s.title === "Packages" ? { scrollMarginTop: 68 } : undefined}>
            <PanelFace service={s} theme={THEMES[i % THEMES.length]} index={i} compact />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id="services"
      role="region"
      aria-label="Services — what I do"
      className="relative"
      style={{ height: `${total * RUNWAY_PER_PANEL_VH}svh` }}
    >
      <h2 className="sr-only">Services</h2>
      <div
        id="packages"
        tabIndex={-1}
        aria-label="Packages"
        className="pointer-events-none absolute h-px w-px"
        style={{ top: "calc(85% - 85svh)", scrollMarginTop: 0 }}
      />
      <div className="sticky top-0 h-svh overflow-hidden">
        {SERVICES.map((s, i) => (
          <WipePanel
            key={s.title}
            service={s}
            theme={THEMES[i % THEMES.length]}
            index={i}
            shown={shown[i]}
          />
        ))}
      </div>
    </div>
  );
}

interface WipePanelProps {
  service: (typeof SERVICES)[number];
  theme: PanelTheme;
  index: number;
  shown: boolean;
}

function WipePanel({ service, theme, index, shown }: WipePanelProps) {
  // Panel 0 is the visible base; the rest wipe in from the bottom via a
  // time-based eased clip. initial={false} means nothing animates on mount —
  // the wipe only plays when `shown` actually flips as the trigger passes.
  return (
    <motion.div
      className="absolute inset-0"
      inert={!shown}
      style={{ zIndex: index }}
      initial={false}
      animate={{ clipPath: shown ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
      transition={{ duration: REVEAL_DURATION, ease: EASE }}
    >
      <PanelFace service={service} theme={theme} index={index} />
    </motion.div>
  );
}

// Every region is anchored to a fixed position (not flex-spread), and the
// title sits in a fixed-height slot, so the eyebrow, heading and blurb begin
// at the exact same point on every panel no matter how many lines the title
// runs to. That is what makes the wipe read as the words changing in place
// rather than the layout jumping between slides.
//
// TITLE_SLOT reserves two lines of the heading (leading 0.9 → 1.8em); the
// longest title ("Motion Graphics") is two lines, so the blurb always starts
// at slot-top + 1.8em + gap, identical across panels.
const TITLE_SLOT = "1.8em";
// Vertical anchor of the title block, as a fraction of the panel height.
const BLOCK_TOP = "36%";

function PanelFace({
  service,
  theme,
  index,
  compact = false,
}: {
  service: (typeof SERVICES)[number];
  theme: PanelTheme;
  index: number;
  compact?: boolean;
}) {

  return (
    <div
      data-no-reveal={service.title === "Packages" ? true : undefined}
      className={compact ? "service-static-panel relative w-full px-6 py-14" : "relative h-svh w-full overflow-hidden"}
      style={{ backgroundColor: theme.bg, color: theme.fg }}
    >
      {/* Eyebrow — locked to the top. */}
      <div className={`${compact ? "mb-10" : "absolute inset-x-8 top-24 md:inset-x-14"} flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em]`}>
        <span style={{ opacity: 0.7 }}>Services</span>
        <span style={{ opacity: 0.7 }}>
          {String(index + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Title + blurb — anchored at a fixed vertical position with a
          fixed-height title slot, so both start at the same point every time. */}
      <div className={compact ? "" : "absolute inset-x-8 md:inset-x-14"} style={{ top: compact ? undefined : BLOCK_TOP }}>
        <h3
          className="font-display uppercase text-[clamp(2.2rem,7vw,5.5rem)] leading-[0.9] tracking-tight"
          style={{ minHeight: compact ? undefined : TITLE_SLOT }}
        >
          {service.title}.
        </h3>
        {service.title === "Packages" ? <WorkPackages compact={compact} /> : <>
        <p
          className="mt-6 max-w-xl text-lg leading-relaxed"
          style={{ opacity: 0.9 }}
        >
          {service.blurb}
        </p>

        {/* Capabilities sit directly under the description. */}
        <div className="mt-8">
          <div
            className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em]"
            style={{ opacity: 0.7 }}
          >
            Capabilities
          </div>
          <ul className="flex max-w-xl flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] md:text-xs">
            {service.items.map((it) => (
              <li key={it} className="flex items-center gap-3">
                <span
                  className="inline-block h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
                {it}
              </li>
            ))}
          </ul>
        </div>
        </>}
      </div>
    </div>
  );
}
