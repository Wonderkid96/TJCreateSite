import type Lenis from "lenis";

// Single typed home for the Lenis handoff global. SmoothScroll owns the
// instance and writes it here; anything needing programmatic scroll (e.g.
// BackToTop) reads it through getLenis, so the shape is typed once against
// the real Lenis API instead of ad-hoc casts at each call site.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function setLenis(instance: Lenis | undefined): void {
  window.__lenis = instance;
}

export function getLenis(): Lenis | undefined {
  return window.__lenis;
}
