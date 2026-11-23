import { ArrowUpRight, Camera, CheckCircle2, FileBox, MessageSquareText, Play, Video } from "lucide-react";
import { Link } from "../components/LocalizedLink";
import InquiryLink from "../components/InquiryLink";
import { PageHero, TextLink } from "../components/PageElements";
import { Reveal, SectionIntro } from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../i18n/LanguageContext";
import { FACEBOOK_URL, TIKTOK_URL } from "../lib/inquiry";

const evidence = [
  { icon: Camera, title: "Foto asli multi-sudut", status: "Foto pemilik tersedia", text: "Foto pemilik sudah tersedia pada galeri referensi. Setiap foto asli dibedakan dari visualisasi; model dan ukuran final tetap dikonfirmasi." },
  { icon: Video, title: "Video demonstrasi per unit", status: "Belum ditautkan", text: "Kanal TikTok tersedia sebagai sumber sosial. Video baru masuk tab produk setelah unit, isi demo, dan URL-nya dikonfirmasi." },
  { icon: FileBox, title: "Model GLB terverifikasi", status: "Belum tersedia", text: "Tiga studi GLB bentuk luar sudah tersedia sebagai referensi. Ukuran belum diukur dan tidak ada model yang berstatus geometri terverifikasi." },
  { icon: CheckCircle2, title: "Hasil uji kapasitas", status: "Belum ada data", text: "Kapasitas dan performa tidak ditampilkan. Minta pengujian dengan bahan Anda bila hal tersebut menjadi syarat pembelian." },
];

