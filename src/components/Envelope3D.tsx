"use client";

/**
 * Envelope3D — Chrome @ Symbol
 * ─────────────────────────────────────────────────────────────────────────
 * Large chrome "@" that orbits the cursor, rotates on all axes.
 * - DepthOfField: front face sharp, rear face falls off into blur
 * - ChromaticAberration: intensifies with movement speed
 * - Hover: emissive lerps to accent orange (#e6352a)
 * - Idle: zero emissive (no colour tint)
 */

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Environment } from "@react-three/drei";
import { EffectComposer, ChromaticAberration, Vignette, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// ── Brand colours ─────────────────────────────────────────────────────────
const C_ACCENT = "#e6352a";
const C_LIME   = "#c8db45";
const C_LILAC  = "#c4a9d0";

// Pre-allocated — no allocations inside useFrame
const COL_BLACK  = new THREE.Color(0, 0, 0);
const COL_ACCENT = new THREE.Color(C_ACCENT);
const COL_LERP   = new THREE.Color();

// ── Simple spring util ────────────────────────────────────────────────────
function spring(cur: number, tgt: number, vel: number, k = 0.055, d = 0.83) {
  const v = (vel + (tgt - cur) * k) * d;
  return { value: cur + v, vel: v };
}

// ── Chrome @ mesh ─────────────────────────────────────────────────────────
function ChromeAt({
  mouseNorm,
  onChromeOffset,
  isHovered,
}: {
  mouseNorm:    React.RefObject<{ x: number; y: number }>;
  onChromeOffset: (v: number) => void;
  isHovered:    React.RefObject<boolean>;
}) {
  const group   = useRef<THREE.Group>(null);
  const matRef  = useRef<THREE.MeshPhysicalMaterial>(null);

  const rot       = useRef({ x: 0, y: 0, z: 0 });
  const rotVel    = useRef({ x: 0, y: 0, z: 0 });
  const pos       = useRef({ x: 0, y: 0 });
  const posVel    = useRef({ x: 0, y: 0 });
  const speed     = useRef(0);
  const hoverLerp = useRef(0);

  useFrame(({ clock }) => {
    if (!group.current || !mouseNorm.current) return;
    const t  = clock.elapsedTime;
    const mx = mouseNorm.current.x;
    const my = mouseNorm.current.y;

    // Proximity glow — how close the cursor is to section centre (0,0).
    // dist=0 at centre → full red. dist≥0.7 → no glow.
    // Only active while cursor is inside the section.
    const dist = Math.sqrt(mx * mx + my * my);
    const proximityTarget = isHovered.current
      ? Math.max(0, 1 - dist / 0.7)
      : 0;
    // Smooth lerp so colour bleeds in and out gracefully
    hoverLerp.current += (proximityTarget - hoverLerp.current) * 0.05;

    // idleFade — idle animation retreats proportionally as cursor nears centre
    const idleFade = 1 - hoverLerp.current;

    // Lissajous idle — retreats as cursor approaches centre
    const idleX = (Math.sin(t * 0.13) * 0.05 + Math.sin(t * 0.07) * 0.03) * idleFade;
    const idleY = (Math.sin(t * 0.11) * 0.04 + Math.cos(t * 0.09) * 0.02) * idleFade;

    // Rotation targets — natural card tilt
    const tRX = Math.tanh(-my * 0.55) * 0.30;
    const tRY = Math.tanh( mx * 0.55) * 0.34;
    const tRZ = Math.sin(t * 0.09) * 0.025 * idleFade;

    // Smoother springs: k=0.065 / d=0.82 — fluid follow, no jitter
    const rx = spring(rot.current.x, tRX, rotVel.current.x, 0.065, 0.82);
    const ry = spring(rot.current.y, tRY, rotVel.current.y, 0.065, 0.82);
    const rz = spring(rot.current.z, tRZ, rotVel.current.z, 0.055, 0.84);

    rot.current.x = rx.value; rotVel.current.x = rx.vel;
    rot.current.y = ry.value; rotVel.current.y = ry.vel;
    rot.current.z = rz.value; rotVel.current.z = rz.vel;

    // Position — centred, only idle drift
    const px = spring(pos.current.x, idleX, posVel.current.x, 0.055, 0.84);
    const py = spring(pos.current.y, idleY, posVel.current.y, 0.055, 0.84);

    // Chromatic aberration from rotation velocity
    speed.current += ((Math.abs(rx.vel) + Math.abs(ry.vel)) * 30 - speed.current) * 0.14;
    onChromeOffset(Math.min(0.018, speed.current * 0.00045));

    pos.current.x = px.value; posVel.current.x = px.vel;
    pos.current.y = py.value; posVel.current.y = py.vel;

    // Emissive glow: black at edges, accent red at centre
    if (matRef.current) {
      COL_LERP.copy(COL_BLACK).lerp(COL_ACCENT, hoverLerp.current);
      matRef.current.emissive.copy(COL_LERP);
      matRef.current.emissiveIntensity = hoverLerp.current * 1.1;
    }

    const floatY = Math.sin(t * 0.08) * (0.03 * idleFade + 0.01);
    group.current.rotation.x = rot.current.x;
    group.current.rotation.y = rot.current.y;
    group.current.rotation.z = rot.current.z;
    group.current.position.x = pos.current.x;
    group.current.position.y = pos.current.y + floatY;
  });

  return (
    <group ref={group}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.8}
          height={1.5}
          bevelEnabled
          bevelSize={0.08}
          bevelThickness={0.07}
          bevelSegments={16}
          curveSegments={48}
        >
          @
          <meshPhysicalMaterial
            ref={matRef}
            color="#030303"
            metalness={0.98}
            roughness={0.14}
            clearcoat={1.0}
            clearcoatRoughness={0.03}
            reflectivity={1}
            envMapIntensity={0.35}
            emissiveIntensity={0}
          />
        </Text3D>
      </Center>
    </group>
  );
}

