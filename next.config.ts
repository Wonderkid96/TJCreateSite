import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  compress: true,
  /* The rebuild to a single page left six URLs 404ing that Google had
     indexed in May, which is why Search Console went from ~16 indexed pages
     to 1. A 404 throws away whatever Google had accumulated on a URL; a
     redirect hands it to the page that replaced it.

     `permanent: true` emits 308, not 301. Google consolidates the two
     identically; 308 additionally preserves the request method, which is
     why Next uses it. */
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      // The about copy is a section of the one page now, not its own route.
      { source: "/about", destination: "/#about", permanent: true },
      /* The blog is gone and nothing replaced it, so these land on the
         homepage. Listed individually AND caught by the wildcard: the three
         named ones are what Search Console actually reports, and the
         wildcard covers any other post URL still linked from somewhere we
         cannot see. Google may treat a mass redirect of deleted content as a
         soft 404, which is no worse than the hard 404 they serve today. */
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:slug*", destination: "/", permanent: true },
    ];
  },
  // Baseline security headers for a static marketing site (no auth/API).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Static media rarely changes. Cache for a week, then serve stale
        // while revalidating in the background, so repeat visits are instant
        // without pinning a stale file forever (filenames aren't
        // fingerprinted, so immutable would break in-place asset updates).
        source: "/work/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
