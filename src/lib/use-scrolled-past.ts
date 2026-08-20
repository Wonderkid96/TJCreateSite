"use client";

import { useEffect, useState } from "react";

// The floating buttons (BackToTop, ContactFab) appear once the visitor is
// past the hero. One shared threshold so they always agree.
export const PAST_HERO_SCROLL_Y = 700;

export function useScrolledPast(threshold: number): boolean {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isPast;
}
