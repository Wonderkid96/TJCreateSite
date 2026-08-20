"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

// Client-mount detection without setState-in-effect: false during SSR and the
// first hydration render, true thereafter. Used to defer portals until after
// mount so the server and the client's first render match (React #418).
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
