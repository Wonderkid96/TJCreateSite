import { defineConfig, devices } from "@playwright/test";

/**
 * Visual + smoke test harness. Runs the site through Chromium + WebKit +
 * Firefox at three viewports and captures screenshots per section.
 *
 * Default target is the live Vercel deployment so tests reflect what real
 * users see. Override with PLAYWRIGHT_BASE_URL=http://localhost:3000 to hit
 * the local dev server instead.
 */
const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL || "https://tj-create-site.vercel.app";

export default defineConfig({
  testDir: "./tests",
  // One page-load per project, so sequential is plenty and keeps output readable.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  reporter: [["list"]],
  outputDir: "test-results/artifacts",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "off", // we manage screenshots explicitly
    // Videos can bypass autoplay restrictions without a user gesture.
    launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] },
  },
  projects: [
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 14 Pro"] }, // WebKit engine, 393×852
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] }, // Chromium engine, 412×915
    },
    {
      name: "tablet-webkit",
      use: { ...devices["iPad Pro 11"] }, // WebKit engine, 834×1194
    },
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-webkit",
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-firefox",
      use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } },
    },
  ],
});
