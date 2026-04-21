import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TJCreate · Toby Johnson",
    short_name: "TJCreate",
    description:
      "Graphic and motion designer working with record labels, artists, and ambitious brands.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1e9",
    theme_color: "#f4f1e9",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
