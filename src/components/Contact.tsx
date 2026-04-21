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
      // Pin --paper and --ink locally so the section is always dark
      // regardless of theme — the tunnel + its labels + the contact
      // grid are designed against a permanent dark background.
      style={
        {
          "--paper": "#f4f1e9",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
      className="relative px-6 md:px-10 pt-16 md:pt-20 pb-24 md:pb-32 bg-ink text-paper overflow-hidden"
    >
      <div className="flex items-start justify-between mb-10 md:mb-14">
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
        className="block group mt-10 md:mt-14"
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

      <div className="mt-14 md:mt-16 border-t border-paper/20 pt-10 md:pt-12">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-5">
          Legal
        </div>

        <div className="space-y-3">
          <details className="group rounded-xl border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
            <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
                Terms &amp; Conditions
              </span>
              <span
                aria-hidden
                className="text-paper/70 transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="mt-4 border-t border-paper/15 pt-4 space-y-2.5 text-sm md:text-[15px] leading-relaxed text-paper/80">
              <li>
                Project scope, timelines and fees are agreed in writing before work starts.
              </li>
              <li>
                Client-supplied assets (logos, photography, copy, music) must have rights cleared
                by the client.
              </li>
              <li>
                Unless otherwise agreed in writing, usage rights for final deliverables transfer
                after full payment.
              </li>
              <li>
                For legal queries or a project-specific agreement, email{" "}
                <a
                  href="mailto:hello@tjcreate.co.uk"
                  className="underline decoration-paper/40 underline-offset-4 hover:text-accent transition-colors"
                >
                  hello@tjcreate.co.uk
                </a>
                .
              </li>
            </ul>
          </details>

          <details className="group rounded-xl border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
            <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
                Privacy Policy
              </span>
              <span
                aria-hidden
                className="text-paper/70 transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="mt-4 border-t border-paper/15 pt-4 space-y-2.5 text-sm md:text-[15px] leading-relaxed text-paper/80">
              <li>
                Personal details you share (for example by email) are used only to reply to your
                enquiry and manage project communication.
              </li>
              <li>Information is not sold or shared for third-party marketing.</li>
              <li>
                Data is kept only as long as needed for communication, project delivery and basic
                business records.
              </li>
              <li>
                You can request access, correction or deletion of your personal information by
                emailing{" "}
                <a
                  href="mailto:hello@tjcreate.co.uk"
                  className="underline decoration-paper/40 underline-offset-4 hover:text-accent transition-colors"
                >
                  hello@tjcreate.co.uk
                </a>
                .
              </li>
            </ul>
          </details>
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
  // Depth fog: radial gradient centred on the vanishing point, fading from
  // fully transparent near the block edges to solid ink in the middle. Tracks
  // the cursor via the same spring-smoothed motion values.
  const fogGradient = useMotionTemplate`radial-gradient(ellipse 60% 60% at ${originX}% ${originY}%, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.58) 22%, rgba(10,10,10,0.24) 56%, rgba(10,10,10,0.06) 100%)`;

  const ready = size.w > 0 && size.h > 0;

  return (
    <a
      ref={ref}
      href="mailto:hello@tjcreate.co.uk"
      data-cursor="view"
      data-cursor-label=" "
      aria-label="Email hello@tjcreate.co.uk"
      className="relative block w-full mx-auto overflow-hidden h-[48vh] sm:h-[52vh] md:h-[58vh] lg:h-[62vh] min-h-[300px] max-h-[78vh] select-none"
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
            {/* depth fog rendered AFTER the walls so it sits on top and fades
                far-back text into the vanishing point. pointer-events: none so
                the mailto click still reaches the <a>. */}
            <Wall orientation="floor" width={size.w} height={size.h} />
            <Wall orientation="ceiling" width={size.w} height={size.h} />
            <Wall orientation="left" width={size.w} height={size.h} />
            <Wall orientation="right" width={size.w} height={size.h} />
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: fogGradient }}
            />
            <TunnelCenterText width={size.w} height={size.h} />
          </div>
        </motion.div>
      )}
    </a>
  );
}

function TunnelCenterText({ width, height }: { width: number; height: number }) {
  const minDim = Math.min(width, height);
  const fontSize = Math.max(66, Math.min(190, minDim * 0.34));
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translateZ(-${Math.round(TUNNEL_DEPTH * 0.7)}px)`,
      }}
      aria-hidden
    >
      <div
        className="font-display leading-[0.9] tracking-tight text-paper whitespace-nowrap"
        style={{
          fontSize,
          textShadow:
            "0 2px 0 rgba(10,10,10,0.2), 0 10px 26px rgba(10,10,10,0.18)",
        }}
      >
        Click <span className="italic">here</span>
        <span className="text-accent">.</span>
      </div>
    </div>
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
  const depth = TUNNEL_DEPTH;
  const isHorizontal = orientation === "floor" || orientation === "ceiling";

  let rotation: string;
  let origin: string;
  let cssWidth: number;
  let cssHeight: number;
  let cssLeft: number;
  let cssTop: number;

  if (orientation === "floor") {
    rotation = "rotateX(90deg)";
    origin = "bottom center";
    cssWidth = width;
    cssHeight = depth;
    cssLeft = 0;
    cssTop = height - depth;
  } else if (orientation === "ceiling") {
    rotation = "rotateX(-90deg)";
    origin = "top center";
    cssWidth = width;
    cssHeight = depth;
    cssLeft = 0;
    cssTop = 0;
  } else if (orientation === "left") {
    rotation = "rotateY(90deg)";
    origin = "top left";
    cssWidth = depth;
    cssHeight = height;
    cssLeft = 0;
    cssTop = 0;
  } else {
    rotation = "rotateY(-90deg)";
    origin = "top right";
    cssWidth = depth;
    cssHeight = height;
    cssLeft = width - depth;
    cssTop = 0;
  }

  const innerW = isHorizontal ? cssWidth : cssHeight;
  const innerH = isHorizontal ? cssHeight : cssWidth;
  const innerRotate =
    orientation === "left" ? 90 : orientation === "right" ? -90 : 0;

  const fontSize = Math.max(20, Math.min(width, height) * 0.1);
  const rowGap = fontSize * 1.8;
  const rowCount = Math.max(2, Math.ceil(depth / rowGap));
  const tokensPerRow = Math.max(4, Math.ceil((innerW * 1.2) / (fontSize * 6)));

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
          left: "50%",
          top: "50%",
          width: innerW,
          height: innerH,
          transform: isHorizontal
            ? "translate(-50%, -50%)"
            : `translate(-50%, -50%) rotate(${innerRotate}deg)`,
          transformOrigin: "center center",
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
          }}
        >
          {Array.from({ length: rowCount }).map((_, i) => (
            <div key={i} className="flex gap-6 px-4">
              {Array.from({ length: tokensPerRow }).map((_, j) => (
                <span key={j} className="shrink-0">
                  LET&apos;S TALK<span style={{ color: "#E6352A" }}>.</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
