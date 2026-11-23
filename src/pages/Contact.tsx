import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Clipboard, Download, MessageSquareText, Play, RotateCcw, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "../components/LocalizedLink";
import Faq from "../components/Faq";
import { PageHero } from "../components/PageElements";
import { Reveal, SectionIntro } from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../i18n/LanguageContext";
import { buildInquiryMessage, buildWhatsAppUrl, copyText, FACEBOOK_URL, formatWhatsAppNumber, getWhatsAppNumber, TIKTOK_URL } from "../lib/inquiry";
import { legacyProducts } from "../data/legacy-products";
import { localizeProduct } from "../i18n/localize";
import { isRecord, readStored, removeStored, writeStored } from "../lib/storage";

interface Draft { productSlug: string; name: string; city: string; message: string; variantId: string; }
const emptyDraft: Draft = { productSlug: "", name: "", city: "", message: "", variantId: "" };
const quickPrompts = [
  { label: "Foto unit aktual", text: "Mohon foto unit aktual dari beberapa sisi." },
  { label: "Harga & cakupan", text: "Mohon harga, komponen yang termasuk, dan ketersediaan." },
  { label: "Bahan & hasil", text: "Bahan yang diproses: \nHasil yang diinginkan: " },
  { label: "Dimensi & material", text: "Mohon konfirmasi dimensi, material rangka, dan material bagian kontak." },
  { label: "Video demo", text: "Apakah tersedia video demo untuk unit atau konfigurasi ini?" },
];

