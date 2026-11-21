import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, MessagesSquare, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Faq from "../components/Faq";
import InquiryLink from "../components/InquiryLink";
import NeedsGuide from "../components/NeedsGuide";
import ProductCard from "../components/ProductCard";
import { Reveal, SectionIntro } from "../components/Reveal";
import Seo from "../components/Seo";
import { TextLink } from "../components/PageElements";
import type { Product } from "../data/products";
import { useContent, useLanguage } from "../i18n/LanguageContext";
import { FACEBOOK_URL, TIKTOK_URL } from "../lib/inquiry";
import { duration, easeOut } from "../lib/motion";

function Hero({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.28]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imageX = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const titleY = useTransform(scrollYProgress, [0, .8], [0, -110]);
  const titleOpacity = useTransform(scrollYProgress, [0, .75], [1, 0]);
  const metaOpacity = useTransform(scrollYProgress, [0, .35], [1, 0]);
  const product = products[2];

  return (
    <section ref={ref} className={`relative ${reduced ? "h-[100svh]" : "h-[145svh]"} bg-graphite text-ivory`} aria-labelledby="hero-title">
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden pt-[var(--header-height)]">
        <motion.div className="absolute inset-0" style={reduced ? undefined : { scale: imageScale, y: imageY, x: imageX }} initial={reduced ? false : { clipPath: "inset(0 0 0 100%)" }} animate={{ clipPath: "inset(0 0 0 0%)" }} transition={{ duration: duration.hero + .2, ease: easeOut }}>
          <motion.img src="/images/visual-disc-hero.webp" alt={t("Visualisasi unit piringan, gearbox, dan transmisi belt pada rangka baja")} width="1568" height="784" fetchPriority="high" initial={reduced ? false : { scale: 1.1, opacity: .55 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: duration.hero + .35, delay: .12, ease: easeOut }} className="h-full w-full object-cover object-[68%_center] md:object-center" />
          <div className="absolute inset-0 bg-graphite/55 md:bg-graphite/10" />
        </motion.div>
        <div className="site-shell relative flex h-full flex-col justify-between pb-7 pt-8 md:pb-9 md:pt-12">
          <motion.div style={reduced ? undefined : { y: titleY, opacity: titleOpacity }} className="max-w-[1050px]">
            <motion.div initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: duration.transition }} className="mb-7 flex items-center gap-4">
              <span className="red-rule" /><p className="mono text-ivory/75">{t("Katalog mesin & fabrikasi / Indonesia")}</p>
            </motion.div>
            <h1 id="hero-title" className="display-xl max-w-[9ch]">
              {["Mesin yang dibuat", "untuk kerja nyata"].map((line, index) => <span key={line} className="block overflow-hidden pb-[.08em]"><motion.span className="block" initial={reduced ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: duration.hero, delay: .32 + index * .12, ease: easeOut }}>{t(line)}</motion.span></span>)}
            </h1>
            <motion.div initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .78, duration: duration.reveal, ease: easeOut }} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={`/mesin/${product.slug}`} className="btn btn-red">{t("Lihat mesin unggulan")}<ArrowRight size={16} /></Link>
              <Link to="/mesin" className="btn btn-outline-light">{t("Buka semua mesin")}<ArrowUpRight size={16} /></Link>
            </motion.div>
          </motion.div>
          <motion.div style={reduced ? undefined : { opacity: metaOpacity }} className="grid grid-cols-2 items-end gap-5 border-t hairline-light pt-4 md:grid-cols-12">
            <div className="md:col-span-3"><p className="mono mb-2 text-ivory/45">{t("Model unggulan / {id}", { id: product.id })}</p><Link to={`/mesin/${product.slug}`} className="text-sm font-medium hover:text-industrial">{product.name}</Link></div>
            <div className="md:col-span-3"><p className="mono mb-2 text-ivory/45">{t("Status media")}</p><p className="text-sm">{t("Visualisasi, bukan foto asli")}</p></div>
            <div className="col-span-2 hidden md:col-span-4 md:block"><p className="mono text-ivory/45">{t("Nama model sementara · harga & spesifikasi melalui konfirmasi")}</p></div>
            <div className="col-span-2 flex justify-end md:col-span-2"><span className="mono flex items-center gap-3 text-ivory/60">{t("Gulir")} <motion.span animate={reduced ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}><ArrowDown size={15} /></motion.span></span></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AssemblyScene() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => setStage(Math.min(2, Math.floor(value * 3))));
  const clip = useTransform(scrollYProgress, [0, .65], ["inset(18% 28% 18% 28%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(scrollYProgress, [0, .7], [.78, 1]);
  const frameOneX = useTransform(scrollYProgress, [0, .55], [-180, 0]);
  const frameTwoX = useTransform(scrollYProgress, [0, .55], [180, 0]);
  const frameThreeY = useTransform(scrollYProgress, [0, .55], [150, 0]);
  const rotateOne = useTransform(scrollYProgress, [0, .55], [-8, 0]);
  const rotateTwo = useTransform(scrollYProgress, [0, .55], [7, 0]);
  const stages = [
    { title: "Rangka menentukan tata letak", text: "Posisi dudukan, arah saluran, dan ruang perawatan dibicarakan lebih dulu. Ukuran aktual tetap memerlukan data unit." },
    { title: "Penggerak mengikuti kondisi kerja", text: "Motor listrik atau engine adalah pilihan kebutuhan, bukan sekadar penggantian visual. Daya dan transmisi harus dicocokkan." },
    { title: "Housing melengkapi konfigurasi", text: "Cover, corong, akses buka, dan pelindung disusun sebagai satu kesepakatan kerja—bukan asumsi dari tampilan luar." },
  ];
  return (
    <section ref={ref} className={`${reduced ? "" : "h-[270svh]"} relative bg-graphite text-ivory`}>
      <div className={`${reduced ? "relative py-24" : "sticky top-0 h-[100svh] min-h-[680px]"} overflow-hidden pt-[var(--header-height)]`}>
        <div className="site-shell grid h-full content-center gap-8 py-8 lg:grid-cols-12 lg:items-center">
          <div className="relative z-10 lg:col-span-5">
            <p className="mono mb-6 text-ivory/50"><span className="text-industrial">05</span> / {t("Cara membaca mesin")}</p>
            <h2 className="text-[clamp(2.4rem,4.5vw,5.2rem)] leading-[.95] tracking-[-.055em]">{t("Satu kebutuhan.")}<br />{t("Banyak keputusan.")}</h2>
            <div className="mt-8 min-h-[160px] border-l-2 border-industrial pl-5">
              <p className="mono mb-3 text-industrial">0{stage + 1} / 03</p>
              <h3 className="text-xl font-medium">{t(stages[stage].title)}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/60">{t(stages[stage].text)}</p>
            </div>
            <div className="mt-5 flex gap-1" role="group" aria-label="Pilih tahap pembahasan">{stages.map((item, index) => <button key={item.title} type="button" onClick={() => setStage(index)} aria-pressed={stage === index} aria-label={t("Tahap {index}: {title}", { index: index + 1, title: t(item.title) })} className="flex h-11 min-w-11 items-center px-1"><span className={`h-1 transition-all duration-500 ${stage === index ? "w-12 bg-industrial" : "w-7 bg-ivory/25"}`} /></button>)}</div>
          </div>
          <div className="relative mx-auto aspect-[4/4.4] w-full max-w-[520px] lg:col-span-7">
            <motion.div style={reduced ? undefined : { clipPath: clip, scale }} className="absolute inset-0 overflow-hidden bg-[#e8e4dc]">
              <img src="/images/visual-disc-electric.webp" alt={t("Visualisasi komponen rangka, motor, gearbox, piringan, dan saluran keluar")} loading="lazy" width="768" height="960" className="h-full w-full object-cover" />
              <span className="media-label absolute bottom-4 left-4">{t("Aproksimasi visual")}</span>
            </motion.div>
            <motion.div style={reduced ? undefined : { x: frameOneX, rotate: rotateOne }} className="pointer-events-none absolute inset-5 border border-ivory/50" />
            <motion.div style={reduced ? undefined : { x: frameTwoX, rotate: rotateTwo }} className="pointer-events-none absolute inset-10 border border-industrial/80" />
            <motion.div style={reduced ? undefined : { y: frameThreeY }} className="pointer-events-none absolute inset-x-16 inset-y-2 border-x border-ivory/30" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { products, services, processSteps, principles, generalFaq, t } = useContent();
  const homeFaqs = generalFaq.slice(0, 5);
  const featured = products.filter((product) => product.featured);
  return (
    <>
      <Seo title={t("Mesin yang dibuat untuk kerja nyata")} description={t("Katalog interaktif mesin dan fabrikasi HCBTECH Indonesia. Lihat konfigurasi piringan-gearbox dan drum tertutup, pilih penggerak, lalu minta penawaran sesuai kebutuhan.")} path="/" faqs={homeFaqs} />
      <Hero products={products} />

      <section className="border-b hairline bg-ivory" aria-labelledby="quick-answers-title">
        <div className="site-shell grid gap-8 py-10 lg:grid-cols-12 lg:py-12">
          <div className="lg:col-span-3"><p className="mono text-industrial">{t("Jawaban cepat")}</p><h2 id="quick-answers-title" className="mt-3 text-xl font-medium leading-tight">{t("Informasi penting, tanpa perlu mencari.")}</h2></div>
          <dl className="grid gap-7 md:grid-cols-3 lg:col-span-9">
            <div><dt className="mono mb-3 text-steel-dark">{t("Apa yang tersedia?")}</dt><dd className="text-sm leading-relaxed">{t("Enam konfigurasi referensi piringan-gearbox dan drum tertutup, dengan pilihan penggerak untuk dikonfirmasi.")}</dd></div>
            <div><dt className="mono mb-3 text-steel-dark">{t("Berapa harganya?")}</dt><dd className="text-sm leading-relaxed">{t("Belum ada harga terverifikasi. Pilih varian lalu minta penawaran resmi melalui WhatsApp.")}</dd></div>
            <div><dt className="mono mb-3 text-steel-dark">{t("Bagaimana memulai?")}</dt><dd className="text-sm leading-relaxed">{t("Gunakan panduan tiga langkah atau pilih mesin. Draf WhatsApp terisi otomatis dan Anda memeriksanya sebelum mengirim.")}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section-space site-shell">
        <SectionIntro number="01" eyebrow={t("Koleksi pilihan")} title={t("Bentuk yang bisa dilihat. Detail yang harus ditanyakan.")} body={t("Enam konfigurasi referensi membantu memulai diskusi. Nama model masih sementara dan setiap spesifikasi teknis perlu dikonfirmasi sebelum penawaran.")} />
        <div className="mt-14 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => <Reveal key={product.id} delay={index * .08}><ProductCard product={product} index={products.indexOf(product)} /></Reveal>)}
        </div>
        <Reveal className="mt-14 flex justify-end"><TextLink to="/mesin">{t("Lihat semua 6 konfigurasi")}</TextLink></Reveal>
      </section>

      <section className="border-y hairline bg-[#e8e4dc] py-20 md:py-28" aria-label={t("Panduan kebutuhan tiga langkah")}>
        <div className="site-shell">
          <SectionIntro number="02" eyebrow={t("Panduan kebutuhan")} title={t("Belum yakin mulai dari mana? Tiga pilihan sudah cukup.")} body={t("Jawab sesuai yang Anda ketahui. Hasilnya adalah titik awal percakapan dan draf WhatsApp—bukan rekomendasi otomatis tentang fungsi atau performa mesin.")} />
          <Reveal className="mt-12"><NeedsGuide /></Reveal>
        </div>
      </section>

      <section className="border-b hairline bg-[#e8e4dc]">
        <div className="site-shell grid lg:grid-cols-12">
          <Reveal className="py-16 lg:col-span-5 lg:py-24">
            <p className="mono mb-7 text-steel-dark"><span className="text-industrial">03</span> / {t("Prinsip katalog")}</p>
            <h2 className="display-md">{t("Tidak semua yang terlihat boleh dianggap pasti.")}</h2>
          </Reveal>
          <div className="lg:col-span-7 lg:border-l hairline lg:pl-12">
            {principles.map((principle, index) => <Reveal key={principle.title} delay={index * .08} className="grid gap-3 border-t hairline py-8 md:grid-cols-12 lg:py-10"><span className="mono text-industrial md:col-span-2">0{index + 1}</span><h3 className="text-xl font-medium md:col-span-4">{principle.title}</h3><p className="text-sm leading-relaxed text-steel-dark md:col-span-6">{principle.description}</p></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section-space site-shell">
        <SectionIntro number="04" eyebrow={t("Layanan fabrikasi")} title={t("Dari rangka sampai saluran keluar, dibicarakan sebagai satu sistem.")} body={t("Ruang lingkup berikut adalah titik awal konsultasi. Pekerjaan aktual mengikuti pemeriksaan kebutuhan dan kesepakatan tertulis.")} />
        <div className="mt-14 grid border-t hairline md:grid-cols-2">
          {services.map((service, index) => <Reveal key={service.number} delay={index * .06} className="group border-b hairline p-0 md:odd:border-r md:p-8 lg:p-10"><div className="py-8 md:py-0"><div className="mb-12 flex items-center justify-between"><span className="mono text-industrial">{service.number}</span><ArrowUpRight size={19} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><h3 className="title-lg max-w-sm">{service.title}</h3><p className="mt-5 max-w-lg text-sm leading-relaxed text-steel-dark">{service.description}</p><p className="mono mt-7 text-steel-dark">{service.scope}</p></div></Reveal>)}
        </div>
      </section>

      <AssemblyScene />

      <section className="section-space site-shell">
        <SectionIntro number="06" eyebrow={t("Alur produksi")} title={t("Lima tahap sebelum sebuah unit disepakati.")} />
        <div className="mt-14 border-t hairline">
          {processSteps.map((step, index) => <Reveal key={step.number} delay={index * .04} className="grid gap-4 border-b hairline py-7 md:grid-cols-12 md:items-start"><span className="mono text-industrial md:col-span-1">{step.number}</span><h3 className="text-xl font-medium md:col-span-3">{step.title}</h3><p className="text-sm leading-relaxed text-steel-dark md:col-span-6">{step.description}</p><p className="mono md:col-span-2 md:text-right">{step.output}</p></Reveal>)}
        </div>
      </section>

      <section className="section-space border-t hairline bg-[#e8e4dc]">
        <div className="site-shell">
          <SectionIntro number="07" eyebrow={t("Bengkel & dokumentasi")} title={t("Bukti kerja harus tetap terlihat sebagai bukti kerja.")} body={t("Berkas foto asli pemilik belum tersedia di direktori proyek. Karena itu galeri di bawah adalah pratinjau visualisasi, sedangkan dokumentasi sosial resmi ditautkan apa adanya.")} />
          <div className="mt-12 grid gap-5 md:grid-cols-12">
            {[products[0], products[3], products[5]].map((product, index) => <Reveal key={product.id} delay={index * .08} className={index === 0 ? "md:col-span-7" : index === 1 ? "md:col-span-5" : "md:col-span-12"}><Link to={`/mesin/${product.slug}`} className={`group relative block overflow-hidden bg-graphite ${index === 2 ? "aspect-[16/7]" : "aspect-[4/3]"}`}><img src={product.posterImage} alt={product.gallery[0].alt} loading="lazy" width="768" height="960" className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${index === 2 ? "object-[center_38%]" : ""}`} /><span className="media-label absolute left-4 top-4">{t("Visualisasi / bukan foto bengkel")}</span><span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 bg-graphite/90 p-4 text-ivory"><span><span className="mono block text-ivory/50">{product.id}</span><span className="mt-1 block font-medium">{product.familyLabel}</span></span><ArrowUpRight size={20} /></span></Link></Reveal>)}
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t hairline pt-6 md:flex-row md:items-center md:justify-between"><p className="max-w-2xl text-sm leading-relaxed text-steel-dark">{t("Untuk melihat unggahan pemilik, kunjungi kanal sosial berikut. HCBTECH tidak menyematkan video sebagai demo produk sampai relasinya dengan unit dikonfirmasi.")}</p><TextLink to="/bengkel">{t("Buka halaman bengkel")}</TextLink></div>
        </div>
      </section>

      <section className="bg-industrial text-white">
        <div className="site-shell grid md:grid-cols-2">
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="group flex min-h-[260px] flex-col justify-between border-b border-white/30 py-8 md:border-b-0 md:border-r md:pr-10"><MessagesSquare size={28} strokeWidth={1.4} /><div><p className="mono mb-3 text-white/65">Facebook / Anto Nugraha</p><p className="title-lg flex items-center justify-between">{t("Lihat unggahan bengkel")} <ArrowUpRight className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" /></p></div></a>
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="group flex min-h-[260px] flex-col justify-between py-8 md:pl-10"><Play size={28} strokeWidth={1.4} /><div><p className="mono mb-3 text-white/65">TikTok / @mangatto_cees</p><p className="title-lg flex items-center justify-between">{t("Buka kanal video")} <ArrowUpRight className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" /></p></div></a>
        </div>
      </section>

      <section className="section-space site-shell grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4"><p className="mono mb-6 text-steel-dark"><span className="text-industrial">08</span> / {t("Pertanyaan umum")}</p><h2 className="display-md">{t("Sebelum Anda bertanya.")}</h2><p className="mt-6 text-sm leading-relaxed text-steel-dark">{t("Jawaban yang belum pasti tidak dibuat terdengar pasti.")}</p><InquiryLink className="btn btn-dark mt-8" label="Tanyakan kebutuhan" /></Reveal>
        <Reveal className="lg:col-span-8"><Faq items={homeFaqs} /></Reveal>
      </section>
    </>
  );
}
