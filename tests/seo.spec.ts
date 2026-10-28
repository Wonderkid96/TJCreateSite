import { test, expect } from "@playwright/test";

/**
 * SEO surfaces: the structured data, share images and crawler files that no
 * visual test would notice breaking. Runs against whatever BASE_URL the
 * config points at, so it doubles as a post-deploy check on the live site.
 */
const PROJECT = "twelfth-man";

type Node = { "@type"?: string; "@graph"?: Node[]; mainEntity?: unknown[] };

async function jsonLd(page: import("@playwright/test").Page): Promise<Node[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return scripts.map((s) => JSON.parse(s) as Node);
}

test.describe("SEO surfaces", () => {
  test("home page carries the entity graph and FAQ schema", async ({ page }) => {
    await page.goto("/");
    const all = await jsonLd(page);
    const graph = all.find((g) => Array.isArray(g["@graph"]))?.["@graph"] ?? [];
    expect(graph.map((n) => n["@type"])).toEqual(
      expect.arrayContaining(["Person", "ProfessionalService", "WebSite"]),
    );
    const faq = all.find((g) => g["@type"] === "FAQPage");
    expect(faq?.mainEntity?.length ?? 0).toBeGreaterThan(5);
    expect(await page.locator("h1").count()).toBe(1);
    await expect(page.locator("#faq details").first()).toBeVisible();
  });

  test("project page carries breadcrumb, page and media schema", async ({ page }) => {
    await page.goto(`/projects/${PROJECT}`);
    const all = await jsonLd(page);
    const graph =
      all.find((g) => g["@graph"]?.some((n) => n["@type"] === "BreadcrumbList"))?.["@graph"] ?? [];
    const types = graph.map((n) => n["@type"]);
    expect(types).toEqual(expect.arrayContaining(["BreadcrumbList", "WebPage"]));
    expect(types.some((t) => t === "VideoObject" || t === "ImageObject")).toBe(true);

    await expect(page).toHaveTitle(/TJCreate/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(new RegExp(`/projects/${PROJECT}$`));
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(og).toMatch(new RegExp(`/og/${PROJECT}\\.jpg$`));
    expect(await page.locator("h1").count()).toBe(1);
  });

  test("share image and crawler files respond", async ({ request }) => {
    for (const path of [
      `/og/${PROJECT}.jpg`,
      "/sitemap.xml",
      "/llms.txt",
      "/robots.txt",
      "/manifest.webmanifest",
      "/.well-known/security.txt",
      "/icons/icon-512.png",
    ]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain(`/projects/${PROJECT}`);
    expect(sitemap).toContain("<video:video>");
    expect(sitemap).toContain("<image:image>");
    // Well-formed XML: no bare ampersand, and no double-escaped one either.
    expect(sitemap).not.toMatch(/&(?!(amp|lt|gt|quot|apos|#\d+);)/);
    expect(sitemap).not.toContain("&amp;amp;");

    const llms = await (await request.get("/llms.txt")).text();
    expect(llms).toContain("# TJCreate");
    expect(llms).toContain(`/projects/${PROJECT}`);

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Sitemap:");
    expect(robots).not.toMatch(/Disallow: \/\S/);
  });

  test("legacy paths redirect to their sections", async ({ request }) => {
    for (const [from, to] of [
      ["/work", "/#work"],
      ["/services", "/#services"],
      ["/contact", "/#contact"],
      ["/packages/packshots", "/#contact"],
    ]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect([301, 307, 308], from).toContain(res.status());
      expect(res.headers()["location"], from).toContain(to);
    }
  });

  test("security headers are set", async ({ request }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
