"use client";

import { useSyncExternalStore } from "react";

// Media-query subscription via useSyncExternalStore: SSR and the first
// hydration render use the `false` fallback, then the real value resolves on
// the client — no setState-in-effect, no hydration mismatch (React #418).
// Same pattern as VideoSection's useIsMobile/useReducedMotion.

// Subscribe functions are cached per query so useSyncExternalStore sees a
// stable reference and doesn't resubscribe every render.
const subscribeCache = new Map<
  string,
  (onChange: () => void) => () => void
>();

function getSubscribe(query: string) {
  let subscribe = subscribeCache.get(query);
  if (!subscribe) {
    subscribe = (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    };
    subscribeCache.set(query, subscribe);
  }
  return subscribe;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    getSubscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}
