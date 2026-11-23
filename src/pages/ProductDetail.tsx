import { Check, ChevronRight, FileQuestion, Info } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Link } from "../components/LocalizedLink";
import Faq from "../components/Faq";
import InquiryLink from "../components/InquiryLink";
import { BackToCatalog } from "../components/PageElements";
import ProductCard from "../components/ProductCard";
import ProductMedia from "../components/ProductMedia";
import { Reveal, SectionIntro } from "../components/Reveal";
import Seo from "../components/Seo";
import type { Product } from "../data/products";
import { useContent } from "../i18n/LanguageContext";
import { displayAvailability, displaySpec, formatIDR, getWhatsAppNumber } from "../lib/inquiry";
import { legacyProducts } from "../data/legacy-products";
import { localizeProduct } from "../i18n/localize";
import NotFound from "./NotFound";

function ProductDetailContent({ product }: { product: Product }) {
  const { products, t, language } = useContent();
  const [params, setParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const variant = product.variants.find(item => item.id === params.get("varian")) ?? product.variants.find(item => item.id === product.defaultVariantId) ?? product.variants.find(item => item.drive === (product.driveType === "engine" ? "engine" : "listrik")) ?? product.variants[0];
  const setVariantId = (id: string) => { const next = new URLSearchParams(params); next.set("varian", id); setParams(next, { replace: true, preventScrollReset: true }); };
  const related = products.filter(item => item.id !== product.id).slice(0, 2);
  const priceValue = variant?.priceIDR ?? product.priceIDR;
  const price = formatIDR(priceValue);

  return <>
    <Seo title={product.name} description={product.priceSource ? t("{short} Harga daftar: {price}; konfirmasikan harga dan ketersediaan sebelum memesan.", { short: product.shortDescription, price: t(price) }) : t("{short} Nama model sementara. Harga: {price}. Konfirmasi spesifikasi dan ketersediaan kepada HCBTECH.", { short: product.shortDescription, price: t(price) })} noIndex={product.id.startsWith("REF-")} path={`/mesin/${product.slug}`} image={product.posterImage} product={product} faqs={product.faq} />
    {product.id.startsWith("REF-") && <div className="site-shell pt-[calc(var(--header-height)+20px)]"><p className="border-l-2 border-industrial pl-4 text-sm">{t("Ini halaman referensi lama.")} <Link to="/mesin" className="underline">{t("Lihat katalog mesin terbaru")}</Link></p></div>}
    <article className="product-detail-surface pb-24 pt-[calc(var(--header-height)+24px)] md:pb-36">
      <div className="site-shell">
        <div className="mb-6 flex items-center justify-between gap-4 border-b hairline pb-3"><BackToCatalog /><nav aria-label="Breadcrumb" className="mono hidden items-center gap-2 text-steel-dark md:flex"><Link to="/mesin">{t("Mesin")}</Link><ChevronRight size={12} /><span aria-current="page">{product.id}</span></nav></div>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-20">
          <div className="min-w-0 lg:col-span-7"><div className="lg:sticky lg:top-[calc(var(--header-height)+24px)]"><ProductMedia product={product} variant={variant} /></div></div>
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:pt-8">
              <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2"><span className="mono text-industrial">{product.familyLabel}</span><span className="mono text-steel-dark">{product.id} / {product.priceSource ? t("Daftar harga pemilik") : `SKU: ${product.sku ?? t("Konfirmasi")}`}</span></div>
              <h1 className="text-[clamp(2.45rem,4.5vw,5.1rem)] leading-[.95] tracking-[-.055em]">{product.name}</h1>
              {product.nameStatus === "draft" && <p className="mono mt-4 inline-block border border-industrial/40 px-2 py-1 text-industrial">{t("Nama model sementara")}</p>}
              <p className="body-lg mt-6 text-steel-dark">{product.shortDescription}</p>

              <div className="mt-9 border-y hairline py-6"><p className="mono mb-2 text-steel-dark">{t(product.priceSource ? "Harga daftar varian" : "Harga konfigurasi")}</p><p data-testid="variant-price" className="text-[clamp(1.8rem,3vw,2.8rem)] font-medium tracking-[-.04em]">{t(price)}</p><p className="mt-2 text-sm text-steel-dark">{product.priceSource ? <>{product.referenceNote} <a href={product.priceSource.url} target="_blank" rel="noreferrer" className="underline">{t("Lihat daftar sumber")}</a></> : priceValue !== null ? t("Harga berdasarkan data terverifikasi pada repositori produk.") : t("Belum ada harga terverifikasi. Tidak ada harga mulai atau estimasi yang dibuat-buat.")}</p></div>

              <noscript><style>{`html:not([data-js]) .variant-picker { display: none; }`}</style><div className="mt-8 grid gap-2">{product.variants.map(item => <Link key={item.id} to={`?${new URLSearchParams({ ...(language === "en" ? { lang: "en" } : {}), varian: item.id })}`} className="min-h-11 border hairline px-4 py-3 text-sm">{item.label} — {formatIDR(item.priceIDR)}</Link>)}</div></noscript>
              <fieldset className="variant-picker mt-8"><legend className="label mb-4">{t("01 / Pilih konfigurasi yang diminati")}</legend><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{product.variants.map((item) => { const selected = item.id === variant?.id; return <label key={item.id} className={`relative flex min-h-[74px] cursor-pointer items-center gap-3 border p-4 transition-colors ${selected ? "border-graphite bg-graphite text-ivory" : "hairline border hover:border-graphite"}`}><input type="radio" name={`variant-${product.id}`} value={item.id} checked={selected} onChange={() => setVariantId(item.id)} onClick={() => { if (selected) setVariantId(item.id); }} className="sr-only" /><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-ivory bg-industrial" : "border-graphite/35"}`}>{selected && <Check size={12} />}</span><span><span className="block text-sm font-medium">{item.label}</span><span className={`mono mt-1 block ${selected ? "text-ivory/50" : "text-steel-dark"}`}>{item.priceKind ? t(formatIDR(item.priceIDR)) : t("Konfirmasi opsi")}</span></span></label>; })}</div><p className="mt-3 text-xs leading-relaxed text-steel-dark">{variant?.note}</p></fieldset>

              <div className="mt-7"><label htmlFor="product-message" className="label">{t("02 / Tambahkan kebutuhan (opsional)")}</label><textarea id="product-message" className="field min-h-[96px] resize-y" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t("Contoh: bahan yang diproses, hasil yang diinginkan, kota pemasangan…")} maxLength={1000} /><p className="mono mt-2 text-right text-steel-dark">{message.length}/1000</p></div>
              <InquiryLink product={product} variant={variant} message={message} className="btn btn-red mt-4 w-full" label="Minta penawaran konfigurasi ini" />
              <p className="mono mt-3 text-center text-steel-dark">{getWhatsAppNumber() ? t("Membuka WhatsApp dengan produk, varian, dan pesan terisi") : t("Membuka formulir kontak dengan produk dan varian terisi")}</p>
              <div className="mt-7 grid grid-cols-2 gap-5 border-t hairline pt-5"><div><p className="mono mb-2 text-steel-dark">{t("Ketersediaan")}</p><p className="text-sm">{t(displayAvailability(variant?.availability ?? product.availability))}</p></div><div><p className="mono mb-2 text-steel-dark">{t("Status spesifikasi")}</p><p className="text-sm">{product.specificationsStatus === "verified" ? t("Terverifikasi") : product.specificationsStatus === "partially-verified" ? t("Sebagian terverifikasi") : t("Menunggu konfirmasi pemilik")}</p></div></div>
            </div>
          </div>
        </div>
      </div>

      <section className="site-shell mt-20 md:mt-32" aria-labelledby="description-title">
        <Reveal className="grid gap-8 border-t hairline pt-6 md:grid-cols-12"><div className="md:col-span-3"><p className="mono text-steel-dark"><span className="text-industrial">01</span> / {t("Deskripsi terverifikasi")}</p></div><div className="md:col-span-8"><h2 id="description-title" className="title-lg mb-6">{product.priceSource ? t("Pilih tipe, lalu bahas kebutuhan kerja.") : t("Yang dapat dilihat—dan batasnya.")}</h2><p className="body-lg text-steel-dark">{product.description}</p><div className="mt-7 flex gap-3 border-l-2 border-industrial pl-4"><Info size={18} className="mt-1 shrink-0 text-industrial" /><p className="text-sm leading-relaxed text-steel-dark">{product.priceSource ? t("Foto pada galeri adalah referensi keluarga mesin. Minta foto aktual varian yang akan ditawarkan.") : t("Pernyataan “teramati” berasal dari tampilan luar pada referensi, bukan pengukuran atau pengujian. Visualisasi yang tampil bukan foto asli unit.")}</p></div></div></Reveal>
      </section>

      <section className="site-shell mt-20 grid gap-12 md:mt-28 lg:grid-cols-12" aria-labelledby="spec-title">
        <Reveal className="min-w-0 lg:col-span-7"><div className="mb-7 flex items-end justify-between gap-4"><div><p className="mono mb-4 text-steel-dark"><span className="text-industrial">02</span> / {t("Data teknis")}</p><h2 id="spec-title" className="title-lg">{t("Spesifikasi")}</h2></div><FileQuestion size={28} strokeWidth={1.3} className="text-steel" /></div><div className="overflow-x-auto"><table className="w-full border-collapse text-left"><caption className="sr-only">{t("Tabel spesifikasi {name}", { name: product.name })}</caption><tbody>{product.specifications.map((spec) => <tr key={spec.label} className="border-t hairline last:border-b"><th scope="row" className="w-[42%] py-4 pr-4 align-top text-sm font-medium">{spec.label}</th><td className="py-4 align-top"><span className={`block text-sm ${spec.value ? "text-graphite" : "text-steel-dark"}`}>{t(displaySpec(spec.value))}{spec.unit ? ` ${spec.unit}` : ""}</span><span className="mono mt-1 block text-steel-dark">{spec.status === "verified" ? t("Terverifikasi") : spec.status === "observed" ? t("Observasi visual") : t("Menunggu data")}</span>{spec.note && <span className="mt-2 block text-xs leading-relaxed text-steel-dark">{spec.note}</span>}</td></tr>)}</tbody></table></div></Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9" delay={.1}><p className="mono mb-4 text-steel-dark"><span className="text-industrial">03</span> / {t("Komponen terlihat")}</p><h2 className="title-lg mb-7">{t("Fitur & batas data")}</h2><ul className="border-t hairline">{product.features.map((feature, index) => <li key={feature.label} className="border-b hairline py-5"><span className="mono mb-2 block text-industrial">{String(index + 1).padStart(2, "0")} / {feature.status === "verified" ? t("Terverifikasi") : feature.status === "observed" ? t("Observasi") : t("Konfirmasi")}</span><p className="text-sm leading-relaxed">{feature.label}</p></li>)}</ul><div className="mt-7 bg-[#e8e4dc] p-5"><p className="mono mb-3">{t("Model 3D")}</p><p className="text-sm leading-relaxed text-steel-dark">{product.modelAccuracy === "none" ? t("Model 3D untuk keluarga ini sedang disiapkan. Foto asli tetap tersedia pada galeri.") : product.modelAccuracy === "geometry-verified" ? t("Status: geometri terverifikasi terhadap referensi. Verifikasi visual bukan sertifikasi engineering atau performa.") : product.modelGLB ? t("Status: aproksimasi. File GLB tersedia, tetapi geometrinya belum menyelesaikan verifikasi dan tidak dapat digunakan sebagai acuan dimensi.") : t("Status: aproksimasi. File GLB belum tersedia. Komponen prosedural hanya membantu orientasi dan tidak dapat digunakan sebagai acuan dimensi.")}</p></div></Reveal>
      </section>

      <section className="site-shell mt-20 grid gap-10 md:mt-28 lg:grid-cols-12"><Reveal className="lg:col-span-4"><p className="mono mb-5 text-steel-dark"><span className="text-industrial">04</span> / {t("FAQ produk")}</p><h2 className="display-md">{t("Sebelum penawaran.")}</h2></Reveal><Reveal className="lg:col-span-8"><Faq items={product.faq} /></Reveal></section>

      <section className="site-shell mt-24 md:mt-36"><SectionIntro number="05" eyebrow={t("Konfigurasi terkait")} title={t("Bandingkan tata letak lainnya.")} /><div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">{related.map((item) => <Reveal key={item.id}><ProductCard product={item} index={products.indexOf(item)} /></Reveal>)}</div></section>
    </article>
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t hairline bg-ivory/95 p-3 backdrop-blur-md lg:hidden"><div className="mx-auto flex max-w-xl items-center gap-3"><div className="min-w-0 flex-1"><p className="mono truncate text-steel-dark">{variant?.label}</p><p className="truncate text-sm font-medium">{t(price)}</p></div><InquiryLink product={product} variant={variant} message={message} className="btn btn-red" label="Minta penawaran" showIcon={false} /></div></div>
  </>;
}

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const { products, t } = useContent();
  const legacy = legacyProducts.find(item => item.slug === slug);
  const product = products.find((item) => item.slug === slug) ?? (legacy ? localizeProduct(legacy, t) : undefined);
  if (!product) return <NotFound />;
  return <ProductDetailContent key={product.slug} product={product} />;
}
