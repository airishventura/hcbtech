import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "./LocalizedLink";
import type { DriveType, Product } from "../data/products";
import { useContent } from "../i18n/LanguageContext";
import InquiryLink from "./InquiryLink";
import { getWhatsAppNumber } from "../lib/inquiry";

type CategoryChoice = Product["category"] | "unknown";
type DriveChoice = DriveType | "unknown";
type Intent = "price" | "evidence" | "custom" | "demo";

interface Answers { category?: CategoryChoice; drive?: DriveChoice; intent?: Intent; }

const intentLabels: Record<Intent, string> = {
  price: "Harga dan cakupan unit",
  evidence: "Foto unit dan dokumentasi",
  custom: "Penyesuaian atau fabrikasi",
  demo: "Demo dan spesifikasi",
};

const steps = [
  {
    eyebrow: "Jenis mesin",
    title: "Mana yang paling mendekati bayangan Anda?",
    description: "Pilih pekerjaan yang ingin Anda lakukan dengan mesin.",
    key: "category" as const,
    options: [
      { value: "kupas-batok-kelapa", label: "Kupas batok", text: "Lihat pilihan Ampar, Duduk, dan Berdiri." },
      { value: "parut-kelapa", label: "Parut kelapa", text: "Lihat pilihan Mini, Berdiri, dan Jumbo." },
      { value: "peras-santan", label: "Peras santan", text: "Lihat pilihan Mini A10, A11, A22, dan A33." },
      { value: "unknown", label: "Belum tahu", text: "Mulai dari kebutuhan kerja tanpa memilih model terlebih dahulu." },
    ],
  },
  {
    eyebrow: "Preferensi penggerak",
    title: "Penggerak apa yang ingin Anda bahas?",
    description: "Ini adalah preferensi awal. Daya, merek, dan kesesuaiannya tetap dikonfirmasi.",
    key: "drive" as const,
    options: [
      { value: "listrik", label: "Motor listrik", text: "Ingin membahas konfigurasi dengan motor listrik." },
      { value: "engine", label: "Engine", text: "Ingin membahas konfigurasi dengan engine." },
      { value: "unknown", label: "Minta masukan", text: "Jelaskan kondisi kerja melalui WhatsApp terlebih dahulu." },
    ],
  },
  {
    eyebrow: "Tujuan percakapan",
    title: "Apa yang paling Anda butuhkan sekarang?",
    description: "Kami akan memasukkan tujuan ini ke dalam draf WhatsApp agar Anda tidak perlu mengetik ulang.",
    key: "intent" as const,
    options: [
      { value: "price", label: "Harga & cakupan", text: "Tanyakan harga, komponen yang termasuk, dan ketersediaan." },
      { value: "evidence", label: "Foto & dokumentasi", text: "Minta foto unit aktual atau detail komponen yang ingin diperiksa." },
      { value: "custom", label: "Penyesuaian / fabrikasi", text: "Bahas bentuk, ruang kerja, atau kebutuhan khusus." },
      { value: "demo", label: "Demo & spesifikasi", text: "Tanyakan data teknis dan kemungkinan dokumentasi demo." },
    ],
  },
];

