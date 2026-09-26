import { test, expect } from "@playwright/test";
import { PROJECTS } from "../src/lib/content";
import { FEATURED_SLUGS } from "../src/lib/portfolio";

// Opt in to the installed Chrome when bundled browsers are unavailable.
if (process.env.PLAYWRIGHT_CHANNEL) {
  test.use({ channel: process.env.PLAYWRIGHT_CHANNEL });
}
test.use({ contextOptions: { reducedMotion: "reduce" } });

const featured = PROJECTS.find((project) => project.slug === "together-we-stand")!;

test("Twelfth Man crops square in the gallery and keeps its portrait frame in quick view and project page", async ({ page }) => {
  await page.goto("/#work");
  const tile = page.getByRole("button", { name: "View Twelfth Man", exact: true });
  await tile.scrollIntoViewIfNeeded();
  const frame = tile.locator(".project-image");
  await expect.poll(async () => {
    const box = await frame.boundingBox();
    return box ? Math.abs(box.width / box.height - 1) : 1;
  }).toBeLessThan(0.01);
  await expect(tile.locator("img")).toHaveCSS("object-fit", "cover");

  await tile.click();
  const dialog = page.getByRole("dialog");
  const video = dialog.locator("video");
  await expect(video).toHaveCSS("object-fit", "contain");
  await expect.poll(async () => {
    const box = await dialog.locator("[data-modal-media]").boundingBox();
    return box ? Math.abs(box.width / box.height - 0.75) : 1;
  }).toBeLessThan(0.01);
  await dialog.getByRole("link", { name: "View project", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/twelfth-man$/);
  await expect.poll(async () => {
    const box = await page.locator(".project-detail-media").boundingBox();
    return box ? Math.abs(box.width / box.height - 0.75) : 1;
  }).toBeLessThan(0.01);
  await expect(page.locator("video")).toHaveCSS("object-fit", "contain");
});

test("work filters select real disciplines and reset without losing project links", async ({ page }) => {
  await page.goto("/#work");
  const work = page.locator("#work");
  const filters = page.getByRole("group", { name: "Filter work" });
  await expect(filters).toBeVisible();
  await expect(filters.getByRole("button", { name: "All work", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(work.getByRole("link", { name: /view project/i })).toHaveCount(PROJECTS.length);
  await filters.getByRole("button", { name: "Selected", exact: true }).click();
  await expect(work.getByRole("link", { name: /view project/i })).toHaveCount(FEATURED_SLUGS.length);
  const cases = [
    { label: "Graphic", categories: ["Graphic", "Identity", "Print", "Music"] },
    { label: "Motion", categories: ["Motion"] },
    { label: "3D", categories: ["3D"] },
    { label: "All work", categories: null },
  ];
  for (const { label, categories } of cases) {
    await filters.getByRole("button", { name: label, exact: true }).click();
    await expect(filters.getByRole("button", { name: label, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(filters.locator('[aria-pressed="true"]')).toHaveCount(1);
    const expected = PROJECTS.filter((project) => !categories || categories.includes(project.category));
    const links = work.getByRole("link", { name: /view project/i });
    await expect(links).toHaveCount(expected.length);
    await expect(work.getByRole("status")).toContainText(String(expected.length));
    expect(await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))).toEqual(
      expected.map((project) => `/projects/${project.slug}`),
    );
  }
});

test("navigation remains reachable after scrolling to work", async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  if (page.viewportSize()!.width < 768) {
    const menu = page.getByRole("button", { name: /open menu/i });
    await expect(menu).toBeInViewport();
    await menu.click();
    await page.getByRole("navigation", { name: "Mobile primary", exact: true }).getByRole("link", { name: "Contact", exact: true }).click();
  } else {
    const contact = page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "Contact", exact: true });
    await expect(contact).toBeInViewport();
    await contact.click();
  }
  await expect(page.locator("#contact")).toBeInViewport();
});

test("narrow quick view exposes its full overview and project route, then restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#work");
  const tile = page.getByRole("button", { name: "View Together We Stand", exact: true });
  await tile.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const overview = dialog.getByText(featured.blurb, { exact: true });
  await expect(overview).toBeVisible();
  // The overview must not be its own clipped scrolling island. The dialog
  // body can scroll, but the copy's immediate wrapper must fit all its text.
  expect(await overview.evaluate((node) => {
    const wrapper = node.parentElement!;
    return wrapper.scrollHeight <= wrapper.clientHeight + 1;
  })).toBe(true);
  const projectLink = dialog.getByRole("link", { name: /view project/i });
  await projectLink.scrollIntoViewIfNeeded();
  await expect(projectLink).toBeInViewport();
  await expect(projectLink).toHaveAttribute("href", "/projects/together-we-stand");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(tile).toBeFocused();
});

