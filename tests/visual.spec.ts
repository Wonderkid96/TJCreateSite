import { test, expect, Page } from "@playwright/test";
import { mkdirSync } from "fs";
import { join } from "path";

const SHOT_DIR = "test-results/screenshots";

type Section = { id: string; name: string };

const SECTIONS: Section[] = [
  { id: "top", name: "hero" },
  { id: "work", name: "work" },
  { id: "services", name: "services" },
  { id: "about", name: "about" },
  { id: "contact", name: "contact" },
];

// Requests + console messages we know about and don't want to fail on.
const ALLOWED_MISSING = [
  "/og-image.jpg", // OG card not yet generated, referenced in meta
];
const IGNORED_CONSOLE = [
  "hydrat", // dev-only hydration warnings suppressed in layout already
  "React DevTools",
  "Lighthouse",
  "download the",
  // Next 16 currently logs this when reconciling head scripts in dev.
  // It does not affect runtime behaviour or production output.
  "Encountered a script tag while rendering React component",
];

test.beforeAll(() => {
  try {
    mkdirSync(SHOT_DIR, { recursive: true });
  } catch {}
});

async function scrollToSection(page: Page, id: string) {
  await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    // Lenis intercepts scroll; use its API when present for accurate landing.
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string | number | HTMLElement, o?: object) => void } }).__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(el, { immediate: true });
    } else {
      el.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, id);
  // Framer Motion whileInView + Lenis need a beat to settle.
  await page.waitForTimeout(1200);
}

async function dismissSplashIfVisible(page: Page) {
  const skip = page.getByRole("button", { name: /skip intro/i });
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
    await expect(skip).not.toBeVisible({ timeout: 2000 });
  }
}

test("home page — smoke + visual", async ({ page }, testInfo) => {
  const project = testInfo.project.name;
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (IGNORED_CONSOLE.some((s) => text.toLowerCase().includes(s.toLowerCase()))) return;
    consoleErrors.push(text);
  });

  page.on("response", (res) => {
    const url = res.url();
    const status = res.status();
    if (status < 400) return;
    if (ALLOWED_MISSING.some((s) => url.includes(s))) return;
    failedRequests.push(`${status} ${url}`);
  });

  page.on("requestfailed", (req) => {
    const url = req.url();
    if (ALLOWED_MISSING.some((s) => url.includes(s))) return;
    // Videos cancel mid-stream when they scroll out of view — the browser
    // aborts the in-flight range request. This is expected behaviour, not
    // a broken resource. WebKit reports these as `fetch` rather than
    // `media`, so match on URL extension too.
    if (req.resourceType() === "media") return;
    if (/\.(mp4|webm|m4v|mov)(\?|$)/i.test(url)) return;
    const err = req.failure()?.errorText ?? "";
    // "cancelled" / "aborted" are user-triggered (scroll) and not failures.
    if (/cancel|abort/i.test(err)) return;
    failedRequests.push(`NETFAIL ${req.method()} ${url} — ${err}`);
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  // Give Lenis a beat to initialise + fonts to paint.
  await page.waitForTimeout(2000);
  await dismissSplashIfVisible(page);

  // --- Assertion 1: no horizontal overflow at any viewport ------------------
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(
    scrollWidth <= innerWidth + 1, // 1px tolerance for sub-pixel rendering
    `[${project}] horizontal overflow: scrollWidth=${scrollWidth}, innerWidth=${innerWidth}`,
  ).toBe(true);

  // --- Assertion 2: key sections exist in DOM -------------------------------
  for (const section of SECTIONS) {
    const present = await page.$(`#${section.id}`);
    expect(present, `[${project}] section #${section.id} missing`).not.toBeNull();
  }

  // --- Assertion 3: hero visual renders (paper-cream bg, not unstyled) -----
  const bodyBg = await page.evaluate(() =>
    getComputedStyle(document.body).backgroundColor,
  );
  expect(bodyBg, `[${project}] body has no paint`).not.toBe("rgba(0, 0, 0, 0)");

  // --- Walk through sections + capture screenshots --------------------------
  for (let i = 0; i < SECTIONS.length; i++) {
    const section = SECTIONS[i];
    if (i > 0) await scrollToSection(page, section.id);
    await page.screenshot({
      path: join(SHOT_DIR, `${project}-${String(i + 1).padStart(2, "0")}-${section.name}.png`),
      fullPage: false,
    });
  }

  // --- Assertion 4: no console errors + no unexpected failed requests ------
  expect(
    consoleErrors,
    `[${project}] console errors:\n  ${consoleErrors.join("\n  ")}`,
  ).toHaveLength(0);

  expect(
    failedRequests,
    `[${project}] failed requests:\n  ${failedRequests.join("\n  ")}`,
  ).toHaveLength(0);
});

test("mobile: real tap on a work tile opens the modal (no overlay blocking)", async ({
  page,
}, testInfo) => {
  // Only makes sense on touch-enabled mobile viewports
  const viewportWidth = page.viewportSize()?.width ?? 0;
  if (viewportWidth >= 768) {
    testInfo.skip();
    return;
  }

  await page.goto("/", { waitUntil: "domcontentloaded" });
  // Wait long enough that any first-visit splash has dismissed
  // (MIN_SHOW_MS 650 + MAX_SHOW_MS 3500 hard ceiling).
  await page.waitForTimeout(4200);
  await dismissSplashIfVisible(page);

  const firstTile = page.locator(".bento-cell button").first();
  await firstTile.scrollIntoViewIfNeeded();

  // Important: verify NOTHING is covering the tile at click time.
  const coveredBy = await firstTile.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (!top) return "nothing at point";
    if (el === top || el.contains(top)) return "tile";
    return `blocked by ${top.tagName}.${(top as HTMLElement).className || "(no class)"}`.slice(0, 120);
  });
  expect(coveredBy, `[${testInfo.project.name}] tile not receiving hits`).toBe("tile");

  // Simulate a real tap (touch event), not a synthetic mouse click.
  await firstTile.tap();

  const modal = page.locator(".fixed.z-\\[90\\]");
  await expect(modal).toBeVisible({ timeout: 3000 });

  await page.screenshot({
    path: join(SHOT_DIR, `${testInfo.project.name}-98-tap-opens-modal.png`),
    fullPage: false,
  });
});

