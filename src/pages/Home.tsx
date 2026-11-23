import { ArrowUpRight } from "lucide-react";
import { Link } from "../components/LocalizedLink";
import Faq from "../components/Faq";
import HomeHero from "../components/HomeHero";
import NeedsGuide from "../components/NeedsGuide";
import FramerProjectIndex from "../components/FramerProjectIndex";
import Seo from "../components/Seo";
import { useContent } from "../i18n/LanguageContext";

export default function Home() {
  const { products, generalFaq, t, language } = useContent();
  return <>
    <Seo title={t("Mesin kelapa dari bengkel HCBTECH")} description={t("Mesin parut kelapa, kupas batok, dan peras santan. Lihat foto asli, 14 pilihan pada daftar harga pemilik, dan konsultasikan kebutuhan melalui WhatsApp.")} path="/" image="/images/hero-shell-peeler.webp" faqs={generalFaq.slice(0, 3)} />
    <HomeHero />
    <section id="mesin" className="site-shell scroll-mt-[var(--header-height)] py-16 md:py-24" aria-labelledby="family-title">
      <div className="flex flex-wrap items-end justify-between gap-6"><div><h2 id="family-title" className="display-md max-w-3xl">{t("Pilih mesin untuk pekerjaan Anda.")}</h2><p className="mt-5 max-w-2xl text-steel-dark">{t("Tiga keluarga mesin. Empat belas pilihan tipe dan penggerak pada daftar pemilik.")}</p></div><Link to="/mesin" className="btn btn-outline">{t("Buka katalog")}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <div className="mt-10" data-testid="family-index"><FramerProjectIndex projects={products.map(product => ({ title: product.name, category: t("{count} varian", { count: product.variants.length }), image: { src: product.gallery[0].src, alt: product.gallery[0].alt }, imagePosition: "50% 50%", link: `/mesin/${product.slug}${language === "en" ? "?lang=en" : ""}` }))} padding={0} radius={0} gap={48} stageHeight={540} background="#F2F0EB" textColor="#171717" mutedColor="#60676B" lineColor="#CCCAC5" indexLabel={t("Keluarga mesin")} imageLabel={t("Foto keluarga mesin")} showLabel={t("Pratinjau")} openLabel={t("Lihat detail")} /></div>
      <noscript><ul className="mt-6 flex flex-wrap gap-4">{products.map(product => <li key={product.id}><Link to={`/mesin/${product.slug}`} className="inline-flex min-h-11 items-center border-b border-graphite text-sm">{product.name}</Link></li>)}</ul></noscript>
      <p className="mt-8 border-t hairline pt-5 text-sm text-steel-dark">{t("Harga mengikuti daftar pemilik dan dikonfirmasi sebelum pemesanan. Foto adalah referensi keluarga mesin; minta foto varian yang Anda pilih.")}</p>
    </section>
    <section className="bg-[#e8e4dc] py-16 md:py-24" aria-label={t("Panduan kebutuhan tiga langkah")}><div className="site-shell"><h2 className="display-md max-w-3xl">{t("Belum tahu tipe yang cocok?")}</h2><p className="mt-5 mb-10 max-w-xl text-steel-dark">{t("Pilih pekerjaan, penggerak, dan informasi yang Anda perlukan. Kami siapkan draf konsultasinya.")}</p><NeedsGuide /></div></section>
    <section className="site-shell grid gap-10 py-16 md:py-24 lg:grid-cols-12"><h2 className="display-md lg:col-span-4">{t("Sebelum memesan.")}</h2><div className="lg:col-span-7 lg:col-start-6"><Faq items={generalFaq.slice(0, 3)} /></div></section>
  </>;
}
