"use client";

import { useSyncExternalStore } from "react";
import ServicesGrid from "@/components/ServicesGrid";
import ServicesWipe from "@/components/ServicesWipe";

// Preview branch only: puts both services options on one deploy so they can
// be compared. ?services=wipe shows the current wipe and ?ground=paper puts the
// word grid on paper. The server snapshot is empty, so the static HTML is
// always the grid on ink and the page stays static.
const subscribe = () => () => {};

export default function ServicesPreview() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  const params = new URLSearchParams(search);
  if (params.get("services") === "wipe") return <ServicesWipe />;
  return <ServicesGrid ground={params.get("ground") === "paper" ? "paper" : "ink"} />;
}
