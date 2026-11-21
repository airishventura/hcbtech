import { expect, test } from "@playwright/test";

test("toggle English mengubah konten, URL, metadata, 3D, dan inquiry lalu bertahan", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/\?lang=en/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Machines built");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\?lang=en$/);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\?lang=en$/);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", /^[^?]+$/);

  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/\?lang=en/);
  await page.goto("/mesin/piringan-gearbox-meja-listrik?lang=en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Disc + Gearbox Unit / Table");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
  const schema = JSON.parse(await page.locator("#page-jsonld").textContent() ?? "{}");
  expect(schema.name).toContain("draft model name");
  await page.getByRole("tab", { name: "View 3D" }).click();
  await expect(page.getByRole("button", { name: "Separate components" })).toBeVisible();

  await page.goto("/kontak?lang=en");
  await page.getByLabel("Name *").fill("Budi");
  await page.getByRole("button", { name: /Actual unit photos/ }).click();
  await page.getByRole("button", { name: "Create request draft" }).click();
  await expect(page.locator("#generated-message")).toHaveValue(/Hello HCBTECH/);
  await expect(page.locator("#generated-message")).toHaveValue(/My requirements/);
  await page.getByRole("button", { name: "Ganti ke Bahasa Indonesia" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});
