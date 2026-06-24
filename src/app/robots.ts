import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ferret/"],
      },
    ],
    sitemap: "https://www.tjcreate.co.uk/sitemap.xml",
    host: "https://www.tjcreate.co.uk",
  };
}
