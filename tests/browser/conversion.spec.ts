import { expect, test } from "@playwright/test";

test("panduan tiga langkah dapat dikoreksi dan membawa pilihan ke kontak", async ({ page }) => {
  await page.goto("/");
  const guide = page.getByRole("region", { name: "Panduan kebutuhan tiga langkah" });
  await guide.getByText("Kupas batok", { exact: true }).click();
  await guide.getByRole("button", { name: "Lanjut", exact: true }).click();
  await guide.getByRole("button", { name: "Kembali", exact: true }).click();
  await expect(guide.getByRole("radio", { name: /Kupas batok/ })).toBeChecked();
  await guide.getByRole("button", { name: "Lanjut", exact: true }).click();
  await guide.getByText("Motor listrik", { exact: true }).click();
  await guide.getByRole("button", { name: "Lanjut", exact: true }).click();
  await guide.getByText("Harga & cakupan", { exact: true }).click();
  await guide.getByRole("button", { name: "Lihat ringkasan" }).click();
  await expect(guide.getByRole("heading", { name: "Mesin Kupas Batok Kelapa" })).toBeVisible();
  await guide.getByRole("link", { name: "Lanjut ke formulir kontak" }).click();
  await expect(page).toHaveURL(/\/kontak\?produk=kupas-batok-kelapa/);
  await expect(page.getByLabel("Kebutuhan kerja")).toHaveValue(/panduan kebutuhan/);
});

test("pertanyaan cepat mengisi pesan tanpa mengirim otomatis", async ({ page }) => {
  await page.goto("/kontak");
  await page.getByRole("button", { name: /Foto unit aktual/ }).click();
  await expect(page.getByLabel("Kebutuhan kerja")).toHaveValue(/Mohon foto unit aktual dari beberapa sisi/);
  await page.getByLabel("Nama *").fill("Budi");
  await page.getByRole("button", { name: "Buat draf permintaan" }).click();
  await expect(page).toHaveURL(/\/kontak$/);
  await expect(page.locator("#generated-message")).toHaveValue(/Mohon foto unit aktual/);
  await expect(page.getByText("Belum terkirim otomatis")).toBeVisible();
});

test("produk memiliki BreadcrumbList dan FAQPage yang sesuai konten", async ({ page }) => {
  await page.goto("/mesin/piringan-gearbox-meja-listrik");
  const supplemental = JSON.parse(await page.locator("#supplemental-jsonld").textContent() ?? "{}");
  const types = supplemental["@graph"].map((item: { "@type": string }) => item["@type"]);
  expect(types).toEqual(["BreadcrumbList", "FAQPage"]);
  expect(supplemental["@graph"][1].mainEntity).toHaveLength(2);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Foto asli/);
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", /Nama model sementara/);
});
