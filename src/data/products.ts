import priceSheet from "../../assets/pricelist.json";
const referencePrice = (id: string) => priceSheet.variants.find(row => row.id === id)?.listedPriceIDR ?? null;

export type DriveType = "listrik" | "engine" | "listrik-atau-engine";
export type VerificationStatus = "verified" | "observed" | "unconfirmed";
export type ModelAccuracy = "none" | "approximation" | "geometry-verified";
export type Availability = "unconfirmed" | "available" | "made-to-order" | "out-of-stock";

export interface SpecItem {
  label: string;
  value: string | null;
  unit?: string;
  status: VerificationStatus;
  note?: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  drive: "listrik" | "engine" | "unconfirmed";
  priceSourceId?: string;
  priceKind?: "reference" | "confirmed";
  priceIDR: number | null;
  availability: Availability;
  note: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  kind: "original-photo" | "visualization";
  caption: string;
  width?: number;
  height?: number;
}

export interface Hotspot {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
  status: "observed" | "unconfirmed";
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameStatus: "draft" | "confirmed";
  sku: string | null;
  category: "piringan-gearbox" | "drum-tertutup" | "parut-kelapa" | "kupas-batok-kelapa" | "peras-santan";
  familyLabel: string;
  description: string;
  shortDescription: string;
  driveType: DriveType;
  material: string | null;
  dimensions: string | null;
  capacity: string | null;
  features: { label: string; status: VerificationStatus }[];
  variants: ProductVariant[];
  priceIDR: number | null;
  quotationOnly: boolean;
  availability: Availability;
  gallery: GalleryItem[];
  demonstrationVideo: { url: string; title: string; poster: string } | null;
  modelGLB: string | null;
  posterImage: string;
  modelAccuracy: ModelAccuracy;
  specificationsStatus: "awaiting-owner-confirmation" | "partially-verified" | "verified";
  specifications: SpecItem[];
  hotspots: Hotspot[];
  faq: { question: string; answer: string }[];
  featured?: boolean;
  referenceNote: string;
  defaultVariantId?: string;
  priceSource?: { receivedDate: string; url: string };
  modelReferenceNote?: string | null;
}

