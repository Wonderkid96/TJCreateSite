"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";

// ─── Nav links ───────────────────────────────────────────────────────────────

const LINKS = [
  { label: "Work",     href: "#work"     },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "About",    href: "#about"    },
  { label: "Contact",  href: "#contact"  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [heroVisible, setHeroVisible] = useState(true);
  const sectionHref = (hash: string) => isHome ? hash : `/${hash}`;
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Keep navigation available throughout the page, with a solid surface once
  // the reel leaves view. Reconnect when client navigation changes the page.
  useEffect(() => {
    if (pathname !== "/") return;
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

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

  // Difference blending belongs only over the reel; paper keeps links legible
  // across work, services and standalone project pages.
  const overReel = isHome && heroVisible && !open;

  return (
    <header
      aria-label="Site header"
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,color,border-color] duration-300 ease-[var(--ease)] ${
        overReel
          ? "bg-transparent text-paper border-transparent mix-blend-difference"
          : "bg-paper text-ink border-line"
      }`}
    >
      <div className="relative flex items-center justify-between px-6 md:px-10 py-4">
        <LogoMark href={sectionHref("#top")} onClick={() => setOpen(false)} overReel={overReel} />

        {/* Desktop nav — pinned to the right */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-4 lg:gap-8 font-mono font-bold text-[11px] uppercase tracking-[0.2em]"
        >
          {LINKS.map((l) => (
            <a key={l.href} href={sectionHref(l.href)} className="relative group">
              <span className="group-hover:text-accent-link transition-colors">{l.label}</span>
            </a>
          ))}
        </nav>

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center">
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            // No aria-controls: the panel below is unmounted (not just
            // hidden) while closed, via AnimatePresence, so the id it would
            // reference doesn't exist in that state — an invalid ARIA
            // reference. aria-expanded alone is sufficient here.
            aria-expanded={open}
            className="relative w-9 h-9 -mr-1 flex items-center justify-center rounded-[2px] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              aria-hidden
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 w-5 h-px bg-current transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[5px]"
              }`}
            />
            <span
              aria-hidden
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 w-5 h-px bg-current transition-transform duration-300 ${
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
                  href={sectionHref(l.href)}
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

/**
 * TJCREATE wordmark — the full name in brand black, with only the trailing
 * period in accent red (the brand's accent-period pattern).
 */
function LogoMark({
  href,
  onClick,
  overReel = false,
}: {
  href: string;
  onClick?: () => void;
  overReel?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label="TJCREATE · Home"
      className="inline-flex items-baseline font-display text-[1.15rem] leading-none tracking-[-0.02em] whitespace-nowrap md:text-[1.4rem]"
      onClick={onClick}
    >
      {/* Over the reel the wordmark inherits the header's currentColor and the
          full stop drops to it too, so the whole mark inverts uniformly under
          the difference blend; on the solid bar it returns to ink + accent. */}
      <span className={overReel ? "" : "text-ink"}>TJCREATE</span>
      <span aria-hidden className={`ml-[0.05em] ${overReel ? "" : "text-accent"}`}>
        .
      </span>
    </a>
  );
}
