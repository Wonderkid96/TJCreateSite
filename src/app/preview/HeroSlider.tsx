"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = { src: string; title: string; meta: string; video?: string };

// How long each slide holds before advancing.
const INTERVAL_MS = 4200;

/**
 * Full-bleed auto-advancing image slider for the poster hero.
 * Renders the rotating best-work visuals; the masthead/furniture is passed
 * in as children so copy stays in the (server) page and only the motion
 * lives here. Pauses for reduced-motion users.
 */
export default function HeroSlider({
  slides,
  children,
}: {
  slides: Slide[];
  children?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-paper">
      {slides.map((s, i) => (
        <div
          key={s.src}
          aria-hidden={i !== active}
          className="absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(.4,0,.2,1)]"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          {s.video ? (
            <video
              src={s.video}
              poster={s.src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={s.src}
              alt={s.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>
      ))}

      {/* Legibility overlay — dark at the bottom for the masthead, light up
          top so the work itself stays vibrant. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40" />

      {/* Overlaid masthead / furniture */}
      {children}

      {/* Now-showing caption + clickable progress dashes */}
      <div className="absolute inset-x-6 bottom-6 z-10 flex items-center justify-between md:inset-x-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60">
          Now showing · {slides[active]?.meta}
        </div>
        <div className="flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Show ${s.title}`}
              onClick={() => setActive(i)}
              className="h-[3px] w-7 rounded-full transition-colors"
              style={{
                backgroundColor:
                  i === active ? "var(--accent)" : "rgba(255,253,248,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
