"use client";

import { useEffect, useRef } from "react";

// How long a point stays on screen before it has shrunk to nothing.
const LIFE_MS = 420;
// Stroke width at the head of the trail, in CSS pixels. Tapers to 0 at the tail.
const HEAD_WIDTH = 6;
// How far the trail head closes on the pointer each frame (0-1). Lower is
// silkier but lags more.
const FOLLOW = 0.45;

type Point = { x: number; y: number; t: number };

/**
 * Accent-red cursor trail. A single fixed canvas that draws a tapered ribbon
 * behind the pointer. The head eases toward the pointer every frame, so the
 * trail is sampled at the display's frame rate rather than at the uneven
 * pointermove rate, and the ribbon is drawn as one filled curved shape so no
 * segment joins show. The render loop only runs while there is something to
 * draw, so an idle cursor costs nothing. Mouse and trackpad only
 * (pointer: fine), and skipped entirely under prefers-reduced-motion.
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!fine || reduced || !canvas || !ctx) return;

    const colour =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#e6352a";
    const points: Point[] = [];
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    let started = false;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Smooth closed path through the given outline using midpoint quadratics.
    const trace = (pts: { x: number; y: number }[]) => {
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
    };

    const draw = () => {
      const now = performance.now();

      head.x += (target.x - head.x) * FOLLOW;
      head.y += (target.y - head.y) * FOLLOW;
      const settled = Math.hypot(target.x - head.x, target.y - head.y) < 0.1;
      const prev = points[points.length - 1];
      if (!prev || Math.hypot(head.x - prev.x, head.y - prev.y) > 0.5) {
        points.push({ x: head.x, y: head.y, t: now });
      }
      while (points.length && now - points[0].t > LIFE_MS) points.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (points.length > 2) {
        // Offset each point either side of the path by half its current width.
        const left: { x: number; y: number }[] = [];
        const right: { x: number; y: number }[] = [];
        for (let i = 0; i < points.length; i++) {
          const a = points[Math.max(0, i - 1)];
          const b = points[Math.min(points.length - 1, i + 1)];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const life = Math.max(0, 1 - (now - points[i].t) / LIFE_MS);
          const half = (HEAD_WIDTH / 2) * life;
          const nx = (-dy / len) * half;
          const ny = (dx / len) * half;
          left.push({ x: points[i].x + nx, y: points[i].y + ny });
          right.push({ x: points[i].x - nx, y: points[i].y - ny });
        }

        ctx.fillStyle = colour;
        ctx.beginPath();
        trace([...left, ...right.reverse()]);
        ctx.closePath();
        ctx.fill();

        const tip = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, HEAD_WIDTH / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = points.length || !settled ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!started) {
        head.x = target.x;
        head.y = target.y;
        started = true;
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