export default function Contact() {
  const { products, generalFaq, t, language } = useContent();
  const contactFaqs = useMemo(() => generalFaq.slice(0, 4), [generalFaq]);
  const [params] = useSearchParams();
  const [draft, setDraft] = useState<Draft>(() => {
    const stored = readStored("hcbtech-inquiry-draft", {}, isRecord);
    const text = (value: unknown) => typeof value === "string" ? value : "";
    return {
      productSlug: params.get("produk") ?? text(stored.productSlug),
      variantId: params.get("varian") ?? text(stored.variantId),
      name: text(stored.name),
      city: text(stored.city),
      message: params.get("pesan") ?? text(stored.message),
    };
  });
  const [generated, setGenerated] = useState("");
  const [status, setStatus] = useState("");
  const [persistent, setPersistent] = useState(true);
  const legacy = legacyProducts.find(item => item.slug === draft.productSlug);
  const product = products.find((item) => item.slug === draft.productSlug) ?? (legacy ? localizeProduct(legacy, t) : undefined);
  const variant = product?.variants.find((item) => item.id === draft.variantId) ?? product?.variants[0];
  const whatsappConfigured = Boolean(getWhatsAppNumber());
  const directWhatsApp = buildWhatsAppUrl({ message: "Halo HCBTECH, saya ingin berkonsultasi tentang kebutuhan mesin atau fabrikasi." });

  useEffect(() => { setPersistent(writeStored("hcbtech-inquiry-draft", draft)); }, [draft]);
  useEffect(() => {
    if (product && !product.variants.some((item) => item.id === draft.variantId)) {
      const drive = product.driveType === "engine" ? "engine" : "listrik";
      setDraft((current) => ({ ...current, variantId: product.defaultVariantId ?? product.variants.find((item) => item.drive === drive)?.id ?? product.variants[0]?.id ?? "" }));
    }
  }, [product, draft.variantId]);
  useEffect(() => { if (!status) return; const timeout = setTimeout(() => setStatus(""), 4500); return () => clearTimeout(timeout); }, [status]);

  const inquiry = useMemo(() => ({ product, variant, name: draft.name, city: draft.city, message: draft.message, language }), [product, variant, draft.name, draft.city, draft.message, language]);
  const messageText = useMemo(() => buildInquiryMessage(inquiry), [inquiry]);
  const update = (key: keyof Draft, value: string) => { setDraft((current) => ({ ...current, [key]: value })); setGenerated(""); };
  const appendPrompt = (text: string) => {
    if (draft.message.includes(text)) return;
    update("message", `${draft.message.trim()}${draft.message.trim() ? "\n\n" : ""}${text}`.slice(0, 2000));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setGenerated(messageText);
    const url = buildWhatsAppUrl(inquiry);
    if (url) {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      setStatus(opened ? t("WhatsApp dibuka. Pesan belum terkirim sampai Anda menekan tombol kirim di WhatsApp.") : t("Browser memblokir tab baru. Draf sudah dibuat; salin pesan atau coba lagi."));
    } else {
      setStatus(t("Draf penawaran dibuat. Salin atau unduh, lalu kirim melalui kanal kontak resmi."));
      setTimeout(() => document.getElementById("draft-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }
  };

  const copy = async () => {
    try { await copyText(generated || messageText); setStatus(t("Draf berhasil disalin ke clipboard.")); }
    catch { setStatus(t("Tidak dapat menyalin otomatis. Pilih teks pada kotak draf lalu salin manual.")); }
  };
  const download = () => {
    const blob = new Blob([generated || messageText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `penawaran-hcbtech-${product?.id.toLowerCase() ?? "umum"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(t("Draf teks diunduh ke perangkat Anda."));
  };
  const clear = () => { setDraft(emptyDraft); setGenerated(""); removeStored("hcbtech-inquiry-draft"); setStatus(t("Draf lokal dihapus.")); };

  return <>
    <Seo title={t("Kontak & permintaan penawaran")} description={t("Buat permintaan penawaran HCBTECH dengan produk, varian penggerak, kota, dan kebutuhan Anda. WhatsApp aktif bila nomor bisnis dikonfigurasi; draf teks dan Facebook selalu tersedia.")} path="/kontak" faqs={contactFaqs} />
    <PageHero number="04" eyebrow={t("Kontak & penawaran")} title={t("Mulai dengan kebutuhan, bukan tebakan.")} description={t("Pilih referensi, jelaskan bahan dan hasil yang diharapkan, lalu buat pesan yang rapi. Tidak perlu akun. Draf formulir disimpan hanya di perangkat Anda.")} aside={<div className="border-t hairline pt-4"><p className="mono mb-2 text-steel-dark">{t("Kanal penawaran")}</p><p className="text-sm">{whatsappConfigured ? t("WhatsApp {number} + draf teks", { number: formatWhatsAppNumber() }) : t("Draf teks + Facebook resmi")}</p></div>} />

    <section className="site-shell grid gap-14 pb-24 md:pb-36 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Reveal><div className="mb-8 border-t hairline pt-5"><p className="mono text-steel-dark"><span className="text-industrial">01</span> / {t("Formulir kebutuhan")}</p><h2 className="title-lg mt-4">{t("Siapkan permintaan penawaran")}</h2></div>
          <form onSubmit={submit} className="grid gap-7" aria-describedby="form-note">
            <div><label htmlFor="contact-product" className="label">{t("Produk referensi (opsional)")}</label><select id="contact-product" name="product" className="field" value={draft.productSlug} onChange={(event) => { update("productSlug", event.target.value); update("variantId", ""); }}><option value="">{t("Konsultasi mesin / fabrikasi umum")}</option>{legacy && <option value={legacy.slug}>{t(legacy.name)}</option>}{products.map((item) => <option key={item.id} value={item.slug}>{item.id} — {item.name}</option>)}</select></div>
            {product && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}><label htmlFor="contact-variant" className="label">{t("Konfigurasi yang diminati")}</label><select id="contact-variant" name="variant" className="field" value={variant?.id ?? ""} onChange={(event) => update("variantId", event.target.value)}>{product.variants.map((item) => <option key={item.id} value={item.id}>{item.label} — {t("konfirmasi spesifikasi")}</option>)}</select><p className="mt-3 text-xs leading-relaxed text-steel-dark">{variant?.note}</p></motion.div>}
            <div className="grid gap-7 sm:grid-cols-2"><div><label htmlFor="contact-name" className="label">{t("Nama")} <span className="text-industrial">*</span></label><input id="contact-name" name="name" className="field" required autoComplete="name" value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder={t("Nama Anda")} maxLength={100} /></div><div><label htmlFor="contact-city" className="label">{t("Kota pemasangan")}</label><input id="contact-city" name="city" className="field" autoComplete="address-level2" value={draft.city} onChange={(event) => update("city", event.target.value)} placeholder={t("Kota / kabupaten")} maxLength={100} /></div></div>
            <div><div className="flex flex-wrap items-end justify-between gap-3"><label htmlFor="contact-message" className="label">{t("Kebutuhan kerja")}</label><span className="mono mb-2 text-steel-dark">{t("Tambah cepat, lalu edit sesuai kebutuhan")}</span></div><div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t("Tambahkan pertanyaan cepat")}>{quickPrompts.map((prompt) => <button key={prompt.label} type="button" className="mono min-h-11 shrink-0 border hairline px-3 text-left transition-colors hover:border-graphite hover:bg-graphite hover:text-ivory" onClick={() => appendPrompt(t(prompt.text))}>{t(prompt.label)}<span className="ml-2 text-industrial">+</span></button>)}</div><textarea id="contact-message" name="message" className="field min-h-[160px] resize-y" value={draft.message} onChange={(event) => update("message", event.target.value)} placeholder={t("Bahan yang diproses, kondisi awal, hasil yang diinginkan, cara kerja harian, sumber listrik, atau pertanyaan spesifikasi…")} maxLength={2000} /><div className="mt-2 flex justify-between gap-4"><span className="mono text-steel-dark">{t("Jangan kirim data sensitif")}</span><span className="mono text-steel-dark">{draft.message.length}/2000</span></div></div>
            <div id="form-note" className="border-l-2 border-industrial pl-4 text-sm leading-relaxed text-steel-dark">{t("Tidak ada harga atau ketersediaan yang dijamin oleh formulir ini. Semua menunggu jawaban dan penawaran resmi HCBTECH.")}</div>
            {!persistent && <p role="status" className="border-l-2 border-industrial pl-4 text-sm leading-relaxed text-steel-dark">{t("Penyimpanan lokal diblokir browser. Formulir tetap berfungsi, tetapi draf hanya bertahan selama halaman ini terbuka.")}</p>}
            <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" className="btn btn-red flex-1">{whatsappConfigured ? <Send size={16} /> : <MessageSquareText size={16} />}{whatsappConfigured ? t("Buka WhatsApp dengan draf") : t("Buat draf permintaan")}<ArrowUpRight size={16} /></button><button type="button" className="btn btn-outline" onClick={clear}><RotateCcw size={15} />{t("Hapus draf")}</button></div>
          </form>
        </Reveal>

        <AnimatePresence>{generated && <motion.div id="draft-result" className="mt-10 border-t hairline pt-7" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><div className="mb-4 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center bg-industrial text-white"><Check size={16} /></span><div><h3 className="font-medium">{t("Draf siap digunakan")}</h3><p className="mono text-steel-dark">{t("Belum terkirim otomatis")}</p></div></div><label htmlFor="generated-message" className="label">{t("Isi pesan")}</label><textarea id="generated-message" readOnly value={generated} className="field min-h-[250px] resize-y border hairline bg-[#e8e4dc] p-4 font-mono text-xs leading-relaxed" onFocus={(event) => event.currentTarget.select()} /><div className="mt-4 flex flex-col gap-3 sm:flex-row"><button type="button" className="btn btn-dark flex-1" onClick={copy}><Clipboard size={16} />{t("Salin draf")}</button><button type="button" className="btn btn-outline" onClick={download}><Download size={16} />{t("Unduh .txt")}</button></div>{!whatsappConfigured && <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="btn btn-outline mt-3 w-full">{t("Buka Facebook resmi")}<ArrowUpRight size={16} /></a>}</motion.div>}</AnimatePresence>
      </div>

      <aside className="lg:col-span-4 lg:col-start-9"><Reveal delay={.1}><div className="sticky top-[calc(var(--header-height)+32px)]"><p className="mono mb-5 border-t hairline pt-5 text-steel-dark"><span className="text-industrial">02</span> / {t("Kanal resmi")}</p><h2 className="title-lg">{t("Kontak yang benar-benar tersedia.")}</h2>{directWhatsApp && <a href={directWhatsApp} target="_blank" rel="noreferrer" className="group mt-8 flex min-h-[112px] items-center justify-between gap-4 bg-graphite p-5 text-ivory transition-colors hover:bg-industrial"><span><span className="mono block text-ivory/50">{t("WhatsApp / penawaran")}</span><span className="mt-2 block text-lg font-medium">{formatWhatsAppNumber()}</span><span className="mt-1 block text-xs text-ivory/55">{t("Draf umum terisi otomatis")}</span></span><ArrowUpRight size={20} /></a>}<div className="mt-8 border-t hairline"><a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="group flex min-h-[96px] items-center justify-between gap-4 border-b hairline py-5"><span><span className="mono block text-steel-dark">Facebook</span><span className="mt-1 block font-medium">Anto Nugraha</span></span><ArrowUpRight size={19} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a><a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="group flex min-h-[96px] items-center justify-between gap-4 border-b hairline py-5"><span><span className="mono block text-steel-dark">{t("TikTok / dokumentasi")}</span><span className="mt-1 block font-medium">@mangatto_cees</span></span><Play size={19} /></a><div className="border-b hairline py-5"><span className="mono block text-steel-dark">{t("Alamat & jam bengkel")}</span><span className="mt-2 block text-sm">{t("Konfirmasi melalui kontak resmi")}</span><p className="mt-2 text-xs leading-relaxed text-steel-dark">{t("Alamat, email, dan jam operasional belum diberikan sehingga tidak ditampilkan sebagai tebakan.")}</p></div></div><div className="mt-8 bg-graphite p-6 text-ivory"><p className="mono mb-4 text-ivory/50">{t("Sebelum berkunjung")}</p><p className="text-sm leading-relaxed text-ivory/70">{t("Buat janji dan konfirmasi lokasi lebih dulu. Jangan datang berdasarkan alamat yang tidak tercantum resmi.")}</p></div></div></Reveal></aside>
    </section>

    <section className="border-t hairline py-20 md:py-24" aria-label={t("Yang terjadi setelah tombol diklik")}><div className="site-shell"><SectionIntro number="03" eyebrow={t("Setelah tombol diklik")} title={t("Anda tetap memegang kendali atas pesan.")} /><div className="mt-12 grid gap-8 md:grid-cols-3">{[
      ["01", "Draf dibuat", "Produk, varian, kota, dan kebutuhan disusun menjadi pesan. Tidak ada pesan yang dikirim diam-diam."],
      ["02", whatsappConfigured ? "WhatsApp dibuka" : "Draf disalin", whatsappConfigured ? "Periksa kembali nomor tujuan dan seluruh isi pesan di aplikasi WhatsApp Anda." : "Salin atau unduh draf, lalu pilih kanal kontak resmi yang tersedia."],
      ["03", "Anda yang mengirim", "Tekan kirim hanya setelah pesan sesuai. Jawaban, harga, dan ketersediaan datang melalui percakapan resmi—bukan dijamin oleh formulir."],
    ].map(([number, title, text]) => <Reveal key={number} className="border-t hairline pt-5"><span className="mono text-industrial">{number}</span><h3 className="mt-6 text-xl font-medium">{t(title)}</h3><p className="mt-3 text-sm leading-relaxed text-steel-dark">{t(text)}</p></Reveal>)}</div></div></section>

    <section className="border-y hairline bg-[#e8e4dc] py-20 md:py-28"><div className="site-shell"><SectionIntro number="04" eyebrow={t("Isi yang membantu")} title={t("Enam detail membuat jawaban lebih relevan.")} /><div className="mt-12 grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">{["Bahan dan kondisi awal", "Bentuk hasil yang diharapkan", "Foto atau video cara kerja saat ini", "Pilihan listrik atau engine", "Ukuran ruang dan posisi wadah", "Kota pemasangan dan kendala akses"].map((item, index) => <Reveal key={item} delay={index * .05} className="border-t hairline pt-4"><span className="mono text-industrial">0{index + 1}</span><p className="mt-4 text-lg font-medium">{t(item)}</p></Reveal>)}</div></div></section>

    <section className="section-space site-shell grid gap-10 lg:grid-cols-12"><Reveal className="lg:col-span-4"><p className="mono mb-5 text-steel-dark"><span className="text-industrial">05</span> / {t("Pertanyaan kontak")}</p><h2 className="display-md">{t("Hal yang perlu jelas.")}</h2><Link to="/mesin" className="btn btn-outline mt-7">{t("Kembali ke katalog")}<ArrowUpRight size={15} /></Link></Reveal><Reveal className="lg:col-span-8"><Faq items={contactFaqs} /></Reveal></section>
    <AnimatePresence>{status && <motion.div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-xl -translate-x-1/2 bg-graphite px-5 py-4 text-sm leading-relaxed text-ivory shadow-2xl" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}>{status}</motion.div>}</AnimatePresence>
  </>;
}