test("nav menu opens + closes", async ({ page }, testInfo) => {
  // Site's md: breakpoint (768px) gates the hamburger, so only run on
  // viewports narrower than that. Playwright's `isMobile` flag includes the
  // iPad, which here renders the desktop nav — skip it.
  const viewportWidth = page.viewportSize()?.width ?? 0;
  if (viewportWidth >= 768) {
    testInfo.skip();
    return;
  }
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await dismissSplashIfVisible(page);

  // Hamburger button — matched by its sr-only label
  const hamburger = page.getByRole("button", { name: /open menu/i });
  await expect(hamburger).toBeVisible();
  await hamburger.click();

  // Panel appears with nav items
  const panel = page.locator("#mobile-nav-panel");
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("link", { name: /^work$/i })).toBeVisible();

  // Framer Motion's height:0 -> auto animation takes 350ms; wait for it
  // to settle before measuring/capturing so we don't screenshot mid-anim.
  await page.waitForTimeout(700);

  // Panel should be meaningfully tall — not stuck at 0 or a sliver.
  const panelHeight = await panel.evaluate((el) => el.getBoundingClientRect().height);
  expect(
    panelHeight,
    `[${testInfo.project.name}] nav panel didn't expand: height=${panelHeight}px`,
  ).toBeGreaterThan(150);

  await page.screenshot({
    path: join(SHOT_DIR, `${testInfo.project.name}-99-nav-open.png`),
    fullPage: false,
  });

  // Close via clicking the hamburger again
  await page.getByRole("button", { name: /close menu/i }).click();
  await expect(panel).not.toBeVisible({ timeout: 5000 });
});

test("project modals — every kind renders media at non-zero size", async ({
  page,
}, testInfo) => {
  // Only need to run this once per device tier (it's layout-agnostic).
  // Run on desktop-chromium + mobile-webkit for coverage, skip the rest.
  const project = testInfo.project.name;
  if (project !== "desktop-chromium" && project !== "mobile-webkit") {
    testInfo.skip();
    return;
  }

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await dismissSplashIfVisible(page);

  // Walk the DOM for every clickable project tile. Skip tiles whose click
  // opens an external URL (externalUrl in content.ts) — those use
  // window.open and would navigate or popup-block the test.
  const tileCount = await page.locator(".bento-cell button").count();
  const failures: string[] = [];

  for (let i = 0; i < tileCount; i++) {
    const tile = page.locator(".bento-cell button").nth(i);
    const label = (await tile.textContent()) ?? `tile ${i}`;
    // `Wrong Places` has externalUrl set and opens YouTube — skip.
    if (/wrong places/i.test(label)) continue;

    await tile.scrollIntoViewIfNeeded();
    await tile.click();
    await page.waitForTimeout(1200);

    const mediaWrap = page.locator(".fixed.z-\\[90\\] [class*='col-span-8']").first();
    // Alternate selector if the class-based one fails in a given browser
    const rect = await mediaWrap.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const hasVisibleMedia = !!el.querySelector(
        "img[src]:not([src='']), video[src]:not([src='']), canvas, iframe[src]:not([src=''])",
      );
      const firstMedia = el.querySelector(
        "img, video, canvas, iframe",
      ) as HTMLElement | null;
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        hasMedia: hasVisibleMedia,
        tag: firstMedia?.tagName.toLowerCase() ?? null,
      };
    });

    const title = label.split("\n")[0]?.slice(0, 40).trim();

    if (rect.h < 100 || rect.w < 100) {
      failures.push(
        `"${title}" modal media collapsed: ${rect.w}×${rect.h} (tag=${rect.tag})`,
      );
    } else if (!rect.hasMedia) {
      failures.push(`"${title}" modal has no renderable media element`);
    }

    await page.screenshot({
      path: join(SHOT_DIR, `${project}-modal-${i}.png`),
      fullPage: false,
    });

    // Close the modal via the close button
    const close = page.getByRole("button", { name: /close/i }).first();
    if (await close.isVisible().catch(() => false)) {
      await close.click();
      await page.waitForTimeout(600);
    } else {
      // Fall back: Escape key closes via keydown handler
      await page.keyboard.press("Escape");
      await page.waitForTimeout(600);
    }
  }

  expect(
    failures,
    `[${project}] modal failures:\n  ${failures.join("\n  ")}`,
  ).toHaveLength(0);
});

test("theme toggle flips --paper/--ink", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const readTheme = () =>
    page.evaluate(() => ({
      theme: document.documentElement.dataset.theme || "light",
      paper: getComputedStyle(document.documentElement).getPropertyValue("--paper").trim(),
    }));

  const before = await readTheme();
  await page.getByRole("button", { name: /switch to (dark|light) mode/i }).first().click();
  await page.waitForTimeout(500);
  const after = await readTheme();

  expect(
    before.theme,
    `[${testInfo.project.name}] theme toggle did nothing: ${before.theme} -> ${after.theme}`,
  ).not.toBe(after.theme);
  expect(before.paper).not.toBe(after.paper);
});
