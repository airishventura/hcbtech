import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

test("owner draft persists locally and never changes the buyer catalog", async ({ page }) => {
  await page.goto("/kelola-katalog");
  await expect(page.getByRole("button", { name: "Ekspor revisi JSON" })).toBeEnabled();
  const name = page.getByRole("group", { name: "Nama mesin", exact: true }).getByRole("textbox", { name: "Bahasa Indonesia" });
  await name.fill("Parut — draf pemilik");
  await page.locator("#PRICE-01-price").fill("4700000");
  await page.reload();
  await expect(name).toHaveValue("Parut — draf pemilik");
  await expect(page.locator("#PRICE-01-price")).toHaveValue("4700000");
  await page.goto("/mesin/parut-kelapa?varian=PRICE-01");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mesin Parut Kelapa");
  await expect(page.getByTestId("variant-price")).toContainText("4.000.000");
});

test("owner exports a reviewed revision, reimports it, and rejects malformed files", async ({ page }) => {
  await page.goto("/kelola-katalog?lang=en");
  const download = page.getByRole("button", { name: "Export JSON revision" });
  await download.click(); await expect(page.getByRole("alert")).toContainText("Review the data");
  await page.getByLabel("Public review attribution").fill("HCBTECH test");
  await page.getByLabel("Review date").fill("2026-11-23");
  await page.getByLabel("Public confirmation source").fill("Owner test; do not publish");
  await page.getByRole("checkbox").check();
  const filePromise = page.waitForEvent("download"); await download.click(); const file = await filePromise;
  const revision = JSON.parse(readFileSync((await file.path())!, "utf8"));
  expect(revision.products).toHaveLength(3); expect(revision.products.flatMap((p: { variants: unknown[] }) => p.variants)).toHaveLength(14);
  await expect(page.getByRole("status")).toContainText("live catalog has not changed");
  const input = page.getByLabel("Import JSON revision");
  await input.setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from('{"schemaVersion":9}') });
  await expect(page.getByRole("alert")).toContainText("Invalid catalog revision");
  await input.setInputFiles({ name: "good.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(revision)) });
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await expect(page.getByRole("status")).toContainText("loaded for review");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
});

test("social CTA text retains a readable foreground on dark surfaces", async ({ page }, testInfo) => {
  await page.goto("/bengkel");
  const facebook = page.locator('a.social-card[href*="facebook.com"]');
  await facebook.scrollIntoViewIfNeeded();
  await expect(facebook).toHaveCSS("color", "rgb(242, 240, 235)");
  await expect(facebook.getByRole("heading")).toHaveCSS("color", "rgb(255, 255, 255)");
  const documentation = page.getByRole("link", { name: "Siapkan permintaan dokumentasi" });
  if (testInfo.project.name === "desktop") {
    await documentation.hover();
    await expect(documentation).toHaveCSS("color", "rgb(242, 240, 235)");
  }
  await page.goto("/");
  const whatsapp = page.locator('a.fixed[href*="wa.me"]');
  if (await whatsapp.count()) await expect(whatsapp).toHaveCSS("color", "rgb(242, 240, 235)");
  await page.goto("/kontak");
  await expect(page.getByLabel("Nama *")).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
