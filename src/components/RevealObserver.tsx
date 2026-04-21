"use client";

import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (!elements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-visible");
          if (el.dataset.revealOnce !== "false") {
            io.unobserve(el);
          }
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
