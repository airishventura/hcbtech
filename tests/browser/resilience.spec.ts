import { expect, test } from "@playwright/test";

test("pengurutan nama mengubah urutan produk berbasis data", async ({ page }, testInfo) => {
  await page.goto("/mesin");
  const sortId = testInfo.project.name === "android" ? "#sort-mobile" : "#sort";
  if (testInfo.project.name === "android") await page.getByRole("button", { name: /Filter/ }).click();
  await page.selectOption(sortId, "name");
  await expect(page.locator("article[data-product]").first()).toHaveAttribute("data-product", "drum-tertutup-transmisi-belt-samping");
});

test("dua produk dapat dibandingkan dan dialog dapat ditutup dengan Escape", async ({ page }) => {
  await page.goto("/mesin");
  const first = page.locator('article[data-product="piringan-gearbox-meja-listrik"]');
  const second = page.locator('article[data-product="drum-tertutup-stainless-listrik"]');
  await first.getByRole("button", { name: /Tambah .* perbandingan/ }).click();
  await second.getByRole("button", { name: /Tambah .* perbandingan/ }).click();
  await page.getByRole("button", { name: "Bandingkan", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").locator("thead th")).toHaveCount(3);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("tab media mendukung Arrow, Home, dan End", async ({ page }) => {
  await page.goto("/mesin/piringan-gearbox-meja-listrik");
  const media = page.getByRole("tab", { name: "Foto & visualisasi" });
  await media.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Lihat 3D" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(media).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "Lihat 3D" })).toHaveAttribute("aria-selected", "true");
});

test("metadata canonical, OG, dan structured data produk tersedia tanpa WebGL", async ({ page }) => {
  await page.goto("/mesin/drum-tertutup-stainless-listrik");
  await expect(page).toHaveTitle(/Unit Drum Tertutup \/ Listrik — HCBTECH/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/mesin\/drum-tertutup-stainless-listrik$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /products\/photo-47/);
  const schema = JSON.parse(await page.locator("#page-jsonld").textContent() ?? "{}");
  expect(schema["@type"]).toBe("Product");
  expect(schema.offers).toBeUndefined();
  expect(schema.image).toEqual([expect.stringContaining("/images/products/photo-47.webp")]);
});

test("menu mobile dapat ditutup dengan Escape", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "android", "khusus proyek mobile");
  await page.goto("/");
  await page.getByRole("button", { name: "Buka menu navigasi" }).click();
  await expect(page.getByRole("button", { name: "Tutup menu navigasi" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Tutup menu navigasi" })).toBeHidden();
});

test("formulir tetap membuat draf ketika localStorage diblokir", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.setItem = function() { throw new DOMException("Storage blocked", "SecurityError"); };
  });
  await page.goto("/kontak");
  await expect(page.getByText(/Penyimpanan lokal diblokir browser/)).toBeVisible();
  await page.getByLabel("Nama *").fill("Budi");
  await page.getByRole("button", { name: "Buat draf permintaan" }).click();
  await expect(page.locator("#generated-message")).toHaveValue(/Budi/);
  expect(errors).toEqual([]);
});

test("mobile menu contains keyboard focus and restores it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "android", "mobile only");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Buka menu navigasi" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navigasi mobile" });
  await expect(dialog).toBeVisible();
  const first = dialog.getByRole("link", { name: "HCBTECH — beranda" });
  await first.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "TikTok" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("unknown routes are excluded from indexing", async ({ page }) => {
  await page.goto("/missing-machine");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
});

test("3D touch mode preserves scrolling until rotation is activated", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "android", "touch device only");
  await page.goto("/mesin/drum-tertutup-stainless-listrik");
  await page.getByRole("tab", { name: "Lihat 3D" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveCSS("touch-action", "pan-y");
  await page.getByRole("button", { name: "Aktifkan putar 3D" }).click();
  await expect(canvas).toHaveCSS("touch-action", "none");
  await page.getByRole("button", { name: "Kunci putar & lanjut scroll" }).click();
  await expect(canvas).toHaveCSS("touch-action", "pan-y");
});
