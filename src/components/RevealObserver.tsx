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
        if (window.getComputedStyle(el).display === "inline") continue;
        el.dataset.reveal = "text";
        el.dataset.revealOnce = "false";
        enhanceTypewriter(el);
      }
    }

    document.documentElement.classList.add("reveal-mounted");

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;

    // Dynamic trigger window by viewport: start when content is just entering
    // view, and only reverse once it meaningfully leaves the screen.
    const vh = window.innerHeight;
    const topInsetPx = Math.round(Math.max(0, Math.min(20, vh * 0.015)));
    const bottomInsetPx = Math.round(Math.max(18, Math.min(72, vh * 0.06)));
    const threshold = window.innerWidth < 768 ? 0.07 : 0.1;

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

function enhanceTypewriter(el: HTMLElement) {
  if (el.dataset.typewriterReady === "true") return;
  // Only transform simple text blocks; skip richer markup to avoid breaking it.
  const hasElementChildren = Array.from(el.childNodes).some(
    (n) => n.nodeType === Node.ELEMENT_NODE
  );
  if (hasElementChildren) return;

  const raw = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  if (!raw) return;

  el.dataset.typewriterReady = "true";
  el.setAttribute("aria-label", raw);
  el.textContent = "";

  const words = raw.split(" ");
  const center = (words.length - 1) / 2;
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "tw-word";
    span.style.setProperty("--tw-d", String(Math.abs(i - center)));
    span.textContent = word;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
}
