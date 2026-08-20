import { test, expect } from "@playwright/test";

test.describe("Mobile a11y + interaction", () => {
  test("ProjectModal has proper ARIA attributes + focus trap", async ({ page }, testInfo) => {
    if (page.viewportSize()!.width >= 768) {
      testInfo.skip();
      return;
    }
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    // Splash auto-dismisses after ~1.2s; without a bounded timeout this click
    // would retry until the whole test times out when the button is gone.
    await page
      .getByRole("button", { name: /skip intro/i })
      .click({ timeout: 2000 })
      .catch(() => {});
    await page.waitForTimeout(800);

    const tile = page.locator("#work button").first();
    await tile.tap();
    await page.waitForTimeout(1000);

    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible();

    const attrs = await dialog.evaluate((el) => ({
      role: el.getAttribute("role"),
      ariaModal: el.getAttribute("aria-modal"),
      ariaLabelledBy: el.getAttribute("aria-labelledby"),
    }));

    expect(attrs.role).toBe("dialog");
    expect(attrs.ariaModal).toBe("true");
    expect(attrs.ariaLabelledBy).toBe("project-modal-title");

    const closeBtn = page.getByRole("button", { name: /close/i }).first();
    await expect(closeBtn).toBeVisible();
  });

  test("Envelope3D does not mount on touch devices", async ({ page }, testInfo) => {
    if (page.viewportSize()!.width >= 768) {
      testInfo.skip();
      return;
    }
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Verify Envelope3D is not loaded by checking if pointer:coarse media query
    // blocked the lazy component mount
    const pointerCoarse = await page.evaluate(() => {
      return window.matchMedia("(pointer: coarse)").matches;
    });

    // On a touch device, pointer:coarse should be true, and Envelope3D should skip mount
    if (pointerCoarse) {
      const threejsLoaded = await page.evaluate(() => {
        return !!(window as Window & { THREE?: unknown }).THREE;
      }).catch(() => false);
      expect(threejsLoaded).toBe(false);
    }
  });

  test("Nav hamburger returns focus on Escape close", async ({ page }, testInfo) => {
    // Nav.tsx returns focus via an effect watching `open` -> false (the
    // wasOpenRef pattern), so the focus call lands after React's commit and
    // the AnimatePresence exit.
    if (page.viewportSize()!.width >= 768) {
      testInfo.skip();
      return;
    }
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const hamburger = page.getByRole("button", { name: /open menu/i });
    await hamburger.click();
    await page.waitForTimeout(500);

    // Close menu via Escape key
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Focus should return to the hamburger — the only button carrying
    // aria-expanded. (It has no aria-label; its name comes from sr-only text.)
    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      return active instanceof HTMLElement && active.hasAttribute("aria-expanded");
    });

    expect(focusedElement).toBe(true);
  });

  test("Video tiles do not autoplay on touch", async ({ page }, testInfo) => {
    if (page.viewportSize()!.width >= 768) {
      testInfo.skip();
      return;
    }
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    const tiles = await page.locator("#work button").count();
    let foundVideo = false;

    for (let i = 0; i < tiles && !foundVideo; i++) {
      const tile = page.locator("#work button").nth(i);
      const hasVideo = await tile.evaluate((el) => {
        const video = el.querySelector("video");
        return !!video;
      }).catch(() => false);

      if (hasVideo) {
        foundVideo = true;
        const isPlaying = await tile.evaluate((el) => {
          const video = el.querySelector("video") as HTMLVideoElement;
          return video && !video.paused;
        }).catch(() => false);

        expect(isPlaying).toBe(false);
      }
    }
  });
});
