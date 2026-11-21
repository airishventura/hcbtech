import { products, type Product } from "../data/products";
import { generalFaq, principles, processSteps, services } from "../data/site";

export type Translate = (text: string, variables?: Record<string, string | number>) => string;

export function localizeProduct(product: Product, t: Translate): Product {
  return {
    ...product,
    name: t(product.name),
    familyLabel: t(product.familyLabel),
    description: t(product.description),
    shortDescription: t(product.shortDescription),
    material: product.material ? t(product.material) : null,
    dimensions: product.dimensions ? t(product.dimensions) : null,
    capacity: product.capacity ? t(product.capacity) : null,
    features: product.features.map((feature) => ({ ...feature, label: t(feature.label) })),
    variants: product.variants.map((variant) => ({ ...variant, label: t(variant.label), note: t(variant.note) })),
    gallery: product.gallery.map((item) => ({ ...item, alt: t(item.alt), caption: t(item.caption) })),
    demonstrationVideo: product.demonstrationVideo ? { ...product.demonstrationVideo, title: t(product.demonstrationVideo.title) } : null,
    specifications: product.specifications.map((spec) => ({ ...spec, label: t(spec.label), value: spec.value ? t(spec.value) : null, note: spec.note ? t(spec.note) : undefined })),
    hotspots: product.hotspots.map((hotspot) => ({ ...hotspot, label: t(hotspot.label), description: t(hotspot.description) })),
    faq: product.faq.map((faq) => ({ question: t(faq.question), answer: t(faq.answer) })),
    referenceNote: t(product.referenceNote),
  };
}

export function localizeProducts(t: Translate) {
  return products.map((product) => localizeProduct(product, t));
}

export function localizeSite(t: Translate) {
  return {
    services: services.map((item) => ({ ...item, title: t(item.title), description: t(item.description), scope: t(item.scope) })),
    processSteps: processSteps.map((item) => ({ ...item, title: t(item.title), description: t(item.description), output: t(item.output) })),
    principles: principles.map((item) => ({ ...item, title: t(item.title), description: t(item.description) })),
    generalFaq: generalFaq.map((item) => ({ ...item, question: t(item.question), answer: t(item.answer) })),
  };
}
