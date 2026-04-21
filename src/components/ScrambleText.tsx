"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  active: boolean;
  /** Accent colours the letters flash through while scrambling. */
  colors?: string[];
  /** Total effect duration (ms). Each letter resolves within this window. */
  duration?: number;
  className?: string;
  /** Reserve width so scrambling never reflows surrounding layout. */
  lockWidth?: boolean;
};

const CHAR_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/\\|{}[]<>*+-=!?@#$%&";
// Update the scramble roughly every ~45ms — readable but frenetic.
const FRAME_MS = 45;

export default function ScrambleText({
  text,
  active,
  colors = ["#E6352A", "#C8DB45", "#C4A9D0"],
  duration = 650,
  className = "",
  lockWidth = false,
}: Props) {
  if (lockWidth) {
    return (
      <span className="relative inline-grid align-baseline" aria-label={text}>
        <span aria-hidden className={`${className} invisible`}>
          {text}
        </span>
        <span aria-hidden className="absolute inset-0">
          {active ? (
            <Scrambler
              key={text}
              text={text}
              colors={colors}
              duration={duration}
              className={className}
            />
          ) : (
            <span className={className}>{text}</span>
          )}
        </span>
      </span>
    );
  }

  // When inactive, render the clean text as a plain span. When active,
  // mount the animated variant — re-mounting resets state cleanly and
  // avoids setState-in-effect churn.
  if (!active) {
    return <span className={className}>{text}</span>;
  }
  return (
    <Scrambler
      key={text}
      text={text}
      colors={colors}
      duration={duration}
      className={className}
    />
  );
}

function Scrambler({
  text,
  colors,
  duration,
  className,
}: Required<Omit<Props, "active" | "lockWidth">>) {
  const [display, setDisplay] = useState<string[]>(() => text.split(""));
  const [tints, setTints] = useState<(string | null)[]>(() =>
    text.split("").map(() => null),
  );

  // Keep the latest colors/duration in a ref so the effect doesn't restart
  // when the parent re-renders with a new array literal. The scramble runs
  // exactly once per mount (once per hover cycle), then lands and stops.
  const colorsRef = useRef(colors);
  const durationRef = useRef(duration);
  useEffect(() => {
    colorsRef.current = colors;
    durationRef.current = duration;
  });

  useEffect(() => {
    const targetChars = text.split("");
    const d = durationRef.current;
    const spread = d * 0.6;
    const lands = targetChars.map((_, i) => {
      const base = (i / targetChars.length) * spread;
      return base + Math.random() * d * 0.25;
    });

    const start = performance.now();
    let raf = 0;
    let lastTick = 0;

    const tick = (now: number) => {
      if (now - lastTick >= FRAME_MS) {
        lastTick = now;
        const elapsed = now - start;
        const currentColors = colorsRef.current;
        const nextDisplay: string[] = [];
        const nextTints: (string | null)[] = [];
        let allLanded = true;

        for (let i = 0; i < targetChars.length; i++) {
          const c = targetChars[i];
          const landed = elapsed >= lands[i] || c === " ";
          if (!landed) allLanded = false;
          nextDisplay.push(
            landed
              ? c
              : CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)],
          );
          nextTints.push(
            landed
              ? null
              : currentColors[
                  Math.floor(Math.random() * currentColors.length)
                ],
          );
        }
        setDisplay(nextDisplay);
        setTints(nextTints);

        if (allLanded) return; // stop scheduling — RAF loop ends here.
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <span className={className}>
      {display.map((c, i) => (
        <span
          key={i}
          style={{ color: tints[i] ?? undefined }}
          className="transition-colors duration-100 will-change-contents"
        >
          {c === " " ? "\u00a0" : c}
        </span>
      ))}
    </span>
  );
}
