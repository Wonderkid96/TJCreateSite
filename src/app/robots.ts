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
        /* /cdn-cgi/ is Cloudflare's, not ours. Email Address Obfuscation
           rewrites every mailto: on the site to
           /cdn-cgi/l/email-protection#<hex>, and the bare path without the
           fragment 404s by design. Cloudflare normally injects this same
           Disallow into robots.txt, but Next generates robots.txt at the
           origin and Cloudflare does not rewrite it, so the rule was lost
           and Googlebot crawled the URL and logged the 404. */
        disallow: ["/api/", "/cdn-cgi/"],
      },
    ],
    sitemap: "https://www.tjcreate.co.uk/sitemap.xml",
    host: "https://www.tjcreate.co.uk",
  };
}
