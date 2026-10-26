import { test, expect } from "@playwright/test";

if (process.env.PLAYWRIGHT_CHANNEL) test.use({ channel: process.env.PLAYWRIGHT_CHANNEL });

test.use({ contextOptions: { reducedMotion: "reduce" } });

const CONTACT_API = /\/api\/contact$/;

test.describe("Contact", () => {
  test("desktop places contact details beside the form and keeps direct email available", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#contact");

    const section = page.locator("#contact");
    const details = section.getByRole("heading", { name: "Say hello.", exact: true });
    const form = section.getByRole("heading", { name: "Or tell me about it here", exact: true });
    const detailsBox = await details.boundingBox();
    const formBox = await form.boundingBox();
    expect(detailsBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(formBox!.x).toBeGreaterThan(detailsBox!.x);
    const columns = section.locator(".grid > div");
    const left = await columns.nth(0).boundingBox();
    const right = await columns.nth(1).boundingBox();
    expect(right!.x).toBeGreaterThanOrEqual(left!.x + left!.width);
    expect(left!.y).toBeLessThan(right!.y + right!.height);

    await expect(section.getByRole("link", { name: "hello@tjcreate.co.uk", exact: true })).toBeVisible();
  });

  test("mobile stacks the form below the contact details", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#contact");

    const section = page.locator("#contact");
    const details = section.getByRole("heading", { name: "Say hello.", exact: true });
    const form = section.getByRole("heading", { name: "Or tell me about it here", exact: true });
    const detailsBox = await details.boundingBox();
    const formBox = await form.boundingBox();
    expect(detailsBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(formBox!.y).toBeGreaterThan(detailsBox!.y + detailsBox!.height);
    expect(formBox!.x).toBeGreaterThanOrEqual(detailsBox!.x - 1);
  });

  test("successful submission posts form data and announces success", async ({ page }) => {
    let posted: Record<string, string> | undefined;
    await page.route(CONTACT_API, async (route) => {
      posted = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await page.goto("/#contact");

    await page.getByLabel("Name").fill("Toby Johnson");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("toby@example.com");
    await page.getByLabel("Company").fill("TJCreate");
    await page.getByLabel("Project details").fill("A short project brief.");
    await page.getByRole("button", { name: "Send enquiry" }).click();

    await expect(page.locator("#contact").getByRole("status")).toContainText("Message sent.");
    await expect(page.locator("#contact").getByRole("status")).toContainText("Thanks, Toby Johnson. I'll reply to toby@example.com.");
    expect(posted).toEqual(expect.objectContaining({
      name: "Toby Johnson",
      email: "toby@example.com",
      company: "TJCreate",
      message: "A short project brief.",
      website: "",
    }));
    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(page.getByLabel("Name")).toHaveValue("");
    await expect(page.getByLabel("Name")).toBeFocused();
  });

  test("shows inline errors instead of submitting an incomplete form", async ({ page }) => {
    let calls = 0;
    await page.route(CONTACT_API, (route) => {
      calls += 1;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await page.goto("/#contact");

    await page.getByRole("textbox", { name: "Email", exact: true }).fill("not-an-email");
    await page.getByRole("button", { name: "Send enquiry" }).click();

    await expect(page.getByText("Please add your name.")).toBeVisible();
    await expect(page.getByText("That email address doesn't look right.")).toBeVisible();
    await expect(page.getByText("Tell me a little about the project.")).toBeVisible();
    await expect(page.getByLabel("Name")).toBeFocused();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
    expect(calls).toBe(0);

    await page.getByLabel("Name").fill("Toby");
    await expect(page.getByText("Please add your name.")).toHaveCount(0);
  });

  test("provider failure announces error and preserves entered data", async ({ page }) => {
    await page.route(CONTACT_API, (route) => route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "Send failed" }),
    }));
    await page.goto("/#contact");

    await page.getByLabel("Name").fill("Toby Johnson");
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("toby@example.com");
    await page.getByLabel("Company").fill("TJCreate");
    await page.getByLabel("Project details").fill("Please retain this message.");
    await page.getByRole("button", { name: "Send enquiry" }).click();

    await expect(page.locator("#contact").getByRole("alert")).toContainText("That didn't send. Your details are still here.");
    await expect(page.getByLabel("Name")).toHaveValue("Toby Johnson");
    await expect(page.getByRole("textbox", { name: "Email", exact: true })).toHaveValue("toby@example.com");
    await expect(page.getByLabel("Company")).toHaveValue("TJCreate");
    await expect(page.getByLabel("Project details")).toHaveValue("Please retain this message.");
    await expect(page.getByRole("link", { name: "Email me directly" })).toHaveAttribute("href", /^mailto:hello@tjcreate\.co\.uk\?/);
  });

  test("reads browser autofill values without input events", async ({ page }) => {
    let posted: Record<string, string> | undefined;
    await page.route(CONTACT_API, async (route) => {
      posted = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await page.goto("/#contact");

    await page.locator("#contact-name").evaluate((node) => { (node as HTMLInputElement).value = "Autofilled Name"; });
    await page.locator("#contact-email").evaluate((node) => { (node as HTMLInputElement).value = "autofill@example.com"; });
    await page.locator("#contact-company").evaluate((node) => { (node as HTMLInputElement).value = "Autofill Co"; });
    await page.getByLabel("Project details").fill("Message entered after autofill.");
    await page.getByRole("button", { name: "Send enquiry" }).click();

    await expect(page.locator("#contact").getByRole("status")).toContainText("Message sent.");
    expect(posted).toEqual(expect.objectContaining({
      name: "Autofilled Name",
      email: "autofill@example.com",
      company: "Autofill Co",
      message: "Message entered after autofill.",
    }));
  });

  test("contact API rejects bad origins and invalid fields without sending", async ({ request, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const valid = { name: "Test", email: "test@example.com", company: "", message: "Hello", website: "" };

    const foreign = await request.post("/api/contact", { headers: { Origin: "https://evil.example" }, data: valid });
    expect(foreign.status()).toBe(403);

    const badEmail = await request.post("/api/contact", { headers: { Origin: origin }, data: { ...valid, email: "nope" } });
    expect(badEmail.status()).toBe(400);

    const empty = await request.post("/api/contact", { headers: { Origin: origin }, data: { ...valid, message: "  " } });
    expect(empty.status()).toBe(400);

    const bot = await request.post("/api/contact", { headers: { Origin: origin }, data: { ...valid, website: "spam" } });
    expect(bot.status()).toBe(200);
  });
});
