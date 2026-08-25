import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TJCreate · Toby Johnson",
    short_name: "TJCreate",
    description:
      "I direct and build from concept to delivery. Brand, campaign, motion, 3D, and the sites and apps they live in. Lincoln, UK.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#fffdf8",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
