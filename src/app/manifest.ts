import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TJCreate · Toby Johnson",
    short_name: "TJCreate",
    description:
      "Freelance graphic and motion designer based in Lincoln. Campaign artwork, motion graphics and 3D for brands, artists and agencies.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
