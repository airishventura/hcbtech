import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const { paths, variantPages } = JSON.parse(readFileSync("dist/route-manifest.json", "utf8")) as { paths: string[]; variantPages: { path: string; variant: string }[] };

test("all server HTML pages have distinct metadata, visible content and safe schemas", async ({ request }) => {
  for (const language of ["id", "en"]) for (const path of paths) {
    const response = await request.get(path + (language === "en" ? "?lang=en" : ""));
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<html lang="${language}">`);
    expect(html).toContain('data-prerendered="true"');
    expect(html).toMatch(/<h1[^>]*>[\s\S]+?<\/h1>/);
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/hcbtech.vercel.app/);
    const schema = JSON.parse(html.match(/<script id="page-jsonld"[^>]*>([\s\S]*?)<\/script>/)![1]);
    expect(schema.url).toContain(path);
    expect(schema.offers).toBeUndefined();
    if (path.includes("/mesin/") && !path.includes("parut-kelapa") && !path.includes("kupas-batok-kelapa") && !path.includes("peras-santan")) expect(html).toContain('content="noindex,follow"');
  }
});

test("all 14 shared variants retain the selected configuration in server HTML", async ({ request }) => {
  for (const { path, variant } of variantPages) for (const language of ["id", "en"]) {
    const response = await request.get(`${path}?varian=${variant}&lang=${language}`);
    const html = await response.text();
    const input = html.match(new RegExp(`<input[^>]*value="${variant}"[^>]*>`))![0];
    expect(input).toContain('checked=""');
    expect(html).toContain(`varian%3D${variant}`);
    expect(html).toContain('data-testid="variant-price"');
  }
});

test("unknown paths return real localized HTTP 404 responses", async ({ request }) => {
  for (const query of ["", "?lang=en"]) {
    const response = await request.get("/unknown-machine" + query);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('content="noindex,follow"');
  }
  expect((await request.get("/images/missing.webp")).status()).toBe(404);
});

test("catalog and selected product work with JavaScript disabled", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL + "/mesin?lang=en");
  await expect(page.locator("[data-product]")).toHaveCount(3);
  for (const card of await page.locator("[data-product]").all()) await expect(card).toBeVisible();
  await page.goto(baseURL + "/mesin/peras-santan?lang=en&varian=PRICE-13");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Coconut Milk Press");
  await expect(page.getByTestId("variant-price")).toContainText("14.000.000");
  await expect(page.getByRole("link", { name: "Back to catalog", exact: true })).toHaveAttribute("href", "/mesin?lang=en");
  await page.getByRole("link", { name: /A33 \/ Honda GP200 —/ }).click();
  await expect(page.getByTestId("variant-price")).toContainText("16.000.000");
  await context.close();
});

test("photo lightbox contains focus, supports arrows, closes and restores focus", async ({ page }) => {
  await page.goto("/mesin/parut-kelapa?lang=en");
  await page.getByRole("button", { name: "Enlarge photo" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close photo" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Next photo" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).toContainText("2 / 3");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Enlarge photo" })).toBeFocused();
});

test("Framer family index supports keyboard selection and same-tab navigation", async ({ page }) => {
  await page.goto("/?lang=en");
  const section = page.getByTestId("family-index");
  const preview = section.getByRole("button", { name: "Preview Coconut Milk Press" });
  await preview.focus();
  await expect(preview).toHaveAttribute("aria-pressed", "true");
  const link = section.getByRole("link", { name: "View details Coconut Milk Press" });
  await expect(link).not.toHaveAttribute("target", "_blank");
  await link.click();
  await expect(page).toHaveURL(/peras-santan\?lang=en/);
});

test("English, 3D engine and lightbox stay out of the initial Indonesian network load", async ({ page }) => {
  const urls: string[] = [];
  page.on("request", request => urls.push(request.url()));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(urls.some(url => /english-|MachineViewer-|PhotoLightbox-/.test(url))).toBe(false);
  expect(urls.some(url => /fonts\.googleapis|fonts\.gstatic/.test(url))).toBe(false);
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(urls.some(url => /english-/.test(url))).toBe(true);
});
