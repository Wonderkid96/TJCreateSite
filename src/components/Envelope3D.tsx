"use client";

/**
 * Envelope3D — Chrome @ Symbol
 * ─────────────────────────────────────────────────────────────────────────
 * A 3D chrome "@" that orbits the cursor and rotates on all axes.
 * Chromatic aberration intensifies with movement speed.
 *
 * Brand lighting baked in:
 *   Accent #e6352a — rim from behind
 *   Lime   #c8db45 — fill from below
 *   Lilac  #c4a9d0 — top fill
 *
 * NOT committed — development only.
 */

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Environment } from "@react-three/drei";
import { EffectComposer, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// ── Brand colours ─────────────────────────────────────────────────────────
const C_ACCENT = "#e6352a";
const C_LIME   = "#c8db45";
const C_LILAC  = "#c4a9d0";

// ── Simple spring util ────────────────────────────────────────────────────
function spring(cur: number, tgt: number, vel: number, k = 0.055, d = 0.83) {
  const v = (vel + (tgt - cur) * k) * d;
  return { value: cur + v, vel: v };
}

// ── Chrome @ mesh ─────────────────────────────────────────────────────────
function ChromeAt({
  mouseNorm,
  chromeOffset,
}: {
  mouseNorm: React.RefObject<{ x: number; y: number }>;
  chromeOffset: React.RefObject<{ v: number }>;
}) {
  const group = useRef<THREE.Group>(null);

  const rot    = useRef({ x: 0, y: 0, z: 0 });
  const rotVel = useRef({ x: 0, y: 0, z: 0 });
  const pos    = useRef({ x: 0, y: 0 });
  const posVel = useRef({ x: 0, y: 0 });
  const speed  = useRef(0);

  useFrame(({ clock }) => {
    if (!group.current || !mouseNorm.current) return;
    const t  = clock.elapsedTime;
    const mx = mouseNorm.current.x;
    const my = mouseNorm.current.y;

    // Target rotation — mouse tilts the symbol
    const tRX = -my * 0.6;
    const tRY =  mx * 0.9;
    const tRZ = Math.sin(t * 0.22) * 0.07;

    const rx = spring(rot.current.x, tRX, rotVel.current.x);
    const ry = spring(rot.current.y, tRY, rotVel.current.y);
    const rz = spring(rot.current.z, tRZ, rotVel.current.z, 0.035, 0.9);

    rot.current.x = rx.value; rotVel.current.x = rx.vel;
    rot.current.y = ry.value; rotVel.current.y = ry.vel;
    rot.current.z = rz.value; rotVel.current.z = rz.vel;

    // Orbit — symbol slowly circles the mouse position
    const orbitR = 0.16;
    const tPX = mx * 0.45 + Math.cos(t * 0.55) * orbitR;
    const tPY = my * 0.3  + Math.sin(t * 0.55) * orbitR * 0.65;

    const px = spring(pos.current.x, tPX, posVel.current.x, 0.038, 0.87);
    const py = spring(pos.current.y, tPY, posVel.current.y, 0.038, 0.87);

    // Speed → chromatic intensity
    const dx = px.value - pos.current.x;
    const dy = py.value - pos.current.y;
    speed.current += (Math.sqrt(dx * dx + dy * dy) * 55 - speed.current) * 0.14;

    pos.current.x = px.value; posVel.current.x = px.vel;
    pos.current.y = py.value; posVel.current.y = py.vel;

    if (chromeOffset.current) {
      chromeOffset.current.v = Math.min(0.008, speed.current * 0.00022);
    }

    // Idle float
    const floatY = Math.sin(t * 0.5) * 0.05;

    group.current.rotation.x = rot.current.x;
    group.current.rotation.y = rot.current.y + t * 0.1; // slow spin
    group.current.rotation.z = rot.current.z;
    group.current.position.x = pos.current.x;
    group.current.position.y = pos.current.y + floatY;
  });

  return (
    <group ref={group}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.1}
          height={0.28}
          bevelEnabled
          bevelSize={0.035}
          bevelThickness={0.03}
          bevelSegments={8}
          curveSegments={24}
        >
          @
          <meshPhysicalMaterial
            color="#d8d8d8"
            metalness={1.0}
            roughness={0.04}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            reflectivity={1}
            envMapIntensity={1.4}
          />
        </Text3D>
      </Center>
    </group>
  );
}

// ── Effect bridge — drives ChromaticAberration offset each frame ──────────
function ChromaticDriver({
  chromeOffset,
}: {
  chromeOffset: React.RefObject<{ v: number }>;
}) {
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
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.002, 0.001)}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────
function Scene({ mouseNorm }: { mouseNorm: React.RefObject<{ x: number; y: number }> }) {
  const chromeOffset = useRef<{ v: number }>({ v: 0 });

  return (
    <>
      {/* Environment — provides the reflections chrome needs to look real */}
      <Environment preset="studio" />

      {/* Brand rim light — accent red from behind */}
      <pointLight position={[3, 0, -3]} intensity={6} color={C_ACCENT} distance={12} />

      {/* Lime fill from lower left */}
      <pointLight position={[-3, -2, 2]} intensity={3} color={C_LIME} distance={10} />

      {/* Lilac top */}
      <pointLight position={[0, 4, 1]} intensity={2} color={C_LILAC} distance={10} />

      {/* Soft white key */}
      <directionalLight position={[-2, 3, 4]} intensity={1.5} color="#ffffff" />

      <ChromeAt mouseNorm={mouseNorm} chromeOffset={chromeOffset} />
      <ChromaticDriver chromeOffset={chromeOffset} />
    </>
  );
}

// ── Public component ──────────────────────────────────────────────────────
export default function Envelope3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseNorm = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseNorm.current.x = ((e.clientX - r.left)  / r.width  - 0.5) * 2;
      mouseNorm.current.y = ((e.clientY - r.top)   / r.height - 0.5) * 2;
    };
    const onLeave = () => { mouseNorm.current = { x: 0, y: 0 }; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ height: "340px" }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene mouseNorm={mouseNorm} />
        </Suspense>
      </Canvas>
    </div>
  );
}
