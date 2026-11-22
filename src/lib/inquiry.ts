import type { Product, ProductVariant } from "../data/products";

export const FACEBOOK_URL = "https://www.facebook.com/anto.nugraha.kedua/";
export const TIKTOK_URL = "https://www.tiktok.com/@mangatto_cees";

export function getWhatsAppNumber() {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER?.trim() ?? "";
  const digits = raw.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return /^[1-9]\d{8,14}$/.test(normalized) ? normalized : null;
}

export function formatWhatsAppNumber(number = getWhatsAppNumber()) {
  if (!number) return "";
  if (number.startsWith("62") && number.length === 13) {
    return `+62 ${number.slice(2, 5)}-${number.slice(5, 9)}-${number.slice(9)}`;
  }
  return `+${number}`;
}

export function formatIDR(value: number | null) {
  if (value === null) return "Minta Penawaran";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function displaySpec(value: string | null) {
  return value?.trim() || "Konfirmasi spesifikasi";
}

export function displayAvailability(availability: Product["availability"]) {
  const labels: Record<Product["availability"], string> = {
    unconfirmed: "Konfirmasi ketersediaan",
    available: "Tersedia",
    "made-to-order": "Dibuat berdasarkan pesanan",
    "out-of-stock": "Stok habis",
  };
  return labels[availability];
}

export function displayDrive(drive: Product["driveType"]) {
  if (drive === "listrik") return "Motor listrik";
  if (drive === "engine") return "Engine";
  return "Listrik / engine";
}

export interface InquiryInput {
  language?: "id" | "en";
  product?: Product;
  variant?: ProductVariant;
  name?: string;
  city?: string;
  message?: string;
}

export function buildInquiryMessage({ product, variant, name, city, message, language = "id" }: InquiryInput) {
  const english = language === "en";
  const query = new URLSearchParams();
  if (english) query.set("lang", "en");
  if (variant) query.set("varian", variant.id);
  const productPath = `/mesin/${product?.slug ?? ""}${query.size ? `?${query}` : ""}`;
  const lines = english ? [
    "Hello HCBTECH, I would like to request a quotation.",
    "",
    product ? `Product: ${product.name} (${product.id})` : "Requirement: Machinery / fabrication consultation",
    product ? `Page: ${typeof window === "undefined" ? productPath : `${window.location.origin}${productPath}`}` : "",
    variant ? `Preferred configuration: ${variant.label}` : "",
    variant ? `Configuration note: ${variant.note}` : "",
    variant?.priceKind === "reference" ? `Price-list reference: ${variant.priceSourceId}; ${formatIDR(variant.priceIDR)} (please reconfirm)` : "",
    name?.trim() ? `Name: ${name.trim()}` : "",
    city?.trim() ? `City: ${city.trim()}` : "",
    message?.trim() ? `My requirements: ${message.trim()}` : "My requirements: Please confirm specifications, unit scope, price, and availability.",
    "",
    product?.nameStatus === "confirmed" ? "Please confirm the final price, specifications, and availability before ordering." : "I understand that catalog model names and specifications still await HCBTECH confirmation.",
  ] : [
    "Halo HCBTECH, saya ingin meminta penawaran.",
    "",
    product ? `Produk: ${product.name} (${product.id})` : "Kebutuhan: Konsultasi mesin / fabrikasi",
    product ? `Halaman: ${typeof window === "undefined" ? productPath : `${window.location.origin}${productPath}`}` : "",
    variant ? `Konfigurasi yang diminati: ${variant.label}` : "",
    variant ? `Catatan konfigurasi: ${variant.note}` : "",
    variant?.priceKind === "reference" ? `Referensi daftar harga: ${variant.priceSourceId}; ${formatIDR(variant.priceIDR)} (mohon konfirmasi)` : "",
    name?.trim() ? `Nama: ${name.trim()}` : "",
    city?.trim() ? `Kota: ${city.trim()}` : "",
    message?.trim() ? `Kebutuhan saya: ${message.trim()}` : "Kebutuhan saya: Mohon konfirmasi spesifikasi, cakupan unit, harga, dan ketersediaan.",
    "",
    product?.nameStatus === "confirmed" ? "Mohon konfirmasi harga akhir, spesifikasi, dan ketersediaan sebelum pemesanan." : "Saya memahami nama model dan spesifikasi pada katalog masih menunggu konfirmasi HCBTECH.",
  ];
  return lines.filter((line, index) => line !== "" || lines[index - 1] !== "").join("\n");
}

export function buildWhatsAppUrl(input: InquiryInput) {
  const number = getWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildInquiryMessage(input))}`;
}

export function buildContactFallback(input: InquiryInput) {
  const params = new URLSearchParams();
  if (input.language === "en") params.set("lang", "en");
  if (input.product) params.set("produk", input.product.slug);
  if (input.variant) params.set("varian", input.variant.id);
  if (input.message) params.set("pesan", input.message);
  const query = params.toString();
  return `/kontak${query ? `?${query}` : ""}`;
}

export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const successful = document.execCommand("copy");
  textarea.remove();
  if (!successful) throw new Error("Teks tidak dapat disalin");
}
