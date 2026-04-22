"use client";

import { motion } from "motion/react";
import { type Ref, useEffect, useId, useRef, useState } from "react";

export default function LetsTalkMetaball() {
  const uid = useId().replace(/:/g, "");
  const gooFilterId = `lets-talk-goo-${uid}`;
  const glassFilterId = `lets-talk-glass-${uid}`;

  const blockRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  const fxWrapRef = useRef<HTMLDivElement>(null);
  const fxLayerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const residueRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const matrixRef = useRef<SVGFEColorMatrixElement>(null);
  const glassMapImageRef = useRef<SVGFEImageElement>(null);
  const glassDispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const block = blockRef.current;
    const textEl = textRef.current;
    const fxWrap = fxWrapRef.current;
    const fxLayer = fxLayerRef.current;
    const anchor = anchorRef.current;
    const bridge = bridgeRef.current;
    const residue = residueRef.current;
    const follower = followerRef.current;
    const textLayer = textLayerRef.current;
    const blurNode = blurRef.current;
    const matrixNode = matrixRef.current;
    const glassMapImage = glassMapImageRef.current;
    const glassDisp = glassDispRef.current;
    if (
      !block ||
      !textEl ||
      !fxWrap ||
      !fxLayer ||
      !anchor ||
      !bridge ||
      !residue ||
      !follower ||
      !textLayer ||
      !blurNode ||
      !matrixNode ||
      !glassMapImage ||
      !glassDisp
    ) {
      return;
    }

    const section = block.closest("section");
    if (!section) return;

    let blockRect = block.getBoundingClientRect();
    let sectionRect = section.getBoundingClientRect();

    // Geometry derived from actual text bounds.
    let shapeW = 360;
    let shapeH = 132;
    let cxOff = 0;
    let cyOff = 0;
    const computeShape = () => {
      const tRect = textEl.getBoundingClientRect();
      if (tRect.width < 2 || tRect.height < 2) return;
      const padX = Math.max(42, tRect.height * 0.22);
      const padY = Math.max(20, tRect.height * 0.2);
      shapeW = tRect.width + padX * 2;
      shapeH = tRect.height + padY * 2;
      cxOff = tRect.left + tRect.width / 2 - (blockRect.left + blockRect.width / 2);
      cyOff = tRect.top + tRect.height / 2 - (blockRect.top + blockRect.height / 2);
    };

    const remeasure = () => {
      blockRect = block.getBoundingClientRect();
      sectionRect = section.getBoundingClientRect();
      computeShape();
    };
    remeasure();

    const ro = new ResizeObserver(() => remeasure());
    ro.observe(textEl);

    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, { passive: true });

    let tx = blockRect.width / 2 + cxOff;
    let ty = blockRect.height / 2 + cyOff;
    let tProx = 0;
    let lProx = 0;
    let wasActive = false;

    // Cursor metaball
    let fx = tx;
    let fy = ty;
    let fvx = 0;
    let fvy = 0;

    let lAnchor = 0;
    let lFollow = 0;
    let lResidue = 0;

    // Memory-foam residue blob:
    // stores previous pull direction and eases home slowly on release.
    let rx = tx;
    let ry = ty;
    let rvx = 0;
    let rvy = 0;
    let residueHold = 0;

    const PROX_RADIUS = 176;
    const MAX_STRETCH = 218;
    const FOLLOWER_R = 50;
    const ENABLE_LIQUID_GLASS = true;

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

      tx = clientX - blockRect.left;
      ty = clientY - blockRect.top;

      const scx = blockRect.width / 2 + cxOff;
      const scy = blockRect.height / 2 + cyOff;
      const dx = Math.max(0, Math.abs(tx - scx) - shapeW / 2);
      const dy = Math.max(0, Math.abs(ty - scy) - shapeH / 2);
      const edgeDist = Math.hypot(dx, dy);
      tProx = 1 - Math.min(edgeDist / PROX_RADIUS, 1);
    };

    const onLeaveWindow = () => {
      tProx = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      const cx = blockRect.width / 2 + cxOff;
      const cy = blockRect.height / 2 + cyOff;

      // Proximity smoothing.
      const proxRate = tProx > lProx ? 0.11 : 0.2;
      lProx += (tProx - lProx) * proxRate;
      const p = Math.max(0, Math.min(1, lProx));

      const wasActivePrev = wasActive;
      const isActive = wasActive ? p > 0.11 : p > 0.2;
      if (isActive && !wasActive) {
        fx = tx;
        fy = ty;
        fvx = 0;
        fvy = 0;
      }
      wasActive = isActive;

      if (wasActivePrev && !isActive) {
        // On release, "imprint" the latest follower pose into residue.
        residueHold = 1;
        rx = fx;
        ry = fy;
        rvx = fvx * 0.35;
        rvy = fvy * 0.35;
      }

      // Follower is sticky and springs back to anchor center.
      const stretch = Math.hypot(fx - cx, fy - cy);
      const sn = Math.min(stretch / MAX_STRETCH, 1);
      if (isActive) {
        const pullX = (tx - fx) * (0.2 + p * 0.1);
        const pullY = (ty - fy) * (0.2 + p * 0.1);
        const springK = 0.01 + sn * sn * 0.11 + Math.pow(sn, 6) * 0.16;
        const springX = (cx - fx) * springK;
        const springY = (cy - fy) * springK;
        fvx = (fvx + pullX + springX) * 0.66;
        fvy = (fvy + pullY + springY) * 0.66;

        // Cursor authority: keep the follower feeling under user control.
        const authority = 0.18 + p * 0.22;
        fx += (tx - fx) * authority;
        fy += (ty - fy) * authority;
      } else {
        const springK = 0.1 + sn * sn * 0.09;
        fvx = (fvx + (cx - fx) * springK) * 0.82;
        fvy = (fvy + (cy - fy) * springK) * 0.82;
      }

      // Clamp peak velocity to avoid wobble and over-correction spikes.
      const vMag = Math.hypot(fvx, fvy);
      if (vMag > 16) {
        const s = 16 / vMag;
        fvx *= s;
        fvy *= s;
      }
      fx += fvx;
      fy += fvy;

      const postStretch = Math.hypot(fx - cx, fy - cy);
      if (postStretch > MAX_STRETCH) {
        const s = MAX_STRETCH / postStretch;
        fx = cx + (fx - cx) * s;
        fy = cy + (fy - cy) * s;
        fvx *= 0.45;
        fvy *= 0.45;
      }

      // Memory foam motion: follows lightly while active, then
      // eases back slower than follower when inactive.
      if (isActive) {
        rvx = (rvx + (fx - rx) * 0.08) * 0.76;
        rvy = (rvy + (fy - ry) * 0.08) * 0.76;
        residueHold = Math.min(1, residueHold * 0.92 + 0.08);
      } else {
        rvx = (rvx + (cx - rx) * 0.032) * 0.9;
        rvy = (rvy + (cy - ry) * 0.032) * 0.9;
        residueHold *= 0.965;
      }
      rx += rvx;
      ry += rvy;

      // Visibility gates: hidden until actually close.
      const approach = Math.max(0, Math.min(1, (p - 0.15) / 0.31));
      const stretchVis = Math.min(1, Math.max(0, (postStretch - 22) / 24));

      const anchorTarget = isActive ? approach : 0;
      const followTarget = isActive
        ? Math.max(approach * 0.72, stretchVis * 0.86)
        : stretchVis * 0.38;
      const residueTarget = isActive
        ? followTarget * 0.24
        : Math.max(residueHold * 0.86, stretchVis * 0.16);

      lAnchor += (anchorTarget - lAnchor) * (anchorTarget > lAnchor ? 0.15 : 0.25);
      lFollow += (followTarget - lFollow) * (followTarget > lFollow ? 0.17 : 0.23);
      lResidue += (residueTarget - lResidue) * (residueTarget > lResidue ? 0.11 : 0.07);

      const anchorScale = Math.max(0, Math.min(1, lAnchor));
      const followScale = Math.max(0, Math.min(1, lFollow));
      const residueScale = Math.max(0, Math.min(1, lResidue));
      const gooScale = Math.max(anchorScale, followScale, residueScale);

      // Global cursor fade in active zone.
      const cursorOpacity = Math.max(0, 1 - followScale * 1.35);
      document.documentElement.style.setProperty("--cursor-opacity", cursorOpacity.toFixed(2));

      // True levels crunch using SVG filter:
      // blur then alpha-threshold via feColorMatrix (hard edges, no halo).
      const stdDev = 6.8 + gooScale * 3.9;
      const alphaGain = Math.round(38 + gooScale * 16);
      const alphaOffset = Math.round(-17 - gooScale * 6);
      blurNode.setAttribute("stdDeviation", stdDev.toFixed(2));
      matrixNode.setAttribute(
        "values",
        `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaGain} ${alphaOffset}`
      );
      fxWrap.style.opacity = Math.max(anchorScale, followScale).toFixed(3);

      // ---- Geometry -----------------------------------------------------
      const aw = shapeW * anchorScale;
      const ah = shapeH * anchorScale;
      anchor.style.width = `${aw.toFixed(2)}px`;
      anchor.style.height = `${ah.toFixed(2)}px`;
      anchor.style.transform = `translate3d(${(cx - aw / 2).toFixed(2)}px, ${(cy - ah / 2).toFixed(2)}px, 0)`;
      anchor.style.opacity = anchorScale > 0.02 ? "1" : "0";

      const fr = FOLLOWER_R * followScale;
      const dx = fx - cx;
      const dy = fy - cy;
      const dist = Math.hypot(dx, dy);

      // Bridge: thickens the neck between anchor and follower when close.
      const closeGate = Math.max(0, Math.min(1, 1 - dist / (MAX_STRETCH * 0.9)));
      const bridgeScale = anchorScale * followScale * closeGate;
      const midX = cx + dx * 0.5;
      const midY = cy + dy * 0.5;
      const bridgeR = (shapeH * 0.11 + fr * 0.36) * bridgeScale;
      bridge.style.width = `${(bridgeR * 2).toFixed(2)}px`;
      bridge.style.height = `${(bridgeR * 2).toFixed(2)}px`;
      bridge.style.transform = `translate3d(${(midX - bridgeR).toFixed(2)}px, ${(midY - bridgeR).toFixed(2)}px, 0)`;
      bridge.style.opacity = bridgeScale > 0.03 ? "1" : "0";

      // Memory-foam residue blob: subtle lingering mass.
      const residueR = (shapeH * 0.095 + fr * 0.22) * residueScale;
      residue.style.width = `${(residueR * 2).toFixed(2)}px`;
      residue.style.height = `${(residueR * 2).toFixed(2)}px`;
      residue.style.transform = `translate3d(${(rx - residueR).toFixed(2)}px, ${(ry - residueR).toFixed(2)}px, 0)`;
      residue.style.opacity = residueScale > 0.02 ? "1" : "0";

      // Cursor follower.
      follower.style.width = `${(fr * 2).toFixed(2)}px`;
      follower.style.height = `${(fr * 2).toFixed(2)}px`;
      follower.style.transform = `translate3d(${(fx - fr).toFixed(2)}px, ${(fy - fr).toFixed(2)}px, 0)`;
      follower.style.opacity = followScale > 0.02 ? "1" : "0";

      // ---- Liquid-glass displacement ------------------------------------
      // Feed the SAME blob geometry we render visibly into feImage. The
      // filter internally blurs that mask, which becomes the displacement
      // field — so text under the glass refracts along the blob's edges.
      if (ENABLE_LIQUID_GLASS) {
        const glass = Math.max(0, Math.min(1, gooScale));
        const followerInfluence =
          followScale * Math.max(0, Math.min(1, 1 - dist / (MAX_STRETCH * 1.06)));
        const residueDx = rx - cx;
        const residueDy = ry - cy;
        const residueDist = Math.hypot(residueDx, residueDy);
        const residueInfluence =
          residueScale * Math.max(0, Math.min(1, 1 - residueDist / (MAX_STRETCH * 0.96)));

        // Strong, clearly visible refraction amplitude.
        const glassScale =
          16 +
          glass * 28 +
          followerInfluence * 20 +
          residueInfluence * 6;
        glassDisp.setAttribute("scale", glassScale.toFixed(2));

        const safeW = Math.max(2, blockRect.width);
        const safeH = Math.max(2, blockRect.height);
        const parts: string[] = [
          `<rect width='100%' height='100%' fill='black'/>`,
        ];
        if (anchorScale > 0.02) {
          parts.push(
            `<rect x='${(cx - aw / 2).toFixed(2)}' y='${(cy - ah / 2).toFixed(2)}' width='${aw.toFixed(2)}' height='${ah.toFixed(2)}' rx='${(ah / 2).toFixed(2)}' fill='white'/>`
          );
        }
        if (followScale > 0.02) {
          parts.push(
            `<circle cx='${fx.toFixed(2)}' cy='${fy.toFixed(2)}' r='${fr.toFixed(2)}' fill='white'/>`
          );
        }
        if (bridgeScale > 0.03) {
          parts.push(
            `<circle cx='${midX.toFixed(2)}' cy='${midY.toFixed(2)}' r='${bridgeR.toFixed(2)}' fill='white'/>`
          );
        }
        if (residueScale > 0.02) {
          parts.push(
            `<circle cx='${rx.toFixed(2)}' cy='${ry.toFixed(2)}' r='${residueR.toFixed(2)}' fill='white'/>`
          );
        }
        const mapSvg =
          `<svg xmlns='http://www.w3.org/2000/svg' width='${safeW.toFixed(0)}' height='${safeH.toFixed(0)}' viewBox='0 0 ${safeW.toFixed(2)} ${safeH.toFixed(2)}'>` +
          parts.join("") +
          `</svg>`;
        glassMapImage.setAttribute(
          "href",
          `data:image/svg+xml;utf8,${encodeURIComponent(mapSvg)}`
        );
        textLayer.style.filter = glass > 0.02 ? `url(#${glassFilterId})` : "none";
      } else {
        textLayer.style.filter = "none";
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
      ro.disconnect();
      cancelAnimationFrame(raf);
      textLayer.style.filter = "none";
      textLayer.style.transform = "none";
      document.documentElement.style.setProperty("--cursor-opacity", "1");
    };
  }, [glassFilterId]);

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
      {/* Webflow-style metaball stack:
          outer: contrast/brightness, inner: blur, children: simple balls. */}
      <svg aria-hidden className="absolute h-0 w-0 overflow-hidden pointer-events-none">
        <defs>
          {/* Goo → glass shell. Solid blobs get blurred + alpha-thresholded
              into a merged mask, then the mask is split into a faint body
              and a crisp rim. Result reads as a translucent liquid lens
              rather than solid cream fill. */}
          <filter
            id={gooFilterId}
            x="-35%"
            y="-35%"
            width="170%"
            height="170%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix
              ref={matrixRef}
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 36 -16"
              result="goo"
            />
            {/* Faint glass body: the merged shape at low alpha. */}
            <feColorMatrix
              in="goo"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.18 0"
              result="body"
            />
            {/* Rim: merged shape minus an eroded copy = a thin ring edge. */}
            <feMorphology in="goo" operator="erode" radius="1.2" result="eroded" />
            <feComposite
              in="goo"
              in2="eroded"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="-1"
              k4="0"
              result="rim"
            />
            <feColorMatrix
              in="rim"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.85 0"
              result="rimBright"
            />
            <feMerge>
              <feMergeNode in="body" />
              <feMergeNode in="rimBright" />
            </feMerge>
          </filter>

          {/* Liquid-glass lens. feImage receives the live blob geometry as
              a pure white-on-black mask. That mask is blurred (soft falloff)
              and fed directly into feDisplacementMap as both the X and Y
              channel source — so text below refracts smoothly along the
              blob's edge gradient, exactly like a droplet of liquid glass. */}
          <filter
            id={glassFilterId}
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              ref={glassMapImageRef}
              href=""
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="lensMaskSrc"
            />
            <feGaussianBlur in="lensMaskSrc" stdDeviation="10" result="lensMask" />
            <feDisplacementMap
              ref={glassDispRef}
              in="SourceGraphic"
              in2="lensMask"
              xChannelSelector="R"
              yChannelSelector="G"
              scale="0"
              result="displaced"
            />
            {/* Keep displaced pixels only where the lens is. Elsewhere the
                original text shows through undistorted. */}
            <feComposite in="displaced" in2="lensMask" operator="in" result="insideLens" />
            <feComposite in="SourceGraphic" in2="lensMask" operator="out" result="outsideLens" />
            <feMerge>
              <feMergeNode in="outsideLens" />
              <feMergeNode in="insideLens" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div ref={fxWrapRef} aria-hidden className="absolute inset-0 pointer-events-none opacity-0">
        <div
          ref={fxLayerRef}
          className="absolute inset-0"
          style={{ filter: `url(#${gooFilterId})` }}
        >
          <div
            ref={anchorRef}
            className="absolute rounded-[999px] bg-paper will-change-transform"
          />
          <div
            ref={bridgeRef}
            className="absolute rounded-full bg-paper will-change-transform"
          />
          <div
            ref={residueRef}
            className="absolute rounded-full bg-paper will-change-transform"
          />
          <div
            ref={followerRef}
            className="absolute rounded-full bg-paper will-change-transform"
          />
        </div>
      </div>

      <div
        ref={textLayerRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ mixBlendMode: "difference" }}
        aria-hidden
      >
        <TypeLine outerRef={textRef} />
      </div>
    </a>
  );
}

function TypeLine({ outerRef }: { outerRef?: Ref<HTMLDivElement> }) {
  const full = "Let's talk";
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setCount(0);
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
      ref={outerRef}
      className="pointer-events-auto font-display leading-[0.9] tracking-tight whitespace-nowrap text-white inline-block transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(false)}
      style={{
        fontSize: "clamp(2.4rem, 8vw, 7.6rem)",
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
