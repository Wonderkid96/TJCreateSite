"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 md:px-10 py-24 md:py-40 bg-ink text-paper overflow-hidden"
    >
      <div className="flex items-start justify-between mb-16 md:mb-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
          [ 05 / Contact ]
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 text-right">
          Let&apos;s make
          <br />
          something!
        </div>
      </div>

      <TunnelBlock />

      <a
        href="mailto:hello@tjcreate.co.uk"
        data-cursor="view"
        data-cursor-label="EMAIL"
        className="block group mt-16 md:mt-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-[clamp(3rem,14vw,16rem)] leading-[0.85] tracking-tighter"
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block"
            >
              hello<span className="text-accent">@</span>
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block italic"
            >
              tjcreate
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block"
            >
              .co.uk<span className="text-accent">→</span>
            </motion.span>
          </div>
        </motion.div>
      </a>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-paper/20 pt-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            Email
          </div>
          <a
            href="mailto:hello@tjcreate.co.uk"
            data-cursor="hover"
            className="text-lg hover:text-accent transition-colors"
          >
            hello@tjcreate.co.uk
          </a>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            Instagram
          </div>
          <a
            href="https://instagram.com/tj.create"
            data-cursor="hover"
            className="text-lg hover:text-accent transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            @tj.create
          </a>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            LinkedIn
          </div>
          <a
            href="https://linkedin.com/in/tobyjohnsoncreate"
            data-cursor="hover"
            className="text-lg hover:text-accent transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            /tobyjohnsoncreate
          </a>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            Location
          </div>
          <div className="text-lg">Lincoln, UK</div>
        </div>
      </div>

      <div className="mt-24 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
        <div>© Toby Johnson, 2026</div>
        <div>Made in Lincoln</div>
      </div>
    </section>
  );
}

/**
 * 3D TUNNEL — four walls (floor / ceiling / left / right) rendered as real
 * 3D planes receding into negative Z. CSS `perspective` + `perspective-origin`
 * give true geometric perspective, so the repeating "CLICK HERE." text on
 * each wall tapers naturally toward the vanishing point. The vanishing point
 * follows the cursor by shifting the perspective-origin.
 */
function TunnelBlock() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Cursor as fraction 0–1 across the block. Default centre.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { damping: 30, stiffness: 180, mass: 0.5 });
  const smy = useSpring(my, { damping: 30, stiffness: 180, mass: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    };
    const onLeave = () => {
      mx.set(0.5);
      my.set(0.5);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      ro.disconnect();
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my]);

  const originX = useTransform(smx, (v) => v * 100);
  const originY = useTransform(smy, (v) => v * 100);
  const perspectiveOrigin = useMotionTemplate`${originX}% ${originY}%`;

  const ready = size.w > 0 && size.h > 0;

  return (
    <a
      ref={ref}
      href="mailto:hello@tjcreate.co.uk"
      data-cursor="view"
      data-cursor-label=" "
      aria-label="Email hello@tjcreate.co.uk"
      className="relative block overflow-hidden -mx-6 md:-mx-10 h-[60vh] sm:h-[65vh] md:h-[72vh] select-none"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {ready && (
        <motion.div
          className="absolute inset-0"
          style={{
            perspective: "700px",
            perspectiveOrigin,
            backgroundColor: "#0a0a0a",
          }}
        >
          <div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Wall orientation="floor" width={size.w} height={size.h} />
            <Wall orientation="ceiling" width={size.w} height={size.h} />
            <Wall orientation="left" width={size.w} height={size.h} />
            <Wall orientation="right" width={size.w} height={size.h} />
          </div>
        </motion.div>
      )}
    </a>
  );
}

// Depth of the tunnel along -Z in pixels. Must be large enough that the far
// end converges to a visible vanishing point.
const TUNNEL_DEPTH = 1400;

