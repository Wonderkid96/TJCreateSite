import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /ferret/ and /filmio/ are deliberately NOT disallowed here: their
        // pages carry meta noindex, and a robots.txt block would stop crawlers
        // from ever reading that directive (URL could still get indexed bare).
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://www.tjcreate.co.uk/sitemap.xml",
    host: "https://www.tjcreate.co.uk",
  };
}
