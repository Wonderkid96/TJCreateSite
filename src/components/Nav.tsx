"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/** Sun/moon theme toggle button.
 *  Normal click/tap → toggle light/dark.
 *  Long-press (~5 s) → toggle rainbow glow Easter egg.
 *
 *  On touch devices the native long-press context menu / text-selection
 *  would interrupt the timer, so we attach touch listeners via a ref
 *  with `{ passive: false }` and call `preventDefault()`. React's
 *  synthetic onTouchStart is always passive in React 19, so it can't
 *  prevent the default — the ref approach sidesteps that.
 */
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const [hud, setHud] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pressTimer = useRef<number | null>(null);
  const didLongPress = useRef(false);
  // Guards against double-start: on mobile, touch fires before mouse.
  const pressActive = useRef(false);

  const LONG_PRESS_MS = 5000;

  const startPress = useCallback(() => {
    if (pressActive.current) return; // already running from touch
    pressActive.current = true;
    didLongPress.current = false;
    pressTimer.current = window.setTimeout(() => {
      didLongPress.current = true;
      setHud((v) => !v);
    }, LONG_PRESS_MS);
  }, []);

  const endPress = useCallback(() => {
    pressActive.current = false;
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (didLongPress.current) {
      didLongPress.current = false;
      return; // swallow — long-press already toggled rainbow
    }
    toggle();
  }, [toggle]);

  // Attach non-passive touch listeners so we can preventDefault to
  // suppress the native context menu / text-selection on long-press.
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // block native long-press behaviour
      startPress();
    };
    const onTouchEnd = (e: TouchEvent) => {
      // If it wasn't a long-press, synthesise a click so the normal
      // light/dark toggle still fires (preventDefault on touchstart
      // swallows the browser's synthetic click).
      if (!didLongPress.current) {
        handleClick();
      } else {
        didLongPress.current = false;
      }
      endPress();
      e.preventDefault(); // prevent delayed mousedown/click from touch
    };
    const onTouchCancel = () => endPress();

    // Prevent default on contextmenu to stop the popup on Android
    const onContext = (e: Event) => {
      if (pressActive.current) e.preventDefault();
    };

    btn.addEventListener("touchstart", onTouchStart, { passive: false });
    btn.addEventListener("touchend", onTouchEnd, { passive: false });
    btn.addEventListener("touchcancel", onTouchCancel);
    btn.addEventListener("contextmenu", onContext);

    return () => {
      btn.removeEventListener("touchstart", onTouchStart);
      btn.removeEventListener("touchend", onTouchEnd);
      btn.removeEventListener("touchcancel", onTouchCancel);
      btn.removeEventListener("contextmenu", onContext);
    };
  }, [startPress, endPress, handleClick]);

  // Sync hud class on <html>.
  useEffect(() => {
    const html = document.documentElement;
    if (hud) {
      html.classList.add("hud-mode");
    } else {
      html.classList.remove("hud-mode");
    }
    return () => html.classList.remove("hud-mode");
  }, [hud]);

  // Clean up timer on unmount.
  useEffect(() => {
    return () => {
      if (pressTimer.current !== null) window.clearTimeout(pressTimer.current);
    };
  }, []);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        /* Touch is handled via the ref-based listeners above
           (non-passive, so preventDefault works). */
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        data-cursor="hover"
        className="relative w-8 h-8 flex items-center justify-center rounded-full border border-line hover:border-ink transition-colors select-none touch-none"
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

      {/* HUD mode overlays + exit button — visible only when Easter egg is active */}
      {hud && (
        <>
          <div aria-hidden className="hud-scanline" />
          <div aria-hidden className="hud-grid" />
          <button
            type="button"
            onClick={() => setHud(false)}
            className="hud-exit-btn"
          >
            Exit HUD Mode
          </button>
        </>
      )}
    </>
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
