import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Faq from "../components/Faq";
import InquiryLink from "../components/InquiryLink";
import NeedsGuide from "../components/NeedsGuide";
import ProductCard from "../components/ProductCard";
import Seo from "../components/Seo";
import { useContent } from "../i18n/LanguageContext";

export default function Home() {
  const { products, generalFaq, t } = useContent();
  return <>
    <Seo title={t("Mesin kelapa dari bengkel HCBTECH")} description={t("Mesin parut kelapa, kupas batok, dan peras santan. Lihat foto asli, 14 pilihan pada daftar harga pemilik, dan konsultasikan kebutuhan melalui WhatsApp.")} path="/" image="/images/products/photo-09.webp" faqs={generalFaq.slice(0, 3)} />
    <section className="bg-graphite pt-[var(--header-height)] text-ivory" aria-labelledby="home-title">
      <div className="mx-auto grid max-w-[1680px] lg:min-h-[650px] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-[var(--gutter)] py-12 lg:py-20">
          <p className="mb-6 text-sm text-ivory/65">{t("HCBTECH · Permesinan & fabrikasi")}</p>
          <h1 id="home-title" className="max-w-[12ch] text-[clamp(3.2rem,5.7vw,6.5rem)] font-medium leading-[.98] tracking-[-.055em]">{t("Mesin kelapa, langsung dari bengkel.")}</h1>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-ivory/70 md:text-lg">{t("Parut kelapa, kupas batok, atau peras santan. Mulai dari pekerjaan Anda, pilih konfigurasi, lalu bicarakan unitnya dengan HCBTECH.")}</p>
          <div className="mt-9 flex flex-wrap gap-3"><a href="#mesin" className="btn btn-red">{t("Pilih mesin")}<ArrowRight size={16} aria-hidden="true" /></a><InquiryLink className="btn btn-outline-light" label="Konsultasi WhatsApp" /></div>
        </div>
        <figure className="relative min-h-[280px] overflow-hidden lg:min-h-full"><img src="/images/products/photo-09.webp" width="1280" height="960" alt={t("Foto asli area kerja dan perakitan mesin di bengkel HCBTECH")} fetchPriority="high" className="h-full max-h-[560px] w-full object-cover lg:absolute lg:inset-0 lg:max-h-none" /><figcaption className="absolute bottom-0 inset-x-0 bg-graphite/85 px-6 py-3 text-xs text-ivory/75">{t("Dokumentasi bengkel dari pemilik HCBTECH")}</figcaption></figure>
      </div>
    </section>
    <section id="mesin" className="site-shell scroll-mt-[var(--header-height)] py-16 md:py-24" aria-labelledby="family-title">
      <div className="flex flex-wrap items-end justify-between gap-6"><div><h2 id="family-title" className="display-md max-w-3xl">{t("Pilih mesin untuk pekerjaan Anda.")}</h2><p className="mt-5 max-w-2xl text-steel-dark">{t("Tiga keluarga mesin. Empat belas pilihan tipe dan penggerak pada daftar pemilik.")}</p></div><Link to="/mesin" className="btn btn-outline">{t("Buka katalog")}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      <p className="mt-8 border-t hairline pt-5 text-sm text-steel-dark">{t("Harga mengikuti daftar pemilik dan dikonfirmasi sebelum pemesanan. Foto adalah referensi keluarga mesin; minta foto varian yang Anda pilih.")}</p>
    </section>
    <section className="bg-[#e8e4dc] py-16 md:py-24" aria-label={t("Panduan kebutuhan tiga langkah")}><div className="site-shell"><h2 className="display-md max-w-3xl">{t("Belum tahu tipe yang cocok?")}</h2><p className="mt-5 mb-10 max-w-xl text-steel-dark">{t("Pilih pekerjaan, penggerak, dan informasi yang Anda perlukan. Kami siapkan draf konsultasinya.")}</p><NeedsGuide /></div></section>
    <section className="site-shell grid gap-10 py-16 md:py-24 lg:grid-cols-12"><h2 className="display-md lg:col-span-4">{t("Sebelum memesan.")}</h2><div className="lg:col-span-7 lg:col-start-6"><Faq items={generalFaq.slice(0, 3)} /></div></section>
  </>;
}
