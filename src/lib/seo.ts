import type { Product } from "../data/products";
import { FACEBOOK_URL, TIKTOK_URL } from "./inquiry";

const availabilitySchema: Record<Exclude<Product["availability"], "unconfirmed">, string> = {
  available: "https://schema.org/InStock",
  "made-to-order": "https://schema.org/PreOrder",
  "out-of-stock": "https://schema.org/OutOfStock",
};

export interface FaqSchemaItem { question: string; answer: string; }

export function createProductSchema(product: Product, siteUrl: string, canonical: string, language: "id" | "en" = "id") {
  const hasFactualOffer = typeof product.priceIDR === "number" && Number.isFinite(product.priceIDR) && product.priceIDR >= 0 && product.availability !== "unconfirmed";
  const originalImages = product.gallery.filter((item) => item.kind === "original-photo").map((item) => `${siteUrl}${item.src}`);
  const verifiedProperties = product.specifications.filter((item) => item.status === "verified" && item.value);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name}${product.nameStatus === "draft" ? language === "en" ? " (draft model name)" : " (nama sementara)" : ""}`,
    description: product.description,
    ...(originalImages.length ? { image: originalImages } : {}),
    category: product.familyLabel,
    identifier: product.id,
    brand: { "@type": "Brand", name: "HCBTECH" },
    url: canonical,
    ...(product.sku ? { sku: product.sku } : {}),
    ...(verifiedProperties.length ? {
      additionalProperty: verifiedProperties.map((item) => ({
        "@type": "PropertyValue",
        name: item.label,
        value: `${item.value}${item.unit ? ` ${item.unit}` : ""}`,
      })),
    } : {}),
    ...(hasFactualOffer ? {
      offers: {
        "@type": "Offer",
        priceCurrency: "IDR",
        price: product.priceIDR,
        availability: availabilitySchema[product.availability as Exclude<Product["availability"], "unconfirmed">],
        url: canonical,
        seller: { "@type": "Organization", name: "HCBTECH", url: siteUrl },
      },
    } : {}),
  };
}

export function createFaqSchema(faqs: FaqSchemaItem[], language: "id" | "en" = "id") {
  return {
    "@type": "FAQPage",
    inLanguage: language === "en" ? "en-US" : "id-ID",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function createBreadcrumbSchema(product: Product, siteUrl: string, language: "id" | "en" = "id") {
  const suffix = language === "en" ? "?lang=en" : "";
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: language === "en" ? "Home" : "Beranda", item: `${siteUrl}/${suffix}` },
      { "@type": "ListItem", position: 2, name: language === "en" ? "Machinery catalog" : "Katalog mesin", item: `${siteUrl}/mesin${suffix}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${siteUrl}/mesin/${product.slug}${suffix}` },
    ],
  };
}

export function createOrganizationSchema(siteUrl: string, whatsappNumber: string | null, language: "id" | "en" = "id") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HCBTECH",
    url: siteUrl,
    description: language === "en" ? "Indonesian technical machining and fabrication business with a machinery configuration catalog and quotation requests." : "Usaha technical machining dan fabrikasi Indonesia dengan katalog konfigurasi mesin dan permintaan penawaran.",
    knowsLanguage: ["id", "en"],
    sameAs: [FACEBOOK_URL, TIKTOK_URL],
    ...(whatsappNumber ? {
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${whatsappNumber}`,
        availableLanguage: ["id", "en"],
      },
    } : {}),
  };
}
