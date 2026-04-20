"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"default" | "hover" | "view" | "hidden">("default");
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (matchMedia("(pointer: coarse)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVariant("hidden");
      return;
    }

    let tx = -100;
    let ty = -100;
    let lx = -100;
    let ly = -100;
    let rafId = 0;

    const tick = () => {
      // Lerp toward target — tight follow (0.45 ≈ 2-frame tail), no overshoot.
      lx += (tx - lx) * 0.45;
      ly += (ty - ly) * 0.45;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const cursorEl = t.closest<HTMLElement>("[data-cursor]");
      if (cursorEl) {
        const kind = cursorEl.dataset.cursor as "view" | "hover" | undefined;
        const l = cursorEl.dataset.cursorLabel ?? "";
        if (kind === "view") {
          setVariant("view");
          setLabel(l || "VIEW");
        } else {
          setVariant("hover");
          setLabel(l);
        }
      } else if (t.closest("a, button")) {
        setVariant("hover");
        setLabel("");
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (variant === "hidden") return null;

  const size = variant === "view" ? 96 : variant === "hover" ? 44 : 14;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference will-change-transform"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper flex items-center justify-center text-ink"
        animate={{ width: size, height: size }}
        transition={{ type: "spring", damping: 22, stiffness: 340, mass: 0.3 }}
      >
        {variant === "view" && (
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
