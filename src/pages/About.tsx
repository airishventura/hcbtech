import { ArrowDownToLine, Box, FileCheck2, Layers3, Ruler } from "lucide-react";
import Faq from "../components/Faq";
import InquiryLink from "../components/InquiryLink";
import { PageHero } from "../components/PageElements";
import { Reveal, SectionIntro } from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../i18n/LanguageContext";

const scopeRows = [
  ["Rangka & dudukan", "Profil, tata letak, akses bongkar, ruang pemasangan", "Foto ruang dan ukuran batas"],
  ["Housing & cover", "Akses buka, engsel, penguncian, kemudahan bersih", "Bahan proses dan kebutuhan kontak"],
  ["Hopper & chute", "Arah masuk/keluar, posisi wadah, tinggi kerja", "Foto alur kerja dan wadah"],
  ["Penggerak & transmisi", "Listrik/engine, gearbox, poros, bearing, belt", "Kondisi sumber daya dan target kerja"],
  ["Pelindung & operasi", "Guard, akses operator, area bergerak, prosedur", "Risiko dan cara penggunaan unit"],
];

export default function About() {
  const { services, principles, generalFaq, t } = useContent();
  return <>
    <Seo title={t("Tentang & layanan fabrikasi")} description={t("Tentang pendekatan HCBTECH dalam machining dan fabrikasi: pembahasan kebutuhan, rangka, housing, sheet metal, penggerak, dan dokumentasi teknis yang transparan.")} path="/tentang" faqs={generalFaq} />
    <PageHero number="03" eyebrow={t("Tentang HCBTECH")} title={t("Teknik yang dimulai dengan mendengar pekerjaan.")} description={t("HCBTECH menyajikan usaha machining dan fabrikasi melalui katalog yang dapat diperiksa. Fokusnya bukan membuat klaim sebanyak-banyaknya, melainkan membantu pelanggan menjelaskan kebutuhan dan meminta data yang tepat.")} aside={<InquiryLink className="btn btn-dark" label="Bicarakan fabrikasi" />} />

    <section className="site-shell pb-20 md:pb-32"><div className="grid gap-10 border-t hairline pt-6 lg:grid-cols-12"><Reveal className="lg:col-span-4"><p className="mono text-steel-dark"><span className="text-industrial">01</span> / {t("Pendekatan")}</p></Reveal><Reveal className="lg:col-span-8"><h2 className="display-md max-w-5xl">{t("Mesin bukan sekadar bentuk luar. Tetapi bentuk yang jelas membuat percakapan lebih mudah.")}</h2><div className="mt-10 grid gap-7 md:grid-cols-2"><p className="body-lg text-steel-dark">{t("Katalog mengelompokkan referensi menjadi piringan-gearbox dan drum tertutup. Pengelompokan ini sementara, berdasarkan pengamatan visual, dan tidak menetapkan fungsi mesin sebelum pemilik mengonfirmasi.")}</p><p className="text-sm leading-relaxed text-steel-dark">{t("Informasi tahun berdiri, badan usaha, jumlah tim, alamat, sertifikasi, dan fasilitas bengkel belum dicantumkan karena datanya belum diberikan. Situs tidak mengisi bagian tersebut dengan cerita rekaan.")}</p></div></Reveal></div></section>

    <section className="border-y hairline bg-[#e8e4dc] py-20 md:py-28"><div className="site-shell"><SectionIntro number="02" eyebrow={t("Layanan")} title={t("Ruang lingkup yang dapat dibawa ke meja diskusi.")} body={t("Daftar ini menjelaskan jenis pekerjaan yang dapat dikonsultasikan, bukan janji bahwa setiap desain dapat dikerjakan tanpa pemeriksaan.")} /><div className="mt-12 grid gap-px bg-graphite/15 md:grid-cols-2">{services.map((service, index) => <Reveal key={service.number} delay={index * .06} className="bg-[#e8e4dc] p-6 md:p-9"><span className="mono text-industrial">{service.number}</span><h3 className="title-lg mt-12">{service.title}</h3><p className="mt-5 text-sm leading-relaxed text-steel-dark">{service.description}</p><p className="mono mt-6 border-t hairline pt-4 text-steel-dark">{service.scope}</p></Reveal>)}</div></div></section>

    <section className="section-space site-shell"><SectionIntro number="03" eyebrow={t("Lingkup teknik")} title={t("Data yang perlu ada sebelum bentuk menjadi pekerjaan.")} /><Reveal className="mt-12 overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><caption className="sr-only">{t("Lingkup fabrikasi dan informasi yang dibutuhkan")}</caption><thead><tr className="border-y hairline"><th className="mono py-4 pr-5 font-normal text-steel-dark">{t("Komponen")}</th><th className="mono py-4 pr-5 font-normal text-steel-dark">{t("Yang dibicarakan")}</th><th className="mono py-4 font-normal text-steel-dark">{t("Data awal dari pelanggan")}</th></tr></thead><tbody>{scopeRows.map((row) => <tr key={row[0]} className="border-b hairline"><th scope="row" className="py-5 pr-5 text-base font-medium">{t(row[0])}</th><td className="py-5 pr-5 text-sm leading-relaxed text-steel-dark">{t(row[1])}</td><td className="py-5 text-sm leading-relaxed text-steel-dark">{t(row[2])}</td></tr>)}</tbody></table></Reveal></section>

    <section className="bg-graphite py-20 text-ivory md:py-32"><div className="site-shell"><SectionIntro number="04" eyebrow={t("Standar media & 3D")} title={t("Model harus mengikuti bukti, bukan sebaliknya.")} light body={t("Pipeline disiapkan agar file sumber, komponen, dan status akurasi dapat diaudit. Sampai pengukuran dan verifikasi selesai, viewer tetap disebut aproksimasi.")} /><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{[
      { icon: Ruler, title: "Referensi & ukuran", text: "Foto multi-sudut, satu foto berskala, dimensi utama, dan identitas unit dicatat sebelum modeling." },
      { icon: Layers3, title: "Komponen terpisah", text: "Frame, guard, motor, shaft, gearbox, chute, dan housing dibuat sebagai objek bermakna, bukan satu mesh generik." },
      { icon: Box, title: "Ekspor efisien", text: "GLB diekspor dengan transformasi yang benar, material wajar, kompresi mesh, dan ukuran tekstur terkendali." },
      { icon: FileCheck2, title: "Verifikasi visual", text: "Overlay multi-sudut dan pemeriksaan pemilik diperlukan sebelum status modelAccuracy dapat diubah." },
    ].map((item, index) => <Reveal key={item.title} delay={index * .07} className="border-t hairline-light pt-5"><item.icon size={27} strokeWidth={1.2} /><span className="mono mt-8 block text-industrial">0{index + 1}</span><h3 className="mt-3 text-xl font-medium">{t(item.title)}</h3><p className="mt-4 text-sm leading-relaxed text-ivory/55">{t(item.text)}</p></Reveal>)}</div><Reveal className="mt-12 flex flex-col gap-5 border-t hairline-light pt-6 md:flex-row md:items-center md:justify-between"><p className="max-w-xl text-sm leading-relaxed text-ivory/55">{t("Instruksi Blender lengkap, penamaan komponen, ekspor GLB, dan checklist akurasi tersedia sebagai dokumen proyek.")}</p><a href="/docs/blender-pipeline.md" download className="btn btn-outline-light"><ArrowDownToLine size={16} />{t("Unduh pipeline Blender")}</a></Reveal></div></section>

    <section className="section-space site-shell"><SectionIntro number="05" eyebrow={t("Prinsip kerja")} title={t("Tiga aturan sederhana untuk katalog yang dapat dipercaya.")} /><div className="mt-12 grid gap-8 md:grid-cols-3">{principles.map((principle, index) => <Reveal key={principle.title} delay={index * .08} className="border-t hairline pt-5"><span className="mono text-industrial">0{index + 1}</span><h3 className="mt-10 text-xl font-medium">{principle.title}</h3><p className="mt-4 text-sm leading-relaxed text-steel-dark">{principle.description}</p></Reveal>)}</div></section>

    <section className="site-shell grid gap-10 pb-24 md:pb-36 lg:grid-cols-12"><Reveal className="lg:col-span-4"><p className="mono mb-5 text-steel-dark"><span className="text-industrial">06</span> / FAQ</p><h2 className="display-md">{t("Pertanyaan yang wajar.")}</h2></Reveal><Reveal className="lg:col-span-8"><Faq items={generalFaq} /></Reveal></section>
  </>;
}
