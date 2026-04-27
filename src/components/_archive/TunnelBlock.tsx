"use client";

/**
 * ARCHIVED — not currently mounted anywhere.
 *
 * Interactive "Let's talk." tunnel block. An anchor metaball grows
 * around the text when the cursor enters a tight activation zone
 * around the tunnel. A second "follower" blob appears at the cursor
 * and is spring-tethered to the anchor, so the user has to physically
 * drag it out (hard near max stretch). On release, the follower
 * snaps back with a light-damped oscillation.
 *
 * An SVG goo filter welds anchor + follower into a single fluid mass
 * when they overlap. The global cursor fades out while the effect is
 * active so the blob becomes the visual cursor.
 *
 * At rest the effect is completely static — no breathing, no idle
 * wiggle. All motion is cursor-driven and decays to stillness when
 * the user stops moving.
 *
 * To reinstate:
 *   1. import TunnelBlock from "./_archive/TunnelBlock";
 *   2. drop <TunnelBlock /> inside a <section>.
 *
 * Tunables (inside the effect):
 *   PROX_RADIUS  — px, activation radius around anchor centre.
 *   MAX_STRETCH  — px, how far the follower can be dragged.
 *   PARK_DIST    — px, follower considered "home" below this distance.
 */

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function TunnelBlock() {
  const blockRef = useRef<HTMLAnchorElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const block = blockRef.current;
    const anchor = anchorRef.current;
    const follower = followerRef.current;
    if (!block || !anchor || !follower) return;

    const section = block.closest("section");
    if (!section) return;

    let tunnelRect = block.getBoundingClientRect();
    let sectionRect = section.getBoundingClientRect();
    const remeasure = () => {
      tunnelRect = block.getBoundingClientRect();
      sectionRect = section.getBoundingClientRect();
    };
    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, { passive: true });

    // Cursor target in tunnel-local coords (unclamped — follower can
    // chase the cursor anywhere in the section until spring dominates).
    let tx = tunnelRect.width / 2;
    let ty = tunnelRect.height / 2;
    // Approach proximity [0,1] and its smoothed reading.
    let tProx = 0;
    let lProx = 0;
    // Follower simulation state — position + velocity. Spring physics
    // both during pull (anchor→cursor tension) AND during retract
    // (lighter damping gives a natural snapback wiggle that decays
    // to stillness — no continuous idle motion).
    let fx = tunnelRect.width / 2;
    let fy = tunnelRect.height / 2;
    let fvx = 0;
    let fvy = 0;
    // Independent visibility lerp — keeps the snapback oscillation
    // visible after the cursor has already left the activation zone.
    let lVis = 0;
    // Tracks active ↔ inactive transitions to trigger the "spawn at
    // cursor" snap on fresh activation.
    let wasActive = false;

    const PROX_RADIUS = 260;
    const MAX_STRETCH = 280;
    const PARK_DIST = 28;

    const onMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      const inSection =
        clientY >= sectionRect.top &&
        clientY <= sectionRect.bottom &&
        clientX >= sectionRect.left &&
        clientX <= sectionRect.right;

      if (!inSection) {
        tProx = 0;
        return;
      }

      tx = clientX - tunnelRect.left;
      ty = clientY - tunnelRect.top;

      const ax = tunnelRect.width / 2;
      const ay = tunnelRect.height / 2;
      const dist = Math.hypot(tx - ax, ty - ay);
      tProx = 1 - Math.min(dist / PROX_RADIUS, 1);
    };

    const onLeaveWindow = () => {
      tProx = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      const cx = tunnelRect.width / 2;
      const cy = tunnelRect.height / 2;
      const now = performance.now();

      // === Proximity (drives anchor scale + cursor fade) =============
      // Asymmetric lerp — slow, intentional reveal on approach;
      // faster release so the effect lets go cleanly when you leave.
      const proxRate = tProx > lProx ? 0.1 : 0.2;
      lProx += (tProx - lProx) * proxRate;
      const clamped = Math.max(0, Math.min(1, lProx));

      // === Active-state transition ===================================
      // On activation edge, snap follower to cursor so it "spawns" AT
      // the cursor rather than teleporting up from the anchor.
      // Hysteresis (0.06 enter / 0.02 exit) stops the snap from
      // retriggering on threshold jitter.
      const isActive = wasActive ? clamped > 0.02 : clamped > 0.06;
      if (isActive && !wasActive) {
        fx = tx;
        fy = ty;
        fvx = 0;
        fvy = 0;
      }
      wasActive = isActive;

      // === Follower physics ==========================================
      // Stretch measured BEFORE integrating so spring strength reacts
      // to the follower's current position.
      const stretch = Math.hypot(fx - cx, fy - cy);
      const stretchNorm = Math.min(stretch / MAX_STRETCH, 1);

      if (isActive) {
        // ACTIVE: cursor pulls + quadratic spring + "wall" term so
        // the last 10% of travel feels distinctly harder than the
        // first 90% (the "stickier pull" feel).
        const pullGate = clamped;
        const pullX = (tx - fx) * 0.18 * pullGate;
        const pullY = (ty - fy) * 0.18 * pullGate;

        const springK =
          0.012 +
          stretchNorm * stretchNorm * 0.16 +
          Math.pow(stretchNorm, 6) * 0.35;
        const springX = (cx - fx) * springK;
        const springY = (cy - fy) * springK;

        fvx = (fvx + pullX + springX) * 0.82;
        fvy = (fvy + pullY + springY) * 0.82;
      } else {
        // RETRACT: pure spring, lighter damping so the follower
        // visibly overshoots the anchor and wiggles a couple of
        // beats before settling. Oscillation decays to exactly
        // still — no continuous idle motion.
        const springK = 0.09 + stretchNorm * stretchNorm * 0.06;
        const springX = (cx - fx) * springK;
        const springY = (cy - fy) * springK;
        fvx = (fvx + springX) * 0.9;
        fvy = (fvy + springY) * 0.9;
      }

      fx += fvx;
      fy += fvy;

      // Hard cap — never exceed MAX_STRETCH * 1.05.
      let postStretch = Math.hypot(fx - cx, fy - cy);
      const cap = MAX_STRETCH * 1.05;
      if (postStretch > cap) {
        const s = cap / postStretch;
        fx = cx + (fx - cx) * s;
        fy = cy + (fy - cy) * s;
        fvx *= 0.45;
        fvy *= 0.45;
        postStretch = cap;
      }

      // === Visibility ================================================
      // Approach-based visibility ramps with proximity (smooth fade-in
      // on approach). During retract the follower is still physically
      // out there oscillating, so we OR in a presence based on how
      // far it is from the anchor — that way the snapback wiggle is
      // visible even after the cursor has left the activation zone.
      const approachVis = Math.max(
        0,
        Math.min(1, (clamped - 0.1) / 0.55)
      );
      const stretchVis = Math.min(
        1,
        Math.max(0, (postStretch - PARK_DIST) / 24)
      );
      const targetVis = isActive
        ? approachVis
        : Math.max(approachVis, stretchVis);
      lVis += (targetVis - lVis) * 0.2;
      const fScale = lVis;

      // === Anchor ====================================================
      // Pure linear ramp — no breathing, no idle pulse. Static when
      // the user isn't moving.
      anchor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${clamped.toFixed(3)})`;

      // === Global cursor fade ========================================
      const cursorOpacity = Math.max(0, 1 - fScale * 1.45);
      document.documentElement.style.setProperty(
        "--cursor-opacity",
        cursorOpacity.toFixed(2)
      );

      // === Follower render ===========================================
      // Velocity-gated jitter — tiny high-frequency surface tremble
      // when moving fast, exactly zero at rest. Guarantees the effect
      // eases into a completely static position when undisturbed.
      const speed = Math.hypot(fvx, fvy);
      const jitterAmp = Math.min(speed * 0.28, 4.5);
      const jitterX = jitterAmp > 0.05 ? Math.sin(now * 0.013) * jitterAmp : 0;
      const jitterY =
        jitterAmp > 0.05 ? Math.cos(now * 0.0115 + 1.3) * jitterAmp : 0;
      follower.style.transform = `translate3d(${(fx + jitterX).toFixed(2)}px, ${(fy + jitterY).toFixed(2)}px, 0) translate(-50%, -50%) scale(${fScale.toFixed(3)})`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
      cancelAnimationFrame(raf);
      document.documentElement.style.setProperty("--cursor-opacity", "1");
    };
  }, []);

  return (
    <a
      ref={blockRef}
      href="mailto:hello@tjcreate.co.uk"
      aria-label="Email hello@tjcreate.co.uk"
      className="relative block w-full mx-auto overflow-visible h-[48vh] sm:h-[52vh] md:h-[58vh] lg:h-[62vh] min-h-[300px] max-h-[78vh] select-none"
      style={{
        background:
          "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(244,241,233,0.06) 0%, rgba(10,10,10,0.25) 32%, rgba(10,10,10,0.88) 100%)",
      }}
    >
      {/* Goo filter — Gaussian blur + color-matrix alpha cutoff so
          overlapping blobs weld cleanly. Tighter stdDeviation than
          before (9 instead of 13) because there are only two shapes
          now; keeps the silhouette sharp as requested. */}
      <svg
        aria-hidden
        focusable="false"
        className="absolute h-0 w-0 overflow-hidden"
      >
        <defs>
          <filter
            id="tunnel-goo"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
            <feColorMatrix
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"
            />
          </filter>
        </defs>
      </svg>

      {/* Metaball layer — anchor + follower fuse inside the goo filter. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "url(#tunnel-goo)" }}
        aria-hidden
      >
        {/* Anchor — pill wide enough to fully cover "Let's talk." at
            every viewport. When the follower merges back into the
            anchor, the combined silhouette engulfs the text. */}
        <div
          ref={anchorRef}
          className="absolute top-0 left-0 rounded-full will-change-transform"
          style={{
            width: "clamp(340px, 48vw, 680px)",
            height: "clamp(140px, 14vw, 200px)",
            background: "#f4f1e9",
            transform: "translate3d(-9999px, 0, 0)",
            transformOrigin: "center",
          }}
        />

        {/* Follower — cursor-tethered, spring-resisted. */}
        <div
          ref={followerRef}
          className="absolute top-0 left-0 rounded-full will-change-transform"
          style={{
            width: 160,
            height: 160,
            background: "#f4f1e9",
            transform: "translate3d(-9999px, 0, 0)",
            transformOrigin: "center",
          }}
        />
      </div>

      {/* Text layer — mix-blend-difference so white type reads cream
          on the dark tunnel AND inverts to dark wherever a cream blob
          covers it. */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ mixBlendMode: "difference" }}
        aria-hidden
      >
        <TypeLine />
      </div>
    </a>
  );
}

function TypeLine() {
  const full = "Let's talk";
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCount((prev) => {
        if (prev >= full.length) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 66);
    return () => window.clearInterval(timer);
  }, []);

  const typed = full.slice(0, count);

  return (
    <div
      className="pointer-events-auto font-display leading-[0.9] tracking-tight whitespace-nowrap text-white inline-block transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(false)}
      style={{
        fontSize: "clamp(2.4rem, 8vw, 7.6rem)",
        textShadow: "0 1px 0 rgba(10,10,10,0.14), 0 8px 20px rgba(10,10,10,0.1)",
        transform: hovered ? "scale(0.96)" : "scale(1)",
      }}
    >
      {typed}
      <span className="text-accent">.</span>
      <DotSlot hovered={hovered} delayIn={40} delayOut={130} />
      <DotSlot hovered={hovered} delayIn={200} delayOut={40} />
      <motion.span
        aria-hidden
        className="text-accent"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      >
        |
      </motion.span>
    </div>
  );
}

function DotSlot({
  hovered,
  delayIn,
  delayOut,
}: {
  hovered: boolean;
  delayIn: number;
  delayOut: number;
}) {
  return (
    <span
      aria-hidden
      className="text-accent inline-flex items-baseline align-baseline overflow-hidden"
      style={{
        maxWidth: hovered ? "1ch" : "0",
        transition: "max-width 120ms steps(1,end)",
        transitionDelay: `${hovered ? delayIn : delayOut}ms`,
      }}
    >
      <span className="whitespace-nowrap">.</span>
    </span>
  );
}
