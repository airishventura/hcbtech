import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
const priceSheet = JSON.parse(readFileSync(new URL("../../assets/pricelist.json", import.meta.url), "utf8")) as { variants: { id: string; model: string; driveLabel: string | null; catalogProductId: string; listedPriceIDR: number }[] };

const families = [
  { id: "HCB-PARUT", slug: "parut-kelapa" },
  { id: "HCB-KUPAS", slug: "kupas-batok-kelapa" },
  { id: "HCB-PERAS", slug: "peras-santan" },
];

test("all 14 variants display their source prices and survive a shared link", async ({ page }) => {
  for (const family of families) {
    await page.goto(`/mesin/${family.slug}`);
    for (const row of priceSheet.variants.filter(item => item.catalogProductId === family.id)) {
      await page.locator(`input[type="radio"][value="${row.id}"]`).locator("..").click();
      await expect(page.getByTestId("variant-price")).toContainText(row.listedPriceIDR.toLocaleString("id-ID"));
      await expect(page).toHaveURL(new RegExp(`varian=${row.id}`));
      await expect(page.getByRole("link", { name: /Minta penawaran konfigurasi ini/ })).toHaveAttribute("href", new RegExp(`varian=${row.id}`));
    }
  }
  await page.goto("/mesin/peras-santan?varian=PRICE-13");
  await expect(page.getByTestId("variant-price")).toContainText("14.000.000");
  await expect(page.getByRole("radio", { name: /A22 \/ Honda GP160/ })).toBeChecked();
  const schema = JSON.parse(await page.locator("#page-jsonld").textContent() ?? "{}");
  expect(schema.offers).toBeUndefined();
});

test("blank drive remains unspecified and milk press retains original photos and its price source", async ({ page }) => {
  await page.goto("/mesin/kupas-batok-kelapa?varian=PRICE-06");
  await expect(page.getByText("Penggerak tidak dicantumkan pada daftar harga. Konfirmasikan konfigurasi dan cakupan unit.")).toBeVisible();
  await page.goto("/mesin/peras-santan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mesin Peras Santan");
  await expect(page.getByRole("tab", { name: "Foto asli", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "3D referensi", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lihat daftar sumber" })).toHaveAttribute("href", "/docs/daftar-harga.jpeg");
});

for (const slug of ["parut-kelapa", "kupas-batok-kelapa", "peras-santan"]) {
  test(`${slug} loads its separate GLB only when the reference tab opens`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    const modelRequests: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (request.url().endsWith(".glb")) modelRequests.push(request.url()); });
    await page.goto(`/mesin/${slug}`);
    await expect(page.getByRole("tab", { name: "Foto asli", exact: true })).toBeVisible();
    expect(modelRequests).toHaveLength(0);
    const loaded = page.waitForResponse(response => response.url().endsWith(".glb"));
    await page.getByRole("tab", { name: "3D referensi", exact: true }).click();
    expect((await loaded).status()).toBe(200);
    await expect(page.locator("canvas")).toBeVisible();
    if (testInfo.project.name === "android") {
      const bounds = await page.locator("canvas").boundingBox();
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    }
    await expect(page.getByText(/Bukan model khusus semua varian/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Pisahkan komponen" })).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test("English family pages translate model scope, variant prices and source labels", async ({ page }) => {
  await page.goto("/mesin/kupas-batok-kelapa?lang=en&varian=PRICE-10");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Coconut Shell Peeler");
  await expect(page.getByRole("radio", { name: /Standing \/ Petrol/ })).toBeChecked();
  await expect(page.getByTestId("variant-price")).toContainText("8.500.000");
  await page.getByRole("tab", { name: "3D reference", exact: true }).click();
  await expect(page.getByText(/It does not represent every variant and has no measured dimensions/)).toBeVisible();
  await expect(page.getByRole("link", { name: "View the source price list" })).toBeVisible();
});