// ── Combined post-processing: DOF + chromatic aberration ──────────────────
function Effects({ chromeOffset }: { chromeOffset: React.RefObject<{ v: number }> }) {
  const composerRef = useRef<{ passes: { fullscreenMaterial?: { uniforms?: { offset?: { value: THREE.Vector2 } } } }[] } | null>(null);

  useFrame(() => {
    if (!composerRef.current) return;
    const v = chromeOffset.current?.v ?? 0.001;
    for (const pass of composerRef.current.passes) {
      const u = pass.fullscreenMaterial?.uniforms?.offset;
      if (u) u.value.set(v, v * 0.6);
    }
  });

  return (
    <EffectComposer ref={composerRef as React.RefObject<null>}>
      {/* Focus front face — 1.0-deep glyph blurs from front to back */}
      <DepthOfField target={[0, 0, 0.5]} focalLength={0.022} bokehScale={5} height={700} />
      <Vignette eskil={false} offset={0.15} darkness={0.92} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.002, 0.001)}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}

// ── Rim rig — lights placed behind the @ and biased to the left.
// Static positions give consistent, controllable rim strokes.
// A tiny slow rotation (one cycle every ~8 min) keeps reflections alive.
function RotatingLights() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.013;
    }
  });
  return (
    <group ref={groupRef}>
      {/* Primary rim — strong back-left, white-hot edge */}
      <pointLight position={[-6,  1, -5]} intensity={22}  color="#ffffff"  distance={18} />
      {/* Secondary top-back — catches the top bevel */}
      <pointLight position={[-2,  5, -5]} intensity={10}  color={C_LILAC}  distance={16} />
      {/* Accent back-right — thin right-edge separation */}
      <pointLight position={[ 5, -1, -4]} intensity={6}   color={C_ACCENT} distance={14} />
      {/* Low fill — barely-there warm base so inner curves aren't pure black */}
      <pointLight position={[-1, -4, -3]} intensity={3}   color={C_LIME}   distance={12} />
    </group>
  );
}

