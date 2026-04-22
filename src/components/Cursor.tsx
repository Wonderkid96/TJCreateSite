"use client";

import { useEffect, useRef } from "react";

type Variant = "default" | "hover" | "view";

// Size per variant (px, matches tailwind arbitrary values).
const SIZE: Record<Variant, number> = {
  default: 14,
  hover: 44,
  view: 96,
};

/**
 * Cursor — imperative DOM updates only. No React state for variant/position,
 * so moving across hundreds of DOM nodes per second doesn't queue re-renders
 * of this component (which was the source of occasional "stiffness"). The
 * position lerp, variant size, and label all mutate the DOM directly via refs.
 */
export default function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (matchMedia("(pointer: coarse)").matches) {
      // Hide entirely on touch devices.
      if (wrapRef.current) wrapRef.current.style.display = "none";
      return;
    }

    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!wrap || !dot || !label) return;

    let tx = -100;
    let ty = -100;
    let lx = -100;
    let ly = -100;

    let lastVariant: Variant = "default";
    let lastLabel = "";

    const applyVariant = (v: Variant, text: string) => {
      if (v !== lastVariant) {
        lastVariant = v;
        const size = SIZE[v];
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
      }
      if (text !== lastLabel) {
        lastLabel = text;
        label.textContent = text;
        label.style.opacity = v === "view" ? "1" : "0";
      }
    };

    let rafId = 0;
    let dirty = true;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!dirty) return;
      // 45% per-frame lerp — tight follow (~2 frame tail).
      lx += (tx - lx) * 0.45;
      ly += (ty - ly) * 0.45;
      // Sub-pixel idle threshold: skip DOM writes (and flag the loop as
      // clean) once the cursor is close enough that further updates would
      // be imperceptible. Next pointermove flips `dirty` back on.
      if (Math.abs(tx - lx) < 0.1 && Math.abs(ty - ly) < 0.1) {
        lx = tx;
        ly = ty;
        dirty = false;
      }
      wrap.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dirty = true;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const cursorEl = t.closest<HTMLElement>("[data-cursor]");
      if (cursorEl) {
        const kind = cursorEl.dataset.cursor;
        const l = cursorEl.dataset.cursorLabel ?? "";
        if (kind === "view") {
          applyVariant("view", l || "VIEW");
          return;
        }
        applyVariant("hover", "");
        return;
      }
      if (t.closest("a, button")) {
        applyVariant("hover", "");
        return;
      }
      applyVariant("default", "");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        // Expose a CSS variable so other effects (e.g. the Contact
        // tunnel metaball) can fade the global cursor out and let
        // their own visuals take over. Defaults to 1 (fully visible).
        opacity: "var(--cursor-opacity, 1)",
        transition: "opacity 280ms ease",
      }}
    >
      <div
        ref={dotRef}
        className="relative -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
        style={{
          width: 14,
          height: 14,
          // Pinned to cream regardless of theme. Combined with mix-blend-difference
          // on the wrapper this inverts visibly on both light + dark backgrounds.
          backgroundColor: "#f4f1e9",
          color: "#0a0a0a",
          transition:
            "width 220ms cubic-bezier(.2,.8,.2,1), height 220ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <span
          ref={labelRef}
          className="font-mono text-[10px] tracking-[0.2em] uppercase transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