test("project is independently readable without JavaScript and unknown projects return 404", async ({ browser, baseURL, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    const response = await page.goto("/projects/together-we-stand");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Together We Stand/);
    await expect(page.getByRole("heading", { level: 1, name: /^Together We Stand\.?$/ })).toBeVisible();
    await expect(page.getByText(featured.blurb, { exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.tjcreate.co.uk/projects/together-we-stand");
    await expect(page.getByRole("link", { name: /back to work/i })).toHaveAttribute("href", "/#work");
    expect(await page.locator("main img, main video, main iframe").count()).toBeGreaterThan(0);
    const enquiry = page.locator('a[href^="mailto:hello@tjcreate.co.uk"]').first();
    const address = new URL((await enquiry.getAttribute("href"))!);
    expect(address.searchParams.get("subject")).toContain("Together We Stand");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } finally {
    await context.close();
  }
  const missing = await request.get("/projects/nonexistent-regression-project");
  expect(missing.status()).toBe(404);
});

test("concept studies are labelled separately from client work", async ({ page }) => {
  await page.goto("/projects/huel-render");
  await expect(page.getByText("Self-initiated", { exact: true })).toBeVisible();
  await expect(page.getByText(/Not a client commission/)).toBeVisible();
});

test("mobile reel uses one video and respects playback controls and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const videos = page.locator("#top video");
  await expect(videos).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Play showreel", exact: true })).toBeVisible();
  expect(await videos.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await page.getByRole("button", { name: "Play showreel", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause showreel", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Pause showreel", exact: true }).click();
  await expect.poll(() => videos.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(page.getByRole("button", { name: "Pause showreel", exact: true })).toBeVisible();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect.poll(() => videos.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
});

test("package tabs support keyboard selection and enquiries for the selected offer", async ({ page }) => {
  await page.goto("/#services");
  const tabs = page.getByRole("tablist", { name: "Packages", exact: true });
  await tabs.scrollIntoViewIfNeeded();
  await expect(tabs.getByRole("tab")).toHaveCount(6);
  const names = [
    "Campaign Versioning",
    "Static Artwork to Motion",
    "Repeatable Motion Templates",
    "Lyric Videos",
    "Captioned Video Cutdowns",
    "Design Production Blocks",
  ];
  const proofs = new Map([
    ["Campaign Versioning", "/projects/together-we-stand"],
    ["Static Artwork to Motion", "/projects/baraka-loop"],
    ["Repeatable Motion Templates", "/projects/carousel-square"],
    ["Lyric Videos", "/projects/jb-wrong-places"],
  ]);
  for (const name of names) {
    const tab = tabs.getByRole("tab", { name, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = page.getByRole("tabpanel", { name, exact: true });
    await expect(panel).toBeVisible();
    const enquiry = tabs.locator("..").locator('a[href^="mailto:"]');
    const address = new URL((await enquiry.getAttribute("href"))!);
    expect(address.pathname).toBe("hello@tjcreate.co.uk");
    expect(address.searchParams.get("subject")).toContain(name);
    await expect(panel.getByText(/Toby (gives|reviews|completes)/)).toBeVisible();
    const proof = panel.getByRole("link");
    if (proofs.has(name)) {
      await expect(proof).toHaveAttribute("href", proofs.get(name)!);
    } else {
      await expect(proof).toHaveCount(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect(tabs.locator("..").getByText(/open-ended retainers are scoped separately/)).toBeVisible();
  const last = tabs.getByRole("tab", { name: "Design Production Blocks", exact: true });
  await last.focus();
  await page.keyboard.press("Home");
  await expect(tabs.getByRole("tab", { name: names[0], exact: true })).toBeFocused();
  const horizontal = await tabs.getAttribute("aria-orientation") === "horizontal";
  await page.keyboard.press(horizontal ? "ArrowRight" : "ArrowDown");
  await expect(tabs.getByRole("tab", { name: names[1], exact: true })).toBeFocused();
  await expect(tabs.getByRole("tab", { name: names[1], exact: true })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(last).toBeFocused();
  await page.keyboard.press(horizontal ? "ArrowRight" : "ArrowDown");
  await expect(tabs.getByRole("tab", { name: names[0], exact: true })).toBeFocused();
});

test("Packages navigation reaches the fourth service from home and project pages", async ({ page }) => {
  for (const path of ["/", "/projects/together-we-stand"]) {
    await page.goto(path);
    const mobile = page.viewportSize()!.width < 768;
    if (mobile) await page.getByRole("button", { name: "Open menu", exact: true }).click();
    const nav = page.getByRole("navigation", { name: mobile ? "Mobile primary" : "Primary", exact: true });
    const link = nav.getByRole("link", { name: "Packages", exact: true });
    await expect(link).toHaveAttribute("href", path === "/" ? "#packages" : "/#packages");
    await link.click();
    await expect(page).toHaveURL(/\/#packages$/);
    const heading = page.getByRole("heading", { name: "Packages.", exact: true });
    await expect(heading).toBeInViewport();
    const bounds = await heading.boundingBox();
    expect(bounds!.y).toBeGreaterThanOrEqual(56);
    await page.getByRole("tab", { name: "Lyric Videos", exact: true }).click();
    await expect(page.getByRole("tabpanel", { name: "Lyric Videos", exact: true })).toBeVisible();
    if (mobile) await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("Packages deep link preserves service heading scale across viewport sizes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const [width, height] of [[320, 740], [390, 844], [1024, 761], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/#packages");
    const heading = page.getByRole("heading", { name: "Packages.", exact: true });
    await expect(heading).toBeInViewport();
    const styles = await page.locator("#services h3").evaluateAll((nodes) => nodes.map((node) => {
      const style = getComputedStyle(node);
      return { size: style.fontSize, lineHeight: style.lineHeight, transform: style.textTransform };
    }));
    expect(styles).toHaveLength(4);
    expect(styles[3]).toEqual(styles[0]);
    const tab = page.getByRole("tab", { name: "Design Production Blocks", exact: true });
    await tab.click();
    const cta = page.locator('#services a[href^="mailto:"]');
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("Packages destination stays visible across layout changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects/together-we-stand");
  await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "Packages", exact: true }).click();
  const heading = page.getByRole("heading", { name: "Packages.", exact: true });
  await expect(heading).toBeInViewport();
  for (const [width, height] of [[390, 844], [1440, 900], [1024, 761]]) {
    await page.setViewportSize({ width, height });
    await expect(heading).toBeInViewport();
  }
  await page.reload();
  await expect(heading).toBeInViewport();
});
