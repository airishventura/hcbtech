import { afterEach, describe, expect, it, vi } from "vitest";
import { legacyProducts as products } from "../src/data/legacy-products";
import { buildWhatsAppUrl, formatWhatsAppNumber, getWhatsAppNumber } from "../src/lib/inquiry";
import { createBreadcrumbSchema, createFaqSchema, createOrganizationSchema, createProductSchema } from "../src/lib/seo";

afterEach(() => { vi.unstubAllEnvs(); });

describe("WhatsApp bisnis", () => {
  it("menormalisasi format lokal, +62, dan angka internasional", () => {
    for (const input of ["0853-1552-7000", "+62 853-1552-7000", "6285315527000"]) {
      vi.stubEnv("VITE_WHATSAPP_NUMBER", input);
      expect(getWhatsAppNumber()).toBe("6285315527000");
    }
    expect(formatWhatsAppNumber("6285315527000")).toBe("+62 853-1552-7000");
  });

  it("membuat URL wa.me dengan produk, varian, dan pesan yang dapat dibaca", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "0853-1552-7000");
    const product = products[0];
    const url = buildWhatsAppUrl({ product, variant: product.variants[0], message: "Mohon foto aktual" });
    expect(url).toMatch(/^https:\/\/wa\.me\/6285315527000\?text=/);
    const decoded = decodeURIComponent(url ?? "");
    expect(decoded).toContain(product.id);
    expect(decoded).toContain(product.variants[0].label);
    expect(decoded).toContain("Mohon foto aktual");
  });

  it("menolak nomor tidak valid tanpa membuat URL palsu", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "1234");
    expect(getWhatsAppNumber()).toBeNull();
    expect(buildWhatsAppUrl({ message: "Halo" })).toBeNull();
  });
});

describe("SEO dan AEO terstruktur", () => {
  it("Organization hanya memakai nomor dan kanal sosial faktual", () => {
    const schema = createOrganizationSchema("https://bisnis.test", "6285315527000") as Record<string, any>;
    expect(schema.contactPoint.telephone).toBe("+6285315527000");
    expect(schema.sameAs).toHaveLength(2);
    expect(schema.address).toBeUndefined();
    expect(schema.areaServed).toBeUndefined();
  });

  it("FAQPage hanya berisi pertanyaan dan jawaban yang diberikan", () => {
    const schema = createFaqSchema([{ question: "Berapa harga?", answer: "Minta Penawaran." }]) as Record<string, any>;
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("Minta Penawaran.");
  });

  it("Breadcrumb produk memiliki tiga URL yang sesuai", () => {
    const product = products[0];
    const schema = createBreadcrumbSchema(product, "https://bisnis.test") as Record<string, any>;
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[2].item).toBe(`https://bisnis.test/mesin/${product.slug}`);
  });

  it("additionalProperty hanya memuat spesifikasi verified", () => {
    const product = {
      ...products[0],
      specifications: products[0].specifications.map((spec, index) => index === 0 ? { ...spec, status: "verified" as const } : spec),
    };
    const schema = createProductSchema(product, "https://bisnis.test", "https://bisnis.test/mesin/unit") as Record<string, any>;
    expect(schema.additionalProperty).toHaveLength(1);
    expect(schema.additionalProperty[0].name).toBe("Penggerak pada referensi");
    expect(schema.offers).toBeUndefined();
  });
});