function Wall({
  orientation,
  width,
  height,
}: {
  orientation: "floor" | "ceiling" | "left" | "right";
  width: number;
  height: number;
}) {
  const isHorizontal = orientation === "floor" || orientation === "ceiling";
  const depth = TUNNEL_DEPTH;

  // Each wall is a flat rectangle positioned so one of its edges is coincident
  // with a block boundary, then rotated 90° around that edge so the opposite
  // edge swings into -Z. Crucially, we pick positions + rotation directions
  // such that the element's NATURAL front face (normal +Z before rotation)
  // ends up facing INTO the tunnel (toward the viewer inside), so no
  // back-face mirror correction is needed — except the right wall, where
  // reading order ends up reversed (fixed below with direction: rtl).
  let rotation: string;
  let origin: string;
  let cssWidth: number;
  let cssHeight: number;
  let cssLeft: number;
  let cssTop: number;

  if (orientation === "floor") {
    // Element sits stacked UP from block's bottom edge (top: height-depth).
    // rotate around bottom edge (co-planar with block's bottom) by +90° X,
    // swinging the top edge into -Z. Normal becomes -Y (faces the viewer
    // looking down into the tunnel).
    rotation = "rotateX(90deg)";
    origin = "bottom center";
    cssWidth = width;
    cssHeight = depth;
    cssLeft = 0;
    cssTop = height - depth;
  } else if (orientation === "ceiling") {
    // Element hangs DOWN from block's top edge. Rotate around top edge by
    // -90° X, swinging the bottom edge into -Z. Normal becomes +Y (down in
    // CSS) → faces the viewer who sits below the ceiling.
    rotation = "rotateX(-90deg)";
    origin = "top center";
    cssWidth = width;
    cssHeight = depth;
    cssLeft = 0;
    cssTop = 0;
  } else if (orientation === "left") {
    // Element extends RIGHT from block's left edge. Rotate around left edge
    // by +90° Y, swinging the right edge into -Z. Normal becomes +X — faces
    // the viewer who is to the right of this wall.
    rotation = "rotateY(90deg)";
    origin = "top left";
    cssWidth = depth;
    cssHeight = height;
    cssLeft = 0;
    cssTop = 0;
  } else {
    // Right wall: element extends LEFT from block's right edge. Rotate around
    // right edge by -90° Y, swinging the left edge into -Z. Normal becomes -X
    // — faces the viewer who is to the left of this wall. BUT reading order
    // ends up far-to-near, so we apply direction: rtl on the text layer to
    // reverse character flow without mirroring letter shapes.
    rotation = "rotateY(-90deg)";
    origin = "top right";
    cssWidth = depth;
    cssHeight = height;
    cssLeft = width - depth;
    cssTop = 0;
  }

  // Only the right wall needs a text-flow reversal.
  const rtl = orientation === "right";

  // Font size + row metrics. Rows stack along the element's CSS y-axis; row
  // contents stream along the element's CSS x-axis.
  const fontSize = Math.max(20, Math.min(width, height) * 0.1);
  const rowGap = fontSize * 1.8;
  const rowStackLen = cssHeight; // CSS y spans this
  const rowRunLen = cssWidth; // CSS x spans this
  const rowCount = Math.max(2, Math.ceil(rowStackLen / rowGap));
  // Pack enough tokens per row so the wall stays full after perspective.
  const tokensPerRow = Math.max(4, Math.ceil((rowRunLen * 1.2) / (fontSize * 6)));

  return (
    <div
      style={{
        position: "absolute",
        left: cssLeft,
        top: cssTop,
        width: cssWidth,
        height: cssHeight,
        transformOrigin: origin,
        transform: rotation,
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: `${rowGap * 0.25}px 0`,
          color: "#F4F1E9",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontWeight: 700,
          fontSize,
          lineHeight: 1,
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
          direction: rtl ? "rtl" : "ltr",
          unicodeBidi: rtl ? "bidi-override" : "normal",
        }}
        // Keep the orientation attribute only for horizontal walls so we can
        // stretch rows across the wall width via the token loop (below).
        data-orient={isHorizontal ? "h" : "v"}
      >
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex gap-6 px-4">
            {Array.from({ length: tokensPerRow }).map((_, j) => (
              <span key={j} className="shrink-0">
                CLICK HERE<span style={{ color: "#E6352A" }}>.</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
