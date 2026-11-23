import { expect, test } from "@playwright/test";

test("transparent header reveals its glass surface on scroll and resets at the top", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header.floating-header");
  await expect(page.getByRole("button", { name: "Switch to English" }).first()).toBeEnabled();
  await expect(header).toHaveAttribute("data-light", "true");
  await expect(header).toHaveAttribute("data-scrolled", "false");
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
  await expect(header).toHaveAttribute("data-scrolled", "true");
  await expect(header).toHaveAttribute("data-light", "false");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(header).toHaveAttribute("data-light", "true");
});

test("footer loads Dotmark on approach and preserves narrow-screen layout", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const mark = page.locator("[data-footer-wordmark]");
  await expect(page.getByRole("button", { name: "Switch to English" }).first()).toBeEnabled();
  await expect(mark.locator("canvas")).toHaveCount(0);
  await mark.scrollIntoViewIfNeeded();
  await expect(mark.locator("canvas")).toHaveCount(1);
  await expect(mark.locator("[data-dm-still]")).toHaveCSS("visibility", "hidden");
  await page.mouse.move(200, 500);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("reduced motion retains a still dotted wordmark without loading a canvas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/kontak?lang=en");
  const mark = page.locator("[data-footer-wordmark]");
  await expect(page.getByRole("button", { name: "Ganti ke Bahasa Indonesia" }).first()).toBeEnabled();
  await mark.scrollIntoViewIfNeeded();
  await expect(mark.locator("svg text")).toHaveText("HCBTECH");
  await expect(mark.locator("canvas")).toHaveCount(0);
});

test("failed optional Dotmark download preserves the page and still wordmark", async ({ page }) => {
  await page.route("**/FramerDotmark-*.js", route => route.abort());
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Switch to English" }).first()).toBeEnabled();
  const mark = page.locator("[data-footer-wordmark]");
  await mark.scrollIntoViewIfNeeded();
  await expect(mark.locator("[data-wordmark-fallback] svg text")).toHaveText("HCBTECH");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Mesin yang dibuat");
});

test("wordmark and navigation remain present without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4180/");
  await expect(page.getByRole("navigation", { name: "Navigasi tanpa JavaScript" })).toBeVisible();
  const mark = page.locator("[data-footer-wordmark]");
  await mark.scrollIntoViewIfNeeded();
  await expect(mark.locator("svg text")).toHaveText("HCBTECH");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await context.close();
});
