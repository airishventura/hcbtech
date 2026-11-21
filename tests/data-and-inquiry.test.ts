import { describe, expect, it } from "vitest";
import { products } from "../src/data/products";
import { buildContactFallback, buildInquiryMessage, displaySpec, formatIDR } from "../src/lib/inquiry";
import { createProductSchema } from "../src/lib/seo";

describe("repositori produk", () => {
  it("memiliki id dan slug unik", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });
  it("tidak mengarang harga, SKU, kapasitas, dimensi, GLB, atau video", () => {
    for (const product of products) {
      expect(product.priceIDR).toBeNull();
      expect(product.sku).toBeNull();
      expect(product.capacity).toBeNull();
      expect(product.dimensions).toBeNull();
      expect(product.modelGLB).toBeNull();
      expect(product.demonstrationVideo).toBeNull();
      expect(product.quotationOnly).toBe(true);
      expect(product.nameStatus).toBe("draft");
    }
  });
  it("memiliki aset poster, deskripsi indexable, dan varian nyata", () => {
    for (const product of products) {
      expect(product.posterImage).toMatch(/^\/images\//);
      expect(product.description.length).toBeGreaterThan(100);
      expect(product.variants.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("perilaku nilai kosong dan inquiry", () => {
  it("menampilkan CTA yang benar untuk null price", () => {
    expect(formatIDR(null)).toBe("Minta Penawaran");
    expect(displaySpec(null)).toBe("Konfirmasi spesifikasi");
    expect(displaySpec("Motor listrik")).toBe("Motor listrik");
  });
  it("memformat IDR hanya ketika angka tersedia", () => {
    expect(formatIDR(12500000)).toContain("12.500.000");
  });
  it("membawa produk, varian, nama, kota, dan pesan pengguna", () => {
    const product = products[0];
    const variant = product.variants[1];
    const text = buildInquiryMessage({ product, variant, name: "Budi", city: "Bandung", message: "Untuk bahan uji saya" });
    expect(text).toContain(product.id);
    expect(text).toContain(variant.label);
    expect(text).toContain("Budi");
    expect(text).toContain("Bandung");
    expect(text).toContain("Untuk bahan uji saya");
  });
  it("menyediakan route kontak ketika WhatsApp tidak dikonfigurasi", () => {
    const product = products[0];
    const url = buildContactFallback({ product, variant: product.variants[0], message: "Perlu detail" });
    expect(url).toContain("/kontak?");
    expect(url).toContain(`produk=${product.slug}`);
    expect(url).not.toContain("wa.me");
  });
});

describe("Product JSON-LD", () => {
  it("tidak membuat Offer untuk harga dan ketersediaan yang belum faktual", () => {
    const schema = createProductSchema(products[0], "https://bisnis.test", "https://bisnis.test/mesin/unit") as Record<string, unknown>;
    expect(schema.offers).toBeUndefined();
    expect(schema.sku).toBeUndefined();
    expect(schema.name).toContain("nama sementara");
    expect(schema.image).toEqual([`https://bisnis.test${products[0].gallery[0].src}`]);
  });
  it("membuat Offer hanya setelah harga dan availability faktual tersedia", () => {
    const product = { ...products[0], priceIDR: 10000000, availability: "available" as const, sku: "SKU-FINAL" };
    const schema = createProductSchema(product, "https://bisnis.test", "https://bisnis.test/mesin/unit") as Record<string, any>;
    expect(schema.offers.price).toBe(10000000);
    expect(schema.offers.priceCurrency).toBe("IDR");
    expect(schema.offers.availability).toBe("https://schema.org/InStock");
    expect(schema.sku).toBe("SKU-FINAL");
  });
});
