"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Mobile/tablet: keep native scroll physics. Lenis + syncTouch can feel
    // over-processed on touch and can destabilize sticky sections.
    const useNativeScroll = window.matchMedia("(pointer: coarse), (max-width: 1024px)").matches;
    // Reduced-motion users: bypass smooth-scroll entirely so jump links land
    // immediately and the eased momentum doesn't kick in mid-scroll.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (useNativeScroll || prefersReduced) {
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      return;
    }

    // Desktop only: keep a little smoothing, but make it feel much closer
    // to native input so the page tracks the wheel immediately.
    const lenis = new Lenis({
      duration: 0.55,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