export default function NeedsGuide() {
  const { products, t } = useContent();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const reduced = useReducedMotion();
  const finished = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const currentAnswer = answers[current.key];
  const progress = finished ? 100 : ((step + 1) / steps.length) * 100;

  const result = useMemo(() => {
    const product = answers.category && answers.category !== "unknown"
      ? products.find((item) => item.category === answers.category && (!answers.drive || answers.drive === "unknown" || item.variants.some(variant => variant.drive === answers.drive)))
      : undefined;
    const variant = product && answers.drive && answers.drive !== "unknown"
      ? product.variants.find((item) => item.drive === answers.drive)
      : undefined;
    const categoryText = t(answers.category === "kupas-batok-kelapa" ? "Kupas batok" : answers.category === "parut-kelapa" ? "Parut kelapa" : answers.category === "peras-santan" ? "Peras santan" : "Belum memilih bentuk");
    const driveText = t(answers.drive === "listrik" ? "Motor listrik" : answers.drive === "engine" ? "Engine" : "Minta masukan penggerak");
    const intentText = t(answers.intent ? intentLabels[answers.intent] : "Konsultasi kebutuhan");
    const message = t("Saya menggunakan panduan kebutuhan di situs HCBTECH.\nBentuk: {category}.\nPenggerak: {drive}.\nTujuan: {intent}.\n\nMohon bantu konfirmasi kesesuaian dan informasi yang masih diperlukan. Saya memahami panduan ini hanya titik awal, bukan rekomendasi teknis.", { category: categoryText, drive: driveText, intent: intentText });
    return { product, variant, message, categoryText, driveText, intentText };
  }, [answers, products, t]);

  const reset = () => { setAnswers({}); setStep(0); };
  const choose = (value: string) => setAnswers((currentAnswers) => ({ ...currentAnswers, [current.key]: value }));

  return <div className="grid border-t hairline lg:grid-cols-12">
    <div className="border-b hairline py-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:py-10 lg:pr-10">
      <p className="mono text-steel-dark" aria-live="polite">{finished ? t("Ringkasan pilihan") : t("Langkah {step} dari {total}", { step: step + 1, total: steps.length })}</p>
      <div className="mt-5 h-1 bg-graphite/10" aria-hidden="true"><motion.div className="h-full origin-left bg-industrial" animate={{ width: `${progress}%` }} transition={reduced ? { duration: 0 } : { duration: .35 }} /></div>
      <p className="mt-8 max-w-sm text-sm leading-relaxed text-steel-dark">{t("Tiga pilihan singkat menghasilkan draf yang lebih terarah. Anda dapat kembali, mengubah jawaban, atau membuka detail produk sebelum melanjutkan.")}</p>
      <button type="button" onClick={reset} className="mono mt-7 inline-flex min-h-11 items-center gap-2 text-steel-dark hover:text-industrial" disabled={step === 0 && !answers.category}><RotateCcw size={14} />{t("Ulang dari awal")}</button>
    </div>
    <div className="py-8 lg:col-span-8 lg:py-10 lg:pl-12">
      <AnimatePresence mode="wait" initial={false}>
        {!finished ? <motion.div key={step} initial={reduced ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? undefined : { opacity: 0, x: -16 }} transition={{ duration: .25 }}>
          <p className="mono mb-3 text-industrial">{t(current.eyebrow)}</p>
          <h3 className="title-lg max-w-2xl">{t(current.title)}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel-dark">{t(current.description)}</p>
          <fieldset className="mt-7"><legend className="sr-only">{t(current.title)}</legend><div className="grid gap-2 md:grid-cols-3">{current.options.map((option) => {
            const selected = currentAnswer === option.value;
            return <label key={option.value} className={`relative min-h-[132px] cursor-pointer border p-4 transition-colors ${selected ? "border-graphite bg-graphite text-ivory" : "hairline border hover:border-graphite"}`}>
              <input type="radio" className="sr-only" name={`guide-${current.key}`} value={option.value} checked={selected} onChange={() => choose(option.value)} />
              <span className="flex items-start justify-between gap-3"><span className="font-medium">{t(option.label)}</span><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-ivory bg-industrial" : "border-graphite/30"}`}>{selected && <Check size={12} />}</span></span>
              <span className={`mt-4 block text-xs leading-relaxed ${selected ? "text-ivory/60" : "text-steel-dark"}`}>{t(option.text)}</span>
            </label>;
          })}</div></fieldset>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button type="button" className="btn btn-outline" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft size={15} />{t("Kembali")}</button>
            <button type="button" className="btn btn-dark" onClick={() => setStep((value) => value + 1)} disabled={!currentAnswer}>{step === steps.length - 1 ? t("Lihat ringkasan") : t("Lanjut")}<ArrowRight size={15} /></button>
          </div>
        </motion.div> : <motion.div key="result" initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <p className="mono mb-3 text-industrial">{t("Titik awal percakapan Anda")}</p>
          <h3 className="title-lg">{result.product ? result.product.name : t("Konsultasi tanpa memilih model")}</h3>{result.product?.nameStatus === "draft" && <p className="mono mt-2 text-industrial">{t("Nama model sementara")}</p>}
          <div className="mt-6 grid gap-6 md:grid-cols-5">
            {result.product && <Link to={`/mesin/${result.product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-[#e8e4dc] md:col-span-2"><img src={result.product.posterImage} alt={result.product.gallery[0]?.alt ?? result.product.name} className="h-full w-full object-cover" /><span className="media-label absolute left-3 top-3">{t(result.product.gallery[0]?.kind === "original-photo" ? "Foto asli" : "Visualisasi")}</span></Link>}
            <dl className={`grid gap-4 ${result.product ? "md:col-span-3" : ""}`}>
              <div><dt className="mono text-steel-dark">{t("Bentuk")}</dt><dd className="mt-1 text-sm font-medium">{result.categoryText}</dd></div>
              <div><dt className="mono text-steel-dark">{t("Penggerak")}</dt><dd className="mt-1 text-sm font-medium">{result.driveText}</dd></div>
              <div><dt className="mono text-steel-dark">{t("Tujuan")}</dt><dd className="mt-1 text-sm font-medium">{result.intentText}</dd></div>
            </dl>
          </div>
          <p className="mt-6 border-l-2 border-industrial pl-4 text-sm leading-relaxed text-steel-dark">{t("Hasil ini mencocokkan preferensi dengan referensi katalog. Ini bukan penilaian kesesuaian bahan, kapasitas, atau performa.")}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><InquiryLink product={result.product} variant={result.variant} message={result.message} className="btn btn-red flex-1" label={getWhatsAppNumber() ? "Lanjut di WhatsApp" : "Lanjut ke formulir kontak"} />{result.product && <Link to={`/mesin/${result.product.slug}`} className="btn btn-outline">{t("Periksa detail dulu")}<ArrowRight size={15} /></Link>}<button type="button" className="btn btn-outline" onClick={() => setStep(steps.length - 1)}>{t("Ubah pilihan")}</button></div>
        </motion.div>}
      </AnimatePresence>
    </div>
  </div>;
}
