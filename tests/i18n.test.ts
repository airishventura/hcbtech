import { describe, expect, it } from "vitest";
import { products } from "../src/data/products";
import { generalFaq, processSteps, principles, services } from "../src/data/site";
import { enCatalog } from "../src/i18n/en-catalog";
import { enContact } from "../src/i18n/en-contact";
import { enData } from "../src/i18n/en-data";
import { enInfo } from "../src/i18n/en-info";
import { enProduct } from "../src/i18n/en-product";
import { enUi } from "../src/i18n/en-ui";
import { localizeProducts, localizeSite } from "../src/i18n/localize";
import { buildInquiryMessage } from "../src/lib/inquiry";
import { createProductSchema } from "../src/lib/seo";

const dictionary = { ...enData, ...enUi, ...enCatalog, ...enProduct, ...enContact, ...enInfo };
const t = (text: string) => dictionary[text] ?? text;
const allowedSharedTerms = new Set(["Engine", "Gearbox", "Housing", "TikTok", "Facebook"]);

function expectTranslated(source: string, translated: string) {
  if (!allowedSharedTerms.has(source)) {
    expect(translated.length).toBeGreaterThan(0);
    expect(translated).not.toBe(source);
  }
}

const english = localizeProducts(t);

describe("cakupan terjemahan data", () => {
  it("menerjemahkan seluruh konten produk yang dapat dibaca pengguna", () => {
    products.forEach((source, index) => {
      const translated = english[index];
      expectTranslated(source.name, translated.name);
      expectTranslated(source.familyLabel, translated.familyLabel);
      expectTranslated(source.description, translated.description);
      expectTranslated(source.shortDescription, translated.shortDescription);
      source.features.forEach((item, i) => expectTranslated(item.label, translated.features[i].label));
      source.variants.forEach((item, i) => {
        expectTranslated(item.label, translated.variants[i].label);
        expectTranslated(item.note, translated.variants[i].note);
      });
      source.gallery.forEach((item, i) => {
        expectTranslated(item.alt, translated.gallery[i].alt);
        expectTranslated(item.caption, translated.gallery[i].caption);
      });
      source.specifications.forEach((item, i) => {
        expectTranslated(item.label, translated.specifications[i].label);
        if (item.value) expectTranslated(item.value, translated.specifications[i].value ?? "");
        if (item.note) expectTranslated(item.note, translated.specifications[i].note ?? "");
      });
      source.hotspots.forEach((item, i) => {
        expectTranslated(item.label, translated.hotspots[i].label);
        expectTranslated(item.description, translated.hotspots[i].description);
      });
      source.faq.forEach((item, i) => {
        expectTranslated(item.question, translated.faq[i].question);
        expectTranslated(item.answer, translated.faq[i].answer);
      });
    });
  });

  it("menerjemahkan layanan, proses, prinsip, dan FAQ", () => {
    const englishSite = localizeSite(t);
    services.forEach((item, index) => {
      expectTranslated(item.title, englishSite.services[index].title);
      expectTranslated(item.description, englishSite.services[index].description);
      expectTranslated(item.scope, englishSite.services[index].scope);
    });
    processSteps.forEach((item, index) => {
      expectTranslated(item.title, englishSite.processSteps[index].title);
      expectTranslated(item.description, englishSite.processSteps[index].description);
      expectTranslated(item.output, englishSite.processSteps[index].output);
    });
    principles.forEach((item, index) => expectTranslated(item.title, englishSite.principles[index].title));
    generalFaq.forEach((item, index) => {
      expectTranslated(item.question, englishSite.generalFaq[index].question);
      expectTranslated(item.answer, englishSite.generalFaq[index].answer);
    });
  });
});

describe("English inquiry dan Product JSON-LD", () => {
  it("membuat pesan English dengan URL bahasa yang benar", () => {
    const product = english[0];
    const message = buildInquiryMessage({ product, variant: product.variants[0], name: "Budi", city: "Bandung", language: "en" });
    expect(message).toContain("Hello HCBTECH");
    expect(message).toContain("Preferred configuration: Electric motor");
    expect(message).toContain("Name: Budi");
    expect(message).toContain("?lang=en");
  });

  it("menggunakan suffix draft English tanpa Offer palsu", () => {
    const schema = createProductSchema(english[0], "https://business.test", "https://business.test/mesin/unit?lang=en", "en") as Record<string, any>;
    expect(schema.name).toContain("draft model name");
    expect(schema.name).not.toContain("nama sementara");
    expect(schema.offers).toBeUndefined();
  });
});
