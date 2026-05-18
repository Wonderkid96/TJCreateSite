import OpengraphImage from "./opengraph-image";

// Twitter card reuses the OpenGraph composition. Next requires the
// config exports to be inline so they can be statically parsed at
// build time; can't re-export from ./opengraph-image.
export const runtime = "edge";
export const alt =
  "Graphic & Motion Designer · Toby Johnson · TJCreate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