// ── Sweep light — bright arc that fires every 5–10 s, randomised ──────────
// Technique: a single tight point light travels a curved path across the
// front of the shape. Bell-curve easing (sin) means it fades in and out
// naturally. Randomised interval + alternating L→R / R→L so it never
// feels mechanical.
function SweepLight() {
  const lightRef  = useRef<THREE.PointLight>(null);
  const progress  = useRef(-1);          // -1 = dormant
  const nextFire  = useRef(3.5);         // first sweep at 3.5 s
  const direction = useRef(1);           // 1 = L→R, -1 = R→L

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (!lightRef.current) return;

    // Trigger a new sweep
    if (progress.current < 0 && t > nextFire.current) {
      progress.current = 0;
      direction.current *= -1;                          // alternate direction
      nextFire.current = t + 5 + Math.random() * 5;    // next in 5–10 s
    }

    if (progress.current >= 0) {
      // Advance using delta — frame-rate independent, 1.6 s duration
      progress.current = Math.min(1, progress.current + delta / 1.6);
      const p  = progress.current;
      const d  = direction.current;
      // Bell-curve envelope — 0 at both ends, 1 at midpoint
      const env = Math.sin(p * Math.PI);

      // Arc path: sweeps across the front in a shallow curve
      // x goes -4→+4 (or reversed), y gently dips then rises,
      // z stays close to the shape for a tight specular.
      const a = (p - 0.5) * Math.PI;
      lightRef.current.position.set(
        d * Math.sin(a) * 4.5,
        0.8 + Math.cos(a * 0.6) * 1.2,
        2.2 + Math.cos(a) * 0.8,
      );
      // Peak intensity 50 — bright enough to create a crisp specular flash
      lightRef.current.intensity = env * 50;

      if (progress.current >= 1) progress.current = -1;
    } else {
      lightRef.current.intensity = 0;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color="#ffffff"
      intensity={0}
      distance={8}
      decay={2}
    />
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────
function Scene({
  mouseNorm,
  isHovered,
}: {
  mouseNorm: React.RefObject<{ x: number; y: number }>;
  isHovered: React.RefObject<boolean>;
}) {
  const chromeOffset = useRef<{ v: number }>({ v: 0 });
  const onChromeOffset = (v: number) => {
    chromeOffset.current.v = v;
  };

  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.04} />

      <RotatingLights />
      <SweepLight />

      <ChromeAt mouseNorm={mouseNorm} onChromeOffset={onChromeOffset} isHovered={isHovered} />
      <Effects chromeOffset={chromeOffset} />
    </>
  );
}

// ── Public component ──────────────────────────────────────────────────────
// trackRef — the element whose bounds and pointer events are used for
// mouse tracking. Pass the contact section so hover works across the
// whole dark area, not just the 55% canvas box.
export default function Envelope3D({
  trackRef,
}: {
  trackRef?: React.RefObject<HTMLElement | null>;
}) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const mouseNorm = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHovered = useRef<boolean>(false);

  useEffect(() => {
    // Prefer the broader trackRef (section element); fall back to the canvas wrapper.
    const el: HTMLElement | null = trackRef?.current ?? wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseNorm.current.x = ((e.clientX - r.left)  / r.width  - 0.5) * 2;
      mouseNorm.current.y = ((e.clientY - r.top)   / r.height - 0.5) * 2;
    };
    const onEnter = () => { isHovered.current = true; };
    const onLeave = () => {
      isHovered.current = false;
      mouseNorm.current = { x: 0, y: 0 };
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [trackRef]);

  return (
    <div
      ref={wrapRef}
      className="w-full h-full"
      style={{
        maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 70%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 70%)",
      }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 14 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene mouseNorm={mouseNorm} isHovered={isHovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
