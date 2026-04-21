"use client";

import { useLayoutEffect } from "react";

export default function RevealObserver() {
  useLayoutEffect(() => {
    // Auto-apply reveals to every content section except the hero (which has
    // its own motion choreography).
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section:not(#top)")
    );
    for (const section of sections) {
      if (!section.dataset.reveal) section.dataset.reveal = "section";
      if (!section.dataset.revealOnce) section.dataset.revealOnce = "false";

      // Fast "type-in feel" for text blocks while scrolling in/out.
      const textEls = Array.from(
        section.querySelectorAll<HTMLElement>("h1, h2, h3, p, li, dt, dd")
      );
      for (const el of textEls) {
        if (el.dataset.reveal) continue;
        if (el.closest("[data-no-auto-text-reveal], a, button, summary")) continue;
        el.dataset.reveal = "text";
        el.dataset.revealOnce = "false";
      }
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;

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
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
