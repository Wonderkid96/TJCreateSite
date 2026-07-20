"use client";

import { useLayoutEffect } from "react";

export default function RevealObserver() {
  useLayoutEffect(() => {
    // Auto-apply reveals to every content section except the hero (which has
    // its own motion choreography) and anything opted out with
    // `data-no-reveal`.
    //
    // The opt-out exists because the observer's root is shrunk from the bottom
    // by `bottomInsetPx` (up to 200px). An element that sits at the very end of
    // the document and is shorter than that inset can never cross the trigger
    // line — there is no further scroll available to lift it up — so it would
    // stay at opacity 0 forever. The footer hit exactly this: 150px tall at the
    // document bottom against a 168px inset.
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main section:not(#top):not([data-no-reveal])"
      )
    );
    for (const section of sections) {
      if (!section.dataset.reveal) section.dataset.reveal = "section";
      // Sections reveal once and stay — re-hiding a whole section as the
      // user scrolls back causes the work grid to vanish mid-browse.
      if (!section.dataset.revealOnce) section.dataset.revealOnce = "true";

      // Simple block fade-in for text elements as they scroll in/out.
      const textEls = Array.from(
        section.querySelectorAll<HTMLElement>("h1, h2, h3, p, li, dt, dd")
      );
      for (const el of textEls) {
        if (el.dataset.reveal) continue;
        if (el.closest("[data-no-auto-text-reveal], a, button, summary")) continue;
        if (window.getComputedStyle(el).display === "inline") continue;
        el.dataset.reveal = "text";
        el.dataset.revealOnce = "false";
      }
    }

    document.documentElement.classList.add("reveal-mounted");

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;

    // Dynamic trigger window by viewport: start when content is just entering
    // view, and only reverse once it meaningfully leaves the screen.
    const vh = window.innerHeight;
    const topInsetPx = Math.round(Math.max(0, Math.min(20, vh * 0.015)));
    const bottomInsetPx = Math.round(Math.max(60, Math.min(200, vh * 0.18)));
    // Use threshold 0 — rootMargin already provides the "meaningful entry"
    // gate. A 7%/10% threshold breaks on very tall sections (e.g. the Work
    // grid at mobile: 15 full-width tiles ≈ 11 000px, 7% = 770px which
    // exceeds the contracted viewport, so is-visible is never applied).
    const threshold = 0;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const revealOnce = el.dataset.revealOnce === "true";

          if (entry.isIntersecting) {
            el.classList.add("is-visible");
          } else if (!revealOnce) {
            el.classList.remove("is-visible");
          }

          if (entry.isIntersecting && revealOnce) {
            io.unobserve(el);
          }
        }
      },
      {
        threshold,
        rootMargin: `-${topInsetPx}px 0px -${bottomInsetPx}px 0px`,
      }
    );

    elements.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-mounted");
    };
  }, []);

  return null;
}