export default function Workshop() {
  const { products, t } = useContent();
  return <>
    <Seo title={t("Bengkel & bukti produksi")} description={t("Lihat status dokumentasi bengkel HCBTECH, galeri visualisasi berlabel, kanal sosial pemilik, dan cara meminta bukti produksi atau demo mesin yang relevan.")} path="/bengkel" />
    <PageHero number="02" eyebrow={t("Bengkel & bukti produksi")} title={t("Lihat prosesnya. Periksa buktinya.")} description={t("Halaman ini membedakan dokumentasi asli, visualisasi katalog, dan data yang belum tersedia. Untuk keputusan teknis, minta media yang sesuai dengan unit dan kebutuhan Anda.")} aside={<InquiryLink className="btn btn-dark" label="Minta dokumentasi unit" />} />

    <section className="site-shell pb-20 md:pb-32" id="standar-media">
      <SectionIntro number="01" eyebrow={t("Daftar status media")} title={t("Tidak ada bukti palsu di antara foto.")} />
      <div className="mt-12 grid border-t hairline md:grid-cols-2">
        {evidence.map((item, index) => <Reveal key={item.title} delay={index * .07} className="border-b hairline py-8 md:odd:border-r md:odd:pr-10 md:even:pl-10"><div className="flex items-start justify-between gap-5"><item.icon size={27} strokeWidth={1.25} /><span className="mono text-right text-industrial">{t(item.status)}</span></div><h3 className="mt-10 text-xl font-medium">{t(item.title)}</h3><p className="mt-4 max-w-lg text-sm leading-relaxed text-steel-dark">{t(item.text)}</p></Reveal>)}
      </div>
    </section>

    <section className="border-y hairline bg-[#e8e4dc] py-20 md:py-32">
      <div className="site-shell"><SectionIntro number="02" eyebrow={t("Pratinjau visual")} title={t("Foto asli dan visualisasi, masing-masing berlabel.")} body={t("Gunakan galeri ini untuk membahas tata letak dan komponen. Jangan menggunakannya sebagai bukti unit selesai, hasil uji, atau dimensi produksi.")} />
        <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{products.map((product, index) => <Reveal key={product.id} delay={(index % 3) * .06}><Link to={`/mesin/${product.slug}`} className="group block"><div className="relative aspect-[4/4.4] overflow-hidden bg-ivory"><img src={product.posterImage} alt={product.gallery[0].alt} loading="lazy" width={product.gallery[0].width ?? 768} height={product.gallery[0].height ?? 960} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><span className="media-label absolute left-3 top-3">{t(product.gallery[0].kind === "original-photo" ? "Foto asli" : "Visualisasi")}</span></div><div className="flex items-start justify-between gap-4 border-t hairline py-4"><div><p className="mono mb-2 text-steel-dark">{product.id} / {product.familyLabel}</p><h3 className="font-medium leading-tight">{product.name}</h3></div><ArrowUpRight size={18} className="mt-1 shrink-0" /></div></Link></Reveal>)}</div>
      </div>
    </section>

    <section className="section-space site-shell">
      <SectionIntro number="03" eyebrow={t("Sumber sosial resmi")} title={t("Dokumentasi pemilik tetap berada di kanal aslinya.")} body={t("Tautan berikut menuju profil yang diberikan pemilik. HCBTECH tidak mengambil caption sosial sebagai spesifikasi produk tanpa pemeriksaan.")} />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Reveal><a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="group flex min-h-[320px] flex-col justify-between bg-graphite p-7 text-ivory md:p-10"><MessageSquareText size={34} strokeWidth={1.2} /><div><p className="mono mb-4 text-ivory/50">{t("Facebook / sumber yang diberikan")}</p><h3 className="title-lg">Anto Nugraha</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/60">{t("Buka profil untuk melihat unggahan yang tersedia. Untuk penawaran, kembali dengan kode referensi produk agar konteksnya jelas.")}</p><span className="mono mt-7 inline-flex items-center gap-3 border-b border-ivory/40 pb-2">{t("Buka Facebook")}<ArrowUpRight size={15} /></span></div></a></Reveal>
        <Reveal delay={.08}><a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="group flex min-h-[320px] flex-col justify-between bg-industrial p-7 text-white md:p-10"><Play size={34} strokeWidth={1.2} /><div><p className="mono mb-4 text-white/60">{t("TikTok / kanal video")}</p><h3 className="title-lg">@mangatto_cees</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{t("Tonton video pada kanal aslinya. Video belum diklaim sebagai demonstrasi model katalog tertentu.")}</p><span className="mono mt-7 inline-flex items-center gap-3 border-b border-white/40 pb-2">{t("Buka TikTok")}<ArrowUpRight size={15} /></span></div></a></Reveal>
      </div>
    </section>

    <section className="border-t hairline bg-graphite py-20 text-ivory md:py-28"><div className="site-shell grid gap-12 lg:grid-cols-12"><Reveal className="lg:col-span-5"><p className="mono mb-6 text-ivory/50"><span className="text-industrial">04</span> / {t("Permintaan yang lebih berguna")}</p><h2 className="display-md">{t("Minta bukti yang menjawab risiko Anda.")}</h2></Reveal><Reveal className="lg:col-span-6 lg:col-start-7"><ol className="border-t hairline-light">{[
      ["01", "Foto unit aktual", "Minta foto unit yang akan ditawarkan dari depan, belakang, sisi transmisi, dan saluran keluar."],
      ["02", "Detail material", "Tanyakan close-up housing, rangka, las, bearing, serta bagian yang menyentuh bahan."],
      ["03", "Demo dengan konteks", "Jika video demo penting, tentukan bahan, kondisi awal, hasil yang ingin dilihat, dan unit yang direkam."],
      ["04", "Ukuran & pemasangan", "Minta dimensi tertulis dan bahas ruang kerja, sumber daya, akses bongkar, serta posisi operator."],
    ].map(([number, title, text]) => <li key={number} className="grid gap-3 border-b hairline-light py-6 md:grid-cols-12"><span className="mono text-industrial md:col-span-2">{number}</span><h3 className="font-medium md:col-span-4">{t(title)}</h3><p className="text-sm leading-relaxed text-ivory/55 md:col-span-6">{t(text)}</p></li>)}</ol><div className="mt-8"><TextLink to="/kontak" external={false}>{t("Siapkan permintaan dokumentasi")}</TextLink></div></Reveal></div></section>
  </>;
}
