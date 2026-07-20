"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { CLIENTS_WITH_LOGOS } from "@/lib/content";
import SectionTitle from "./SectionTitle";

// Gap between the cursor and the floating client-name label.
const LABEL_GAP_PX = 22;

// Fine-pointer (mouse) check — the cursor-following label is a desktop
// affordance, so a synthetic mouse event from a tap shouldn't flash it.
const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

// Client-mount detection without setState-in-effect: false during SSR + the
// first hydration render, true thereafter. Hydration-safe and warning-free.
const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

// Brand red panel with pure-white type and logos. --paper is pinned white so
// both the title (text-paper) and the masked logos (background var(--paper))
// render white regardless of theme. The darkened-tone treatment used on the
// Services red panel was tried here and reverted: it reads fine on solid
// headings but goes muddy on the thin logo marks.
const RED_VARS = {
  "--paper": "#ffffff",
  "--line": "rgba(255, 255, 255, 0.2)",
} as React.CSSProperties;

// Logos cascade in one after another as the panel scrolls into view.
const LIST_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

/**
 * Brand-red client panel. Logos sit as white marks on the red background
 * (via CSS mask, so a single SVG colours either way).
 */
export default function Clients() {
  const labelRef = useRef<HTMLDivElement>(null);
  // Portal only after mount so the server and the client's first render match
  // (both render nothing here) — avoids a hydration mismatch.
  const mounted = useMounted();

  // Imperative so moving the cursor never re-renders the 19-logo grid. The
  // label flips to whichever side of the cursor keeps it on screen: cursor on
  // the right half → label sits to its left, and vice-versa.
  const onHover = (name: string | null, e?: React.MouseEvent) => {
    const el = labelRef.current;
    if (!el) return;
    if (name && e && canHover()) {
      el.textContent = name;
      const onRightHalf = e.clientX > window.innerWidth / 2;
      el.style.top = `${e.clientY}px`;
      if (onRightHalf) {
        el.style.left = `${e.clientX - LABEL_GAP_PX}px`;
        el.style.transform = "translate(-100%, -50%)";
        el.style.textAlign = "right";
      } else {
        el.style.left = `${e.clientX + LABEL_GAP_PX}px`;
        el.style.transform = "translateY(-50%)";
        el.style.textAlign = "left";
      }
      el.style.opacity = "1";
    } else {
      el.style.opacity = "0";
    }
  };

  return (
    <section
      id="clients"
      aria-label="Selected clients"
      style={RED_VARS}
      className="relative flex min-h-screen flex-col justify-center bg-accent px-6 py-16 text-paper md:px-10 md:py-20"
    >
      <div className="mb-12 text-center md:mb-16">
        <SectionTitle>Clients</SectionTitle>
      </div>

      <motion.ul
        data-no-auto-text-reveal
        variants={LIST_VARIANTS}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        className="flex flex-wrap justify-center gap-x-10 gap-y-12 md:gap-y-16"
      >
        {CLIENTS_WITH_LOGOS.map((client) => (
          <motion.li
            key={client.name}
            variants={ITEM_VARIANTS}
            // Fixed per-breakpoint basis = 2 / 3 / 4 across. justify-center on
            // the wrap means any partial last row centres instead of leaving an
            // empty cell in the bottom-right.
            className="flex basis-[calc(50%-1.5rem)] items-center justify-center sm:basis-[calc(33.333%-1.8rem)] lg:basis-[calc(25%-2rem)]"
          >
            <LogoCell
              name={client.name}
              logo={client.logo}
              url={client.url}
              onHover={onHover}
            />
          </motion.li>
        ))}
      </motion.ul>

      {/* Cursor-following name label. Portaled to <body> so its fixed position
          maps to the viewport, not the deck's transformed ancestor. */}
      {mounted &&
        createPortal(
          <div
            ref={labelRef}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[80] font-mono text-[11px] uppercase tracking-[0.2em] opacity-0 transition-opacity duration-150"
            style={{ color: "#ffffff", whiteSpace: "nowrap" }}
          />,
          document.body
        )}
    </section>
  );
}

type LogoCellProps = {
  name: string;
  logo: string | null;
  url?: string;
  onHover: (name: string | null, e?: React.MouseEvent) => void;
};

function LogoCell({ name, logo, url, onHover }: LogoCellProps) {
  // Drive the cursor-following name label: show + track on move, hide on leave.
  const hoverProps = {
    onMouseEnter: (e: React.MouseEvent) => onHover(name, e),
    onMouseMove: (e: React.MouseEvent) => onHover(name, e),
    onMouseLeave: () => onHover(null),
  };
  // Hover behaviour is a quiet enlarge, CSS-driven via the .logo-cell /
  // .logo-scale hooks (see globals.css), so it stays declarative and honours
  // prefers-reduced-motion.
  const inner = (
    <span className="logo-scale inline-flex items-center justify-center">
      {logo ? (
        <span
          aria-hidden
          // Every logo sits in an identical fixed box and is contained inside
          // it, so wordmarks and compact marks read at a consistent size.
          className="logo-mark block h-10 w-[130px] md:h-12 md:w-[160px]"
          style={{
            backgroundColor: "var(--paper)",
            WebkitMaskImage: `url(${logo})`,
            maskImage: `url(${logo})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ) : (
        <span className="font-sans text-xl font-bold leading-tight tracking-tight md:text-2xl">
          {name}
        </span>
      )}
    </span>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} (opens in new tab)`}
        className="logo-cell flex h-full w-full items-center justify-center"
        {...hoverProps}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className="logo-cell flex h-full w-full items-center justify-center"
      aria-label={name}
      {...hoverProps}
    >
      {inner}
    </div>
  );
}
