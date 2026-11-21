import { expect, test } from "@playwright/test";

test("filter kategori, penggerak, null-price, pencarian, dan reset bekerja", async ({ page }, testInfo) => {
  await page.goto("/mesin");
  if (testInfo.project.name === "android") await page.getByRole("button", { name: /Filter/ }).click();
  const prefix = testInfo.project.name === "android" ? "mobile" : "desktop";
  const duplicateIds = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll("[id]"), (element) => element.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicateIds).toEqual([]);
  await expect(page.locator("article[data-product]")).toHaveCount(6);
  await page.selectOption(`#${prefix}-category`, "piringan-gearbox");
  await expect(page.locator("article[data-product]")).toHaveCount(3);
  await page.selectOption(`#${prefix}-drive`, "engine");
  await expect(page.locator("article[data-product]")).toHaveCount(1);
  await page.selectOption(`#${prefix}-price`, "verified");
  await expect(page.getByText("Tidak ada referensi yang cocok.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filter" }).click();
  await page.getByLabel("Cari mesin, kode referensi, atau kategori").fill("REF-S03");
  await expect(page.locator("article[data-product]")).toHaveCount(1);
});

test("detail menampilkan null price, varian, model aproksimasi, dan JSON-LD tanpa Offer", async ({ page }) => {
  await page.goto("/mesin/piringan-gearbox-meja-listrik");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Unit Piringan");
  await expect(page.getByText("Minta Penawaran", { exact: true }).first()).toBeVisible();
  await page.getByText("Engine bensin", { exact: true }).click();
  await expect(page.getByText("Tipe engine dan kesesuaian konfigurasi menunggu konfirmasi.")).toBeVisible();
  const schemaText = await page.locator("#page-jsonld").textContent();
  expect(schemaText).not.toContain('"offers"');
  expect(schemaText).toContain('"@type":"Product"');
  await page.getByRole("tab", { name: "Lihat 3D" }).click();
  await expect(page.getByText(/Aproksimasi 3D/i)).toBeVisible();
  await page.getByRole("button", { name: "Pisahkan komponen" }).click();
  await expect(page.getByText(/Exploded skematik/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Sembunyikan anotasi" })).toBeDisabled();
  await page.getByRole("button", { name: "Satukan kembali komponen" }).click();
});

test("tanpa WebGL, poster dan pesan fallback tetap tersedia", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type: string, ...args: any[]) {
      if (type.includes("webgl")) return null;
      return original.call(this, type, ...args);
    } as typeof original;
  });
  await page.goto("/mesin/drum-tertutup-stainless-listrik");
  await page.getByRole("tab", { name: "Lihat 3D" }).click();
  await expect(page.getByText("3D tidak dapat ditampilkan")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Spesifikasi", exact: true })).toBeVisible();
});

test("inquiry tanpa nomor berpindah ke kontak dan membuat draf nyata", async ({ page }) => {
  await page.goto("/mesin/drum-tertutup-stainless-engine");
  await page.getByRole("link", { name: /Minta penawaran konfigurasi ini/i }).click();
  await expect(page).toHaveURL(/\/kontak\?produk=/);
  await page.getByLabel("Nama *").fill("Budi");
  await page.getByLabel("Kota pemasangan").fill("Bandung");
  await page.getByLabel("Kebutuhan kerja").fill("Mohon foto unit aktual.");
  await page.getByRole("button", { name: "Buat draf permintaan" }).click();
  await expect(page.locator("#generated-message")).toHaveValue(/Budi/);
  await expect(page.locator("#generated-message")).toHaveValue(/Bandung/);
  await expect(page.getByRole("button", { name: "Unduh .txt" })).toBeVisible();
});

test("halaman mobile tidak memiliki overflow horizontal", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "android", "khusus proyek mobile");
  await page.goto("/mesin/piringan-gearbox-meja-engine");
  const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  await expect(page.getByRole("tab", { name: "Foto & visualisasi" })).toBeVisible();
});
