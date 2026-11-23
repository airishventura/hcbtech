import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { loadEnglish } from "./i18n/load-English";
import { SeoCollector, type SeoProps } from "./components/Seo";
import SiteRoutes from "./routes";
import Home from "./pages/Home";
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Workshop from "./pages/Workshop";
import NotFound from "./pages/NotFound";
import CatalogEditor from "./pages/CatalogEditor";
import { products } from "./data/products";
import { legacyProducts } from "./data/legacy-products";
import { createProductSchema, createBreadcrumbSchema, createFaqSchema, createOrganizationSchema } from "./lib/seo";
import { getWhatsAppNumber } from "./lib/inquiry";
const pages = { Home, About, Catalog, Contact, ProductDetail, Workshop, CatalogEditor, NotFound };
export const paths = ["/", "/mesin", "/bengkel", "/tentang", "/kontak", "/kelola-katalog", ...products.map(p => `/mesin/${p.slug}`), ...legacyProducts.map(p => `/mesin/${p.slug}`)];
export const variantPages = products.flatMap(product => product.variants.map(variant => ({ path: `/mesin/${product.slug}`, variant: variant.id })));
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!));
const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\u003c");
export async function render(url: string) {
  await loadEnglish();
  const collected: (SeoProps & { language: "id" | "en" })[] = [];
  const html = renderToString(<StaticRouter location={url}><LanguageProvider><SeoCollector.Provider value={props => collected.push(props)}><SiteRoutes pages={pages} /></SeoCollector.Provider></LanguageProvider></StaticRouter>);
  const data = collected.at(-1)!;
  if (!data) throw new Error(`Missing SEO: ${url}`);
  const site = (import.meta.env.VITE_SITE_URL || "https://hcbtech.vercel.app").replace(/\/$/, "");
  const canonical = site + data.path + (data.language === "en" ? "?lang=en" : "");
  const title = `${data.title} — HCBTECH`;
  const slug = data.product?.nameStatus === "confirmed" ? data.product.slug : "home";
  const image = `${site}/social/${slug}-${data.language}.png`;
  const meta = (key: string, value: string, property = false) => `<meta ${property ? "property" : "name"}="${key}" content="${escape(value)}" />`;
  const schema = data.product ? createProductSchema(data.product, site, canonical, data.language) : { "@context": "https://schema.org", "@type": data.path === "/mesin" ? "CollectionPage" : "WebPage", name: data.title, description: data.description, url: canonical, inLanguage: data.language };
  const extra = [...(data.product ? [createBreadcrumbSchema(data.product, site, data.language)] : []), ...(data.faqs?.length ? [createFaqSchema(data.faqs, data.language)] : [])];
  const head = `<title>${escape(title)}</title>` + meta("description", data.description) + meta("robots", data.noIndex ? "noindex,follow" : "index,follow,max-image-preview:large")
    + meta("og:site_name", "HCBTECH", true) + meta("og:title", title, true) + meta("og:description", data.description, true) + meta("og:type", data.product ? "product" : "website", true) + meta("og:url", canonical, true) + meta("og:image", image, true) + meta("og:image:width", "1200", true) + meta("og:image:height", "630", true) + meta("og:image:alt", data.product?.name ?? "HCBTECH machinery", true) + meta("og:locale", data.language === "en" ? "en_US" : "id_ID", true)
    + meta("twitter:card", "summary_large_image") + meta("twitter:title", title) + meta("twitter:description", data.description) + meta("twitter:image", image)
    + `<link rel="canonical" href="${escape(canonical)}" />` + [["id", site + data.path], ["en", site + data.path + "?lang=en"], ["x-default", site + data.path]].map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${escape(href)}" />`).join("")
    + `<script id="page-jsonld" type="application/ld+json">${json(schema)}</script>` + (extra.length ? `<script id="supplemental-jsonld" type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": extra })}</script>` : "") + `<script id="organization-jsonld" type="application/ld+json">${json(createOrganizationSchema(site, getWhatsAppNumber(), data.language))}</script>`;
  return { html, head, language: data.language };
}
