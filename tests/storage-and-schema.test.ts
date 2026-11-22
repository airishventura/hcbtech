import { beforeEach, describe, expect, it, vi } from "vitest";
import { legacyProducts as products } from "../src/data/legacy-products";
import { createProductSchema } from "../src/lib/seo";
import { isRecord, isStringArray, readStored, removeStored, writeStored } from "../src/lib/storage";

describe("penyimpanan lokal yang tangguh", () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it("membaca dan menulis data valid", () => {
    expect(writeStored("compare", ["REF-D01"])).toBe(true);
    expect(readStored("compare", [], isStringArray)).toEqual(["REF-D01"]);
  });

  it("menolak JSON rusak dan bentuk data yang tidak sesuai", () => {
    localStorage.setItem("broken", "not-json");
    expect(readStored("broken", [], isStringArray)).toEqual([]);
    localStorage.setItem("wrong-shape", JSON.stringify({ length: 2 }));
    expect(readStored("wrong-shape", [], isStringArray)).toEqual([]);
    expect(readStored("wrong-shape", {}, isRecord)).toEqual({ length: 2 });
  });

  it("tidak melempar error ketika browser memblokir penulisan", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    expect(writeStored("compare", ["REF-D01"])).toBe(false);
  });

  it("tidak melempar error ketika pembacaan atau penghapusan diblokir", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    expect(readStored("compare", ["fallback"], isStringArray)).toEqual(["fallback"]);
    expect(removeStored("compare")).toBe(false);
  });
});

describe("media Product JSON-LD", () => {
  it("hanya memasukkan original-photo sebagai image", () => {
    const product = {
      ...products[0],
      gallery: [
        { src: "/images/unit-asli.webp", alt: "Foto unit aktual", kind: "original-photo" as const, caption: "Foto pemilik" },
        ...products[0].gallery.filter((image) => image.kind === "visualization"),
      ],
    };
    const schema = createProductSchema(product, "https://bisnis.test", "https://bisnis.test/mesin/unit") as Record<string, unknown>;
    expect(schema.image).toEqual(["https://bisnis.test/images/unit-asli.webp"]);
  });
});
