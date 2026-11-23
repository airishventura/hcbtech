import { describe, expect, it, vi } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { products } from "../src/data/products";
import { parseCatalogRevision, type CatalogRevision } from "../src/lib/catalog-editing";
import { buildInquiryMessage } from "../src/lib/inquiry";
import { localizeProduct } from "../src/i18n/localize";

function fixture(): CatalogRevision {
  const pair = (value: string) => ({ id: value, en: `English: ${value}` });
  return { schemaVersion: 1, review: { by: "Test owner", date: "2026-11-23", source: "Owner review fixture" }, products: products.map(product => ({ id: product.id, name: pair(product.name), shortDescription: pair(product.shortDescription), description: pair(product.description), variants: product.variants.map(variant => ({ id: variant.id, label: pair(variant.label), note: pair(variant.note), priceIDR: variant.priceIDR, priceKind: variant.priceKind ?? "reference", availability: variant.availability })) })) };
}
describe("owner catalog revisions", () => {
  it("round-trips all three families and 14 stable variants with both languages", () => {
    const revision = fixture(); expect(parseCatalogRevision(JSON.parse(JSON.stringify(revision)))).toEqual(revision);
    expect(revision.products.flatMap(p => p.variants)).toHaveLength(14);
  });
  it.each(["duplicate", "missing", "unknown", "geometry", "negative", "fraction", "review", "date", "translation", "confirmed-null"])("rejects %s revisions", fault => {
    const revision = fixture();
    if (fault === "duplicate") revision.products[0].variants[1].id = "PRICE-01";
    if (fault === "missing") revision.products.pop();
    if (fault === "unknown") revision.products[0].id = "REF-01";
    if (fault === "geometry") Object.assign(revision.products[0], { modelAccuracy: "geometry-verified" });
    if (fault === "negative") revision.products[0].variants[0].priceIDR = -1;
    if (fault === "fraction") revision.products[0].variants[0].priceIDR = 1.5;
    if (fault === "review") revision.review.source = "";
    if (fault === "date") revision.review.date = "2026-02-30";
    if (fault === "translation") revision.products[0].name.en = "";
    if (fault === "confirmed-null") Object.assign(revision.products[0].variants[0], { priceKind: "confirmed", priceIDR: null });
    expect(() => parseCatalogRevision(revision)).toThrow();
  });
  it("preserves reviewed English copy and confirmed prices in inquiry context", () => {
    const revision = fixture(); const base = products[0]; const edit = revision.products[0];
    const product = { ...base, contentRevision: edit };
    expect(localizeProduct(product, value => value, "en").name).toBe(edit.name.en);
    const message = buildInquiryMessage({ product, variant: { ...base.variants[0], priceKind: "confirmed", priceIDR: 4500000 }, language: "en" });
    expect(message).toContain("Owner-confirmed price"); expect(message).toContain("4.500.000"); expect(message).toContain("PRICE-01");
    expect(base.modelAccuracy).toBe("approximation");
  });
  it("applies a reviewed revision to the buyer data while preserving IDs, photos and model scope", async () => {
    const revision = fixture();
    revision.products[0].name = { id: "Parut pemilik", en: "Owner grater" };
    revision.products[0].variants[0].priceIDR = 4500000;
    revision.products[0].variants[0].priceKind = "confirmed";
    vi.doMock("../assets/catalog-content.json", () => ({ default: revision }));
    vi.resetModules();
    try {
      const updated = await import("../src/data/products");
      const product = updated.getProduct("parut-kelapa")!;
      expect(product.name).toBe("Parut pemilik");
      expect(product.variants[0].priceIDR).toBe(4500000);
      expect(localizeProduct(product, value => value, "en").name).toBe("Owner grater");
      expect(product.priceSource?.url).toBe("/docs/catalog-update.json");
      expect(product.gallery).toEqual(products[0].gallery);
      expect(product.modelGLB).toBe(products[0].modelGLB);
      expect(product.specifications).toEqual(products[0].specifications);
      expect(product.variants.map(v => v.id)).toEqual(products[0].variants.map(v => v.id));
    } finally { vi.doUnmock("../assets/catalog-content.json"); vi.resetModules(); }
  });
  it("checks without writes and applies only the two catalog content files", () => {
    const root = mkdtempSync(join(tmpdir(), "hcb-catalog-"));
    try {
      for (const path of ["scripts", "src/lib", "assets", "public/docs"]) mkdirSync(join(root, path), { recursive: true });
      cpSync("scripts/import-catalog.mjs", join(root, "scripts/import-catalog.mjs")); cpSync("src/lib/catalog-editing.ts", join(root, "src/lib/catalog-editing.ts"));
      writeFileSync(join(root, "package.json"), '{"type":"module"}');
      const initial = '{"products":[]}'; writeFileSync(join(root, "assets/catalog-content.json"), initial);
      writeFileSync(join(root, "revision.json"), JSON.stringify(fixture()));
      const args = ["--experimental-strip-types", "scripts/import-catalog.mjs", "revision.json"];
      execFileSync(process.execPath, [...args, "--check"], { cwd: root });
      expect(readFileSync(join(root, "assets/catalog-content.json"), "utf8")).toBe(initial);
      execFileSync(process.execPath, [...args, "--apply"], { cwd: root });
      const saved = readFileSync(join(root, "assets/catalog-content.json"), "utf8");
      expect(parseCatalogRevision(JSON.parse(saved))).toEqual(fixture());
      expect(readFileSync(join(root, "public/docs/catalog-update.json"), "utf8")).toBe(saved);
      writeFileSync(join(root, "revision.json"), '{"schemaVersion":9}');
      expect(spawnSync(process.execPath, [...args, "--apply"], { cwd: root }).status).toBe(1);
      expect(readFileSync(join(root, "assets/catalog-content.json"), "utf8")).toBe(saved);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