export const products: Product[] = [
  {
    "id": "HCB-PARUT",
    "slug": "parut-kelapa",
    "name": "Mesin Parut Kelapa",
    "nameStatus": "confirmed",
    "sku": null,
    "category": "parut-kelapa",
    "familyLabel": "Parut kelapa",
    "description": "Pilihan Mini, Berdiri, dan Jumbo untuk kebutuhan parut kelapa. Pilih tipe serta penggerak pada daftar harga, lalu konfirmasikan unit yang sesuai.",
    "shortDescription": "Mini, Berdiri, dan Jumbo dengan pilihan penggerak pada daftar pemilik.",
    "driveType": "listrik-atau-engine",
    "material": null,
    "dimensions": null,
    "capacity": null,
    "features": [
      {
        "label": "Pilihan tipe dan harga bersumber dari daftar pemilik.",
        "status": "verified"
      },
      {
        "label": "Foto asli tersedia untuk referensi bentuk keluarga mesin.",
        "status": "observed"
      },
      {
        "label": "Dimensi, material, dan kapasitas dibahas sebelum pemesanan.",
        "status": "unconfirmed"
      }
    ],
    "variants": [
      {
        "id": "PRICE-01",
        "label": "Mini / Dinamo 1 PK",
        "drive": "listrik",
        "priceIDR": referencePrice("PRICE-01"),
        "priceSourceId": "PRICE-01",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-02",
        "label": "Berdiri / Dinamo 1 PK",
        "drive": "listrik",
        "priceIDR": referencePrice("PRICE-02"),
        "priceSourceId": "PRICE-02",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-03",
        "label": "Berdiri / Dinamo 2 PK",
        "drive": "listrik",
        "priceIDR": referencePrice("PRICE-03"),
        "priceSourceId": "PRICE-03",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-04",
        "label": "Berdiri / Stihl Bensin",
        "drive": "engine",
        "priceIDR": referencePrice("PRICE-04"),
        "priceSourceId": "PRICE-04",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-05",
        "label": "Jumbo / Genset 13 PK",
        "drive": "unconfirmed",
        "priceIDR": referencePrice("PRICE-05"),
        "priceSourceId": "PRICE-05",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      }
    ],
    "priceIDR": null,
    "quotationOnly": true,
    "availability": "unconfirmed",
    "gallery": [
      {
        "src": "/images/products/photo-47.webp",
        "alt": "Foto referensi mesin parut kelapa dari pemilik HCBTECH — 47",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 960,
        "height": 1280
      },
      {
        "src": "/images/products/photo-39.webp",
        "alt": "Foto referensi mesin parut kelapa dari pemilik HCBTECH — 39",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 960,
        "height": 1280
      },
      {
        "src": "/images/products/photo-45.webp",
        "alt": "Foto referensi mesin parut kelapa dari pemilik HCBTECH — 45",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 960,
        "height": 1280
      }
    ],
    "demonstrationVideo": null,
    "modelGLB": "/models/pilot-parut-kelapa-v1.glb",
    "posterImage": "/images/products/photo-47.webp",
    "modelAccuracy": "approximation",
    "specificationsStatus": "partially-verified",
    "specifications": [
      {
        "label": "Pilihan pada daftar harga",
        "value": "5",
        "status": "verified"
      },
      {
        "label": "Dimensi keseluruhan",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Material bagian kontak",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Kapasitas kerja",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Berat unit",
        "value": null,
        "status": "unconfirmed"
      }
    ],
    "hotspots": [],
    "faq": [
      {
        "question": "Apakah harga pada daftar sudah final?",
        "answer": "Harga mengacu pada daftar pemilik yang diterima 21 November 2026. Harga, komponen yang termasuk, stok, dan pengiriman dikonfirmasi sebelum pemesanan."
      },
      {
        "question": "Apakah foto dan 3D mewakili semua varian?",
        "answer": "Foto menunjukkan referensi keluarga mesin. Model 3D adalah studi bentuk luar tanpa ukuran terukur. Minta foto unit dan spesifikasi varian yang akan dipesan."
      }
    ],
    "featured": true,
    "referenceNote": "Harga daftar perlu dikonfirmasi kembali sebelum pemesanan.",
    "defaultVariantId": "PRICE-02",
    "priceSource": {
      "receivedDate": "2026-11-21",
      "url": "/docs/daftar-harga.jpeg"
    },
    "modelReferenceNote": "Referensi 3D: bentuk berdiri dengan penggerak listrik, disusun dari foto 47. Bukan model khusus semua varian dan belum memiliki ukuran terukur."
  },
  {
    "id": "HCB-KUPAS",
    "slug": "kupas-batok-kelapa",
    "name": "Mesin Kupas Batok Kelapa",
    "nameStatus": "confirmed",
    "sku": null,
    "category": "kupas-batok-kelapa",
    "familyLabel": "Kupas batok",
    "description": "Pilihan Ampar tanpa kaki, Duduk, dan Berdiri untuk pekerjaan kupas batok kelapa. Daftar pemilik membedakan konfigurasi dinamo dan bensin; penggerak untuk Ampar belum dicantumkan.",
    "shortDescription": "Ampar, Duduk, dan Berdiri; pilih konfigurasi sesuai kebutuhan kerja.",
    "driveType": "listrik-atau-engine",
    "material": null,
    "dimensions": null,
    "capacity": null,
    "features": [
      {
        "label": "Pilihan tipe dan harga bersumber dari daftar pemilik.",
        "status": "verified"
      },
      {
        "label": "Foto asli tersedia untuk referensi bentuk keluarga mesin.",
        "status": "observed"
      },
      {
        "label": "Dimensi, material, dan kapasitas dibahas sebelum pemesanan.",
        "status": "unconfirmed"
      }
    ],
    "variants": [
      {
        "id": "PRICE-06",
        "label": "Ampar tanpa kaki",
        "drive": "unconfirmed",
        "priceIDR": referencePrice("PRICE-06"),
        "priceSourceId": "PRICE-06",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Penggerak tidak dicantumkan pada daftar harga. Konfirmasikan konfigurasi dan cakupan unit."
      },
      {
        "id": "PRICE-07",
        "label": "Duduk / Dinamo",
        "drive": "listrik",
        "priceIDR": referencePrice("PRICE-07"),
        "priceSourceId": "PRICE-07",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-08",
        "label": "Duduk / Bensin",
        "drive": "engine",
        "priceIDR": referencePrice("PRICE-08"),
        "priceSourceId": "PRICE-08",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-09",
        "label": "Berdiri / Dinamo",
        "drive": "listrik",
        "priceIDR": referencePrice("PRICE-09"),
        "priceSourceId": "PRICE-09",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-10",
        "label": "Berdiri / Bensin",
        "drive": "engine",
        "priceIDR": referencePrice("PRICE-10"),
        "priceSourceId": "PRICE-10",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      }
    ],
    "priceIDR": null,
    "quotationOnly": true,
    "availability": "unconfirmed",
    "gallery": [
      {
        "src": "/images/products/photo-36.webp",
        "alt": "Foto referensi mesin kupas batok kelapa dari pemilik HCBTECH — 36",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 960,
        "height": 1280
      },
      {
        "src": "/images/products/photo-06.webp",
        "alt": "Foto referensi mesin kupas batok kelapa dari pemilik HCBTECH — 06",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 720,
        "height": 1280
      },
      {
        "src": "/images/products/photo-29.webp",
        "alt": "Foto referensi mesin kupas batok kelapa dari pemilik HCBTECH — 29",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 960,
        "height": 1280
      }
    ],
    "demonstrationVideo": null,
    "modelGLB": "/models/pilot-kupas-batok-v1.glb",
    "posterImage": "/images/products/photo-36.webp",
    "modelAccuracy": "approximation",
    "specificationsStatus": "partially-verified",
    "specifications": [
      {
        "label": "Pilihan pada daftar harga",
        "value": "5",
        "status": "verified"
      },
      {
        "label": "Dimensi keseluruhan",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Material bagian kontak",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Kapasitas kerja",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Berat unit",
        "value": null,
        "status": "unconfirmed"
      }
    ],
    "hotspots": [],
    "faq": [
      {
        "question": "Apakah harga pada daftar sudah final?",
        "answer": "Harga mengacu pada daftar pemilik yang diterima 21 November 2026. Harga, komponen yang termasuk, stok, dan pengiriman dikonfirmasi sebelum pemesanan."
      },
      {
        "question": "Apakah foto dan 3D mewakili semua varian?",
        "answer": "Foto menunjukkan referensi keluarga mesin. Model 3D adalah studi bentuk luar tanpa ukuran terukur. Minta foto unit dan spesifikasi varian yang akan dipesan."
      }
    ],
    "featured": true,
    "referenceNote": "Harga daftar perlu dikonfirmasi kembali sebelum pemesanan.",
    "defaultVariantId": "PRICE-09",
    "priceSource": {
      "receivedDate": "2026-11-21",
      "url": "/docs/daftar-harga.jpeg"
    },
    "modelReferenceNote": "Referensi 3D: rangka meja, motor listrik, gearbox, dan piringan dari foto 36. Bukan model khusus semua varian dan belum memiliki ukuran terukur."
  },
  {
    "id": "HCB-PERAS",
    "slug": "peras-santan",
    "name": "Mesin Peras Santan",
    "nameStatus": "confirmed",
    "sku": null,
    "category": "peras-santan",
    "familyLabel": "Peras santan",
    "description": "Empat pilihan pada daftar pemilik: Mini A10, A11, A22, dan A33. Pilih konfigurasi General, Honda GP160, atau Honda GP200 yang tercantum, lalu bahas bahan, kapasitas, dan cakupan unit.",
    "shortDescription": "Mini A10, A11, A22, dan A33 dengan konfigurasi penggerak pada daftar harga.",
    "driveType": "listrik-atau-engine",
    "material": null,
    "dimensions": null,
    "capacity": null,
    "features": [
      {
        "label": "Pilihan tipe dan harga bersumber dari daftar pemilik.",
        "status": "verified"
      },
      {
        "label": "Foto asli tersedia untuk referensi bentuk keluarga mesin.",
        "status": "observed"
      },
      {
        "label": "Dimensi, material, dan kapasitas dibahas sebelum pemesanan.",
        "status": "unconfirmed"
      }
    ],
    "variants": [
      {
        "id": "PRICE-11",
        "label": "Mini A10 / General",
        "drive": "unconfirmed",
        "priceIDR": referencePrice("PRICE-11"),
        "priceSourceId": "PRICE-11",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-12",
        "label": "A11 / Honda GP160",
        "drive": "engine",
        "priceIDR": referencePrice("PRICE-12"),
        "priceSourceId": "PRICE-12",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-13",
        "label": "A22 / Honda GP160",
        "drive": "engine",
        "priceIDR": referencePrice("PRICE-13"),
        "priceSourceId": "PRICE-13",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      },
      {
        "id": "PRICE-14",
        "label": "A33 / Honda GP200",
        "drive": "engine",
        "priceIDR": referencePrice("PRICE-14"),
        "priceSourceId": "PRICE-14",
        "priceKind": "reference",
        "availability": "unconfirmed",
        "note": "Harga dan nama konfigurasi mengikuti daftar pemilik; cakupan unit dan ketersediaan dikonfirmasi."
      }
    ],
    "priceIDR": null,
    "quotationOnly": true,
    "availability": "unconfirmed",
    "gallery": [
      {
        "src": "/images/products/photo-04.webp",
        "alt": "Foto referensi mesin peras santan dari pemilik HCBTECH — 04",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 960,
        "height": 1280
      },
      {
        "src": "/images/products/photo-12.webp",
        "alt": "Foto referensi mesin peras santan dari pemilik HCBTECH — 12",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 960,
        "height": 1280
      },
      {
        "src": "/images/products/photo-32.webp",
        "alt": "Foto referensi mesin peras santan dari pemilik HCBTECH — 32",
        "kind": "original-photo",
        "caption": "Foto keluarga mesin dari pemilik. Kesesuaian dengan varian yang dipilih dikonfirmasi saat penawaran.",
        "width": 720,
        "height": 1280
      }
    ],
    "demonstrationVideo": null,
    "modelGLB": "/models/pilot-peras-santan-v1.glb",
    "posterImage": "/images/products/photo-04.webp",
    "modelAccuracy": "approximation",
    "specificationsStatus": "partially-verified",
    "specifications": [
      {
        "label": "Pilihan pada daftar harga",
        "value": "4",
        "status": "verified"
      },
      {
        "label": "Dimensi keseluruhan",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Material bagian kontak",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Kapasitas kerja",
        "value": null,
        "status": "unconfirmed"
      },
      {
        "label": "Berat unit",
        "value": null,
        "status": "unconfirmed"
      }
    ],
    "hotspots": [],
    "faq": [
      {
        "question": "Apakah harga pada daftar sudah final?",
        "answer": "Harga mengacu pada daftar pemilik yang diterima 21 November 2026. Harga, komponen yang termasuk, stok, dan pengiriman dikonfirmasi sebelum pemesanan."
      },
      {
        "question": "Apakah foto dan 3D mewakili semua varian?",
        "answer": "Foto menunjukkan referensi keluarga mesin. Model 3D adalah studi bentuk luar tanpa ukuran terukur. Minta foto unit dan spesifikasi varian yang akan dipesan."
      }
    ],
    "featured": true,
    "referenceNote": "Harga daftar perlu dikonfirmasi kembali sebelum pemesanan.",
    "defaultVariantId": "PRICE-11",
    "priceSource": {
      "receivedDate": "2026-11-21",
      "url": "/docs/daftar-harga.jpeg"
    },
    "modelReferenceNote": "Referensi 3D: hopper, rol luar, rangka, dan penggerak dari foto 04. Bukan model khusus semua varian dan belum memiliki ukuran terukur."
  }
];

export const categories = [{"id": "all", "label": "Semua mesin"}, {"id": "parut-kelapa", "label": "Mesin Parut Kelapa"}, {"id": "kupas-batok-kelapa", "label": "Mesin Kupas Batok Kelapa"}, {"id": "peras-santan", "label": "Mesin Peras Santan"}] as const;
export function getProduct(slug: string) { return products.find(product => product.slug === slug); }
export function getProductPrice(product: Product, variantId?: string) { return product.variants.find(item => item.id === variantId)?.priceIDR ?? product.priceIDR; }
export function getPriceRange(product: Product) { const values = product.variants.map(item => item.priceIDR).filter((value): value is number => value !== null); return values.length ? { min: Math.min(...values), max: Math.max(...values) } : null; }
