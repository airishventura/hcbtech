import { createContext, useContext, useEffect } from "react";
import type { Product } from "../data/products";
import { getWhatsAppNumber } from "../lib/inquiry";
import { useLanguage } from "../i18n/LanguageContext";
import { createBreadcrumbSchema, createFaqSchema, createOrganizationSchema, createProductSchema, type FaqSchemaItem } from "../lib/seo";

export interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  product?: Product;
  faqs?: FaqSchemaItem[];
  noIndex?: boolean;
}

export const SeoCollector = createContext<((props: SeoProps & { language: "id" | "en" }) => void) | null>(null);

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setSchema(id: string, value: unknown) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(value);
  return script;
}

export default function Seo({ title, description, path, image, product, faqs, noIndex = false }: SeoProps) {
  const { language, t } = useLanguage();
  const collect = useContext(SeoCollector);
  collect?.({ title, description, path, image, product, faqs, noIndex, language });
  useEffect(() => {
    const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
    const baseCanonical = `${siteUrl}${path}`;
    const canonical = language === "en" ? `${baseCanonical}?lang=en` : baseCanonical;
    const socialSlug = product?.nameStatus === "confirmed" ? product.slug : "home";
    const socialImage = `${siteUrl}/social/${socialSlug}-${language}.png`;
    const socialImageAlt = product?.gallery[0]?.alt ?? t("Visualisasi mesin HCBTECH pada katalog machining dan fabrikasi");
    const fullTitle = `${title} — HCBTECH`;
    document.documentElement.lang = language;
    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", noIndex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "HCBTECH");
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", product ? "product" : "website");
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[property="og:image"]', "property", "og:image", socialImage);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", socialImageAlt);
    setMeta('meta[property="og:locale"]', "property", "og:locale", language === "en" ? "en_US" : "id_ID");
    setMeta('meta[property="og:locale:alternate"]', "property", "og:locale:alternate", language === "en" ? "id_ID" : "en_US");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", socialImage);
    setMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", socialImageAlt);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    for (const [hreflang, href] of [["id", baseCanonical], ["en", `${baseCanonical}?lang=en`], ["x-default", baseCanonical]] as const) {
      let alternate = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!alternate) {
        alternate = document.createElement("link");
        alternate.rel = "alternate";
        alternate.hreflang = hreflang;
        document.head.appendChild(alternate);
      }
      alternate.href = href;
    }

    const pageType = path === "/mesin" ? "CollectionPage" : path === "/kontak" ? "ContactPage" : path === "/tentang" ? "AboutPage" : "WebPage";
    const pageSchema: Record<string, unknown> = product
      ? createProductSchema(product, siteUrl, canonical, language)
      : {
          "@context": "https://schema.org",
          "@type": pageType,
          name: title,
          description,
          url: canonical,
          inLanguage: language === "en" ? "en-US" : "id-ID",
          isPartOf: { "@type": "WebSite", name: "HCBTECH", url: siteUrl, inLanguage: language === "en" ? "en-US" : "id-ID" },
          about: { "@type": "Organization", name: "HCBTECH", url: siteUrl },
        };
    const pageScript = setSchema("page-jsonld", pageSchema);
    const supplemental = [
      ...(product ? [createBreadcrumbSchema(product, siteUrl, language)] : []),
      ...(faqs?.length ? [createFaqSchema(faqs, language)] : []),
    ];
    const supplementalScript = supplemental.length ? setSchema("supplemental-jsonld", { "@context": "https://schema.org", "@graph": supplemental }) : null;
    if (!supplemental.length) document.getElementById("supplemental-jsonld")?.remove();
    setSchema("organization-jsonld", createOrganizationSchema(siteUrl, getWhatsAppNumber(), language));

    return () => {
      pageScript.remove();
      supplementalScript?.remove();
    };
  }, [title, description, path, image, product, faqs, language, t, noIndex]);
  return null;
}
