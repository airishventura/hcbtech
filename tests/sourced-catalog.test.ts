import { readFileSync } from "node:fs";
import { describe, expect, it, vi, afterEach } from "vitest";
import priceSheet from "../assets/pricelist.json";
import { products, getPriceRange } from "../src/data/products";
import { buildWhatsAppUrl } from "../src/lib/inquiry";
import { createProductSchema } from "../src/lib/seo";

const variants = products.flatMap(product => product.variants);
afterEach(() => vi.unstubAllEnvs());

describe("sourced family catalog", () => {
  it("publishes all price-sheet rows once, with exact prices and source IDs", () => {
    expect(products).toHaveLength(3);
    expect(variants).toHaveLength(priceSheet.variants.length);
    expect(new Set(variants.map(item => item.id)).size).toBe(14);
    for (const row of priceSheet.variants) {
      const product = products.find(item => item.id === row.catalogProductId)!;
      const variant = product.variants.find(item => item.id === row.id)!;
      expect(variant.priceIDR).toBe(row.listedPriceIDR);
      expect(variant.priceKind).toBe("reference");
      expect(variant.priceSourceId).toBe(row.id);
    }
    expect(getPriceRange(products[0])).toEqual({ min: 4000000, max: 13500000 });
  });
  it("keeps missing drive details, dimensions, exact photo matches and stock unknown", () => {
    for (const id of ["PRICE-05", "PRICE-06", "PRICE-11"]) expect(variants.find(item => item.id === id)?.drive).toBe("unconfirmed");
    for (const product of products) {
      expect(product.dimensions).toBeNull();
      expect(product.capacity).toBeNull();
      expect(product.sku).toBeNull();
      expect(product.availability).toBe("unconfirmed");
      expect(product.variants.every(item => item.availability === "unconfirmed")).toBe(true);
      expect(product.gallery.every(item => item.kind === "original-photo")).toBe(true);
    }
    expect(priceSheet.variants.every(item => item.photoIds.length === 0)).toBe(true);
  });
  it("carries the chosen price-list variant into a shareable WhatsApp request", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "6285315527000");
    const product = products[2], variant = product.variants.find(item => item.id === "PRICE-13")!;
    const url = new URL(buildWhatsAppUrl({ product, variant })!);
    expect(url.pathname).toBe("/6285315527000");
    const message = url.searchParams.get("text")!;
    expect(message).toContain("A22 / Honda GP160");
    expect(message).toContain("PRICE-13");
    expect(message).toContain("14.000.000");
    expect(message).toContain("varian=PRICE-13");
    expect(message).toContain("mohon konfirmasi");
  });
  it("does not publish stock offers from reference prices", () => {
    for (const product of products) {
      const schema = createProductSchema(product, "https://hcbtech.test", `https://hcbtech.test/mesin/${product.slug}`);
      expect(schema).not.toHaveProperty("offers");
      expect(schema.name).not.toContain("nama sementara");
    }
  });
  it("ships three valid, small GLB pilots with explicit unmeasured provenance", () => {
    const pilots = JSON.parse(readFileSync("models/pilots.json", "utf8"));
    expect(pilots).toHaveLength(3);
    for (const pilot of pilots) {
      const bytes = readFileSync(`public${pilot.path}`);
      expect(bytes.toString("utf8", 0, 4)).toBe("glTF");
      expect(bytes.readUInt32LE(4)).toBe(2);
      expect(bytes.readUInt32LE(8)).toBe(bytes.length);
      expect(bytes.length).toBeLessThan(300000);
      const json = JSON.parse(bytes.toString("utf8", 20, 20 + bytes.readUInt32LE(12)).trim());
      expect(json.scenes[0].extras.scaleStatus).toBe("unmeasured");
      expect(pilot.measuredDimensions).toBeNull();
      expect(pilot.variantIds).toEqual([]);
    }
  });
});
