// Shared by the browser workbench and the Node import command. No browser APIs.
export const catalogIds: Record<string, string[]> = {
  "HCB-PARUT": ["PRICE-01", "PRICE-02", "PRICE-03", "PRICE-04", "PRICE-05"],
  "HCB-KUPAS": ["PRICE-06", "PRICE-07", "PRICE-08", "PRICE-09", "PRICE-10"],
  "HCB-PERAS": ["PRICE-11", "PRICE-12", "PRICE-13", "PRICE-14"],
};
export const stockValues = ["unconfirmed", "available", "made-to-order", "out-of-stock"] as const;
export interface CatalogText { id: string; en: string; }
export interface CatalogEditVariant {
  id: string; label: CatalogText; note: CatalogText; priceIDR: number | null;
  priceKind: "reference" | "confirmed"; availability: typeof stockValues[number];
}
export interface CatalogEditProduct {
  id: string; name: CatalogText; shortDescription: CatalogText; description: CatalogText;
  variants: CatalogEditVariant[];
}
export interface CatalogRevision {
  schemaVersion: 1; review: { by: string; date: string; source: string };
  products: CatalogEditProduct[];
}
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
function fail(message: string): never { throw new Error(message); }
function onlyKeys(value: Record<string, unknown>, keys: string[], path: string) {
  if (Object.keys(value).some(key => !keys.includes(key))) fail(`${path}: unexpected field / kolom tidak dikenal`);
}
function text(value: unknown, path: string, max: number, draft: boolean) {
  if (typeof value !== "string" || value.length > max || (!draft && !value.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) fail(`${path}: required text, max ${max} / teks wajib diisi`);
  return value as string;
}
function bilingual(value: unknown, path: string, max: number, draft: boolean): CatalogText {
  if (!record(value)) fail(`${path}: Indonesian and English text required / isi kedua bahasa`);
  onlyKeys(value, ["id", "en"], path);
  return { id: text(value.id, `${path}.id`, max, draft), en: text(value.en, `${path}.en`, max, draft) };
}
export function parseCatalogRevision(input: unknown, { draft = false } = {}): CatalogRevision {
  if (!record(input) || input.schemaVersion !== 1 || !Array.isArray(input.products) || !record(input.review)) fail("Invalid catalog revision / format revisi tidak valid");
  onlyKeys(input, ["schemaVersion", "review", "products"], "revision");
  const review = input.review;
  onlyKeys(review, ["by", "date", "source"], "review");
  const date = text(review.date, "review.date", 10, draft);
  if ((!draft || date) && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) fail("review.date: use YYYY-MM-DD / tanggal tidak valid");
  const parsedReview = { by: text(review.by, "review.by", 100, draft), date, source: text(review.source, "review.source", 1000, draft) };
  const seen = new Set<string>();
  const products = input.products.map((item, index): CatalogEditProduct => {
    if (!record(item) || typeof item.id !== "string" || !Object.prototype.hasOwnProperty.call(catalogIds, item.id) || seen.has(item.id)) fail(`products[${index}]: unknown or duplicate ID / ID tidak dikenal atau ganda`);
    seen.add(item.id);
    onlyKeys(item, ["id", "name", "shortDescription", "description", "variants"], item.id);
    if (!Array.isArray(item.variants)) fail(`${item.id}: variants required`);
    const expected = catalogIds[item.id]; const variantIds = new Set<string>();
    const variants = item.variants.map((variant): CatalogEditVariant => {
      if (!record(variant) || typeof variant.id !== "string" || !expected.includes(variant.id) || variantIds.has(variant.id)) fail(`${item.id}: unknown or duplicate variant / varian tidak dikenal atau ganda`);
      variantIds.add(variant.id);
      onlyKeys(variant, ["id", "label", "note", "priceIDR", "priceKind", "availability"], variant.id);
      if (variant.priceIDR !== null && (typeof variant.priceIDR !== "number" || !Number.isSafeInteger(variant.priceIDR) || variant.priceIDR <= 0 || variant.priceIDR > 1e12)) fail(`${variant.id}: price must be a positive integer or null / harga harus bilangan positif atau kosong`);
      if (variant.priceKind !== "reference" && variant.priceKind !== "confirmed") fail(`${variant.id}: invalid price status`);
      if (variant.priceKind === "confirmed" && variant.priceIDR === null) fail(`${variant.id}: confirmed price is missing / harga terkonfirmasi kosong`);
      if (!stockValues.includes(variant.availability as typeof stockValues[number])) fail(`${variant.id}: invalid availability / status stok tidak valid`);
      return { id: variant.id, label: bilingual(variant.label, `${variant.id}.label`, 120, draft), note: bilingual(variant.note, `${variant.id}.note`, 1000, draft), priceIDR: variant.priceIDR as number | null, priceKind: variant.priceKind, availability: variant.availability as typeof stockValues[number] };
    });
    if (variantIds.size !== expected.length) fail(`${item.id}: all ${expected.length} variants required / varian belum lengkap`);
    return { id: item.id, name: bilingual(item.name, `${item.id}.name`, 120, draft), shortDescription: bilingual(item.shortDescription, `${item.id}.shortDescription`, 350, draft), description: bilingual(item.description, `${item.id}.description`, 3000, draft), variants };
  });
  if (seen.size !== Object.keys(catalogIds).length) fail("All three machine families required / tiga keluarga mesin wajib lengkap");
  return { schemaVersion: 1, review: parsedReview, products };
}
