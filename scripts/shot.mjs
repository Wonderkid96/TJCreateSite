import { chromium } from "playwright";

const URL = "http://localhost:3000";
const VIEWPORTS = [
  { name: "desktop", w: 1440, h: 900 },
  { name: "mobile", w: 390, h: 844 },
];
// Section anchors to scroll to and capture. Empty string = top (hero).
const STOPS = ["", "#work", "#services", "#about", "#contact"];

const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(20000);
  page.setDefaultNavigationTimeout(30000);
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  // Let fonts, images and the splash settle. rAF is left running so
  // motion/react whileInView animations actually play to their final state.
  await page.waitForTimeout(2800);
  await page.evaluate(() => {
    document
      .querySelectorAll('[class*="splash" i],[id*="splash" i]')
      .forEach((n) => n.remove());
  });

  let i = 0;
  for (const sel of STOPS) {
    await page.evaluate((s) => {
      if (!s) {
        window.scrollTo({ top: 0 });
        return;
      }
      const el = document.querySelector(s);
      if (el) el.scrollIntoView({ block: "start" });
    }, sel);
    // Wait for whileInView / reveal transitions to finish before capturing.
    await page.waitForTimeout(1600);
    const label = sel ? sel.replace("#", "") : "hero";
    await page.screenshot({
      path: `scripts/shots/${vp.name}-0${i}-${label}.png`,
    });
    i++;
  }

  await ctx.close();
}

await browser.close();
console.log("captured");
