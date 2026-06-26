"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import ScrambleText from "./ScrambleText";

// ─── Nav links ───────────────────────────────────────────────────────────────

const LINKS = [
  { label: "Work",     href: "#work"     },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about"    },
  { label: "Contact",  href: "#contact"  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Nav() {
  const [open, setOpen] = useState(false);
  // Header slides out of view on scroll-down, returns on scroll-up.
  const [hidden, setHidden] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // The header only belongs over the hero. Once the hero scrolls out of view
  // (into the work grid / stacked deck) the header slides away, and returns
  // when the user scrolls back up into the hero. An IntersectionObserver on
  // the hero section drives it directly — no scroll math.
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setHidden(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Close the mobile panel on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Return focus to the hamburger when the panel closes (WCAG 2.4.3).
  // Calling focus() inline in the Escape handler raced with React's
  // state commit and the AnimatePresence exit, so the focus did not
  // always land. Watching `open` -> false here guarantees the focus
  // call happens after the commit.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      hamburgerRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  return (
    <header
      aria-label="Site header"
      // Slides away once the hero scrolls out of view, but the open mobile
      // panel always forces the header visible (derived, not setState).
      className={`fixed inset-x-0 top-0 z-50 bg-paper border-b border-line transition-transform duration-300 ease-[var(--ease)] will-change-transform ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="relative flex items-center justify-between px-6 md:px-10 py-4">
        <LogoMark onClick={() => setOpen(false)} />

        {/* Desktop nav — pinned to the right */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8 font-mono font-bold text-[11px] uppercase tracking-[0.2em]"
        >
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} data-cursor="hover" className="relative group">
              <span className="group-hover:text-accent transition-colors">{l.label}</span>
            </a>
          ))}
        </nav>

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center">
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            data-cursor="hover"
            className="relative w-9 h-9 -mr-1 flex items-center justify-center rounded-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              aria-hidden
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 w-5 h-px bg-ink transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[5px]"
              }`}
            />
            <span
              aria-hidden
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 w-5 h-px bg-ink transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[5px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="md:hidden overflow-hidden border-t border-line bg-paper"
          >
            <nav aria-label="Mobile primary" className="flex flex-col divide-y divide-line">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline px-6 py-5 group"
                >
                  <span className="font-display uppercase text-3xl leading-none tracking-tight">
                    {l.label}
                  </span>
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// Brand accent palette the wordmark flickers through on hover.
const LOGO_COLORS = ["#E6352A", "#C8DB45", "#C4A9D0"];

/**
 * TJCREATE wordmark — "TJ" in brand red, "CREATE" in brand black. At rest it
 * reads clean; on hover both halves scramble, cycling through symbols and the
 * accent colours (no name expansion).
 */
function LogoMark({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#top"
      data-cursor="hover"
      aria-label="TJCREATE · Home"
      className="inline-flex items-baseline font-display text-[1.15rem] leading-none tracking-[-0.02em] whitespace-nowrap md:text-[1.4rem]"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-accent">
        <ScrambleText text="TJ" active={hovered} colors={LOGO_COLORS} duration={420} />
      </span>
      <span className="text-ink">
        <ScrambleText text="CREATE" active={hovered} colors={LOGO_COLORS} duration={520} />
      </span>
      <span aria-hidden className="ml-[0.05em] text-accent">
        .
      </span>
    </a>
  );
}
