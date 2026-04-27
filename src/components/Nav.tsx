"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ScrambleText from "./ScrambleText";
import { useTheme } from "./ThemeProvider";

// ─── Nav links ───────────────────────────────────────────────────────────────

const LINKS = [
  { label: "Work",     href: "#work"     },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about"    },
  { label: "Contact",  href: "#contact"  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Nav() {
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);

  // Update the London time every 30 seconds.
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/London",
          hour12: false,
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // Close the mobile panel on Escape or anchor click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header aria-label="Site header" className="fixed inset-x-0 top-0 z-50 bg-paper border-b border-line">
      <div className="relative mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10 py-4">
        <LogoMark onClick={() => setOpen(false)} />

        {/* Desktop nav — absolutely centred so logo expansion never shifts it */}
        <nav
          aria-label="Primary"
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 font-mono font-bold text-[11px] uppercase tracking-[0.2em]"
        >
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} data-cursor="hover" className="relative group">
              <span className="group-hover:text-accent transition-colors">{l.label}</span>
            </a>
          ))}
        </nav>

        {/* Desktop: availability status + theme toggle */}
        <div className="hidden md:flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em]">
          <AvailabilityChip time={time} />
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            data-cursor="hover"
            className="relative w-9 h-9 -mr-1 flex items-center justify-center"
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
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
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
                  <span className="font-display text-3xl leading-none tracking-tight group-hover:italic transition-[font-style]">
                    {l.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* Mobile availability status */}
            <div className="flex items-center gap-2 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted border-t border-line">
              <AvailabilityChip time={time} onClick={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * "Available · green dot · HH:MM" chip used in both the desktop bar
 * and the mobile panel footer.
 */
function AvailabilityChip({ time, onClick }: { time: string; onClick?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <a
        href="mailto:hello@tjcreate.co.uk?subject=Hello%20TJCreate"
        data-cursor="hover"
        aria-label="Available for work — email hello@tjcreate.co.uk"
        className="hover:text-accent transition-colors"
        onClick={onClick}
      >
        Available
      </a>
      {/* Pulsing green status dot */}
      <span aria-hidden className="relative inline-flex h-1.5 w-1.5 shrink-0">
        <span
          className="absolute inset-0 rounded-full opacity-70 animate-ping"
          style={{ backgroundColor: "#80EF80" }}
        />
        <span
          className="relative inline-block rounded-full h-1.5 w-1.5"
          style={{ backgroundColor: "#80EF80" }}
        />
      </span>
      <span className="tabular-nums">{time}</span>
    </div>
  );
}

/** Sun/moon theme toggle — click/tap to switch light/dark. */
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor="hover"
      className="relative w-8 h-8 flex items-center justify-center rounded-full border border-line hover:border-ink transition-colors"
    >
      <span className="sr-only">{isDark ? "Light mode" : "Dark mode"}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="transition-transform duration-500"
        style={{ transform: isDark ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        {isDark ? (
          /* Sun */
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" /><path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" /><path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          /* Moon */
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
}

/** TJCREATE wordmark — expands to full name on hover via ScrambleText. */
function LogoMark({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const text = hovered ? "TOBY JOHNSON CREATE" : "TJCREATE";

  return (
    <a
      href="#top"
      data-cursor="hover"
      aria-label="TJCREATE · Home"
      className="inline-flex flex-col"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="inline-flex items-baseline">
        <span className="font-sans font-bold text-ink text-[1.35rem] md:text-[1.65rem] leading-none tracking-[-0.01em] whitespace-nowrap">
          <ScrambleText
            text={text}
            active={true}
            colors={["#E6352A", "#C8DB45", "#C4A9D0"]}
            duration={550}
          />
        </span>
        <span
          aria-hidden
          className="font-sans font-bold text-accent text-[1.35rem] md:text-[1.65rem] leading-none tracking-[-0.01em] ml-[0.05em]"
        >
          .
        </span>
      </span>
      <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-ink/45 mt-1 leading-none">
        Portfolio / 2026
      </span>
    </a>
  );
}
