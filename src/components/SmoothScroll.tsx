"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Mobile/tablet: keep native scroll physics. Lenis + syncTouch can feel
    // over-processed on touch and can destabilize sticky sections.
    const useNativeScroll = window.matchMedia("(pointer: coarse), (max-width: 1024px)").matches;
    // Reduced-motion users: bypass smooth-scroll entirely so jump links land
    // immediately and the eased momentum doesn't kick in mid-scroll.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (useNativeScroll || prefersReduced) {
      setLenis(undefined);
      return;
    }

    // Desktop only: a light follow (lerp) rather than a fixed-duration glide,
    // so trackpad momentum isn't smoothed a second time and the page tracks
    // input closely. No `duration` or `easing` here: either one switches Lenis
    // to a fixed-duration glide (easing alone defaults duration to 1s).
    // BackToTop passes its own duration and easing.
    const lenis = new Lenis({
      lerp: 0.2,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });
    setLenis(lenis);

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
