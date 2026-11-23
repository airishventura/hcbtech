import { Download, FileUp, RotateCcw } from "lucide-react";
import { useEffect, useId, useMemo, useState, type ChangeEvent } from "react";
import { PageHero } from "../components/PageElements";
import Seo from "../components/Seo";
import { products } from "../data/products";
import { englishReady, englishText, loadEnglish } from "../i18n/load-English";
import { useLanguage } from "../i18n/LanguageContext";
import { formatIDR } from "../lib/inquiry";
import { parseCatalogRevision, stockValues, type CatalogEditProduct, type CatalogEditVariant, type CatalogRevision, type CatalogText } from "../lib/catalog-editing";
import { readStored, writeStored } from "../lib/storage";

const storageKey = "hcbtech-catalog-draft-v1";
function publishedDraft(): CatalogRevision {
  const pair = (value: string): CatalogText => ({ id: value, en: englishText(value) });
  return {
    schemaVersion: 1, review: { by: "", date: "", source: "" },
    products: products.map(product => ({
      id: product.id, name: product.contentRevision?.name ?? pair(product.name),
      shortDescription: product.contentRevision?.shortDescription ?? pair(product.shortDescription),
      description: product.contentRevision?.description ?? pair(product.description),
      variants: product.variants.map(variant => ({
        id: variant.id, label: product.contentRevision?.variants.find(item => item.id === variant.id)?.label ?? pair(variant.label),
        note: product.contentRevision?.variants.find(item => item.id === variant.id)?.note ?? pair(variant.note),
        priceIDR: variant.priceIDR, priceKind: variant.priceKind ?? "reference", availability: variant.availability,
      })),
    })),
  };
}
function loadDraft() {
  try { return parseCatalogRevision(readStored(storageKey, publishedDraft()), { draft: true }); }
  catch { return publishedDraft(); }
}
function TextPair({ label, value, onChange, max, multiline = false }: { label: string; value: CatalogText; onChange: (value: CatalogText) => void; max: number; multiline?: boolean }) {
  const id = useId();
  return <fieldset><legend className="label">{label}</legend><div className="grid gap-4 md:grid-cols-2">{(["id", "en"] as const).map(lang => <div key={lang}>
    <label htmlFor={`${id}-${lang}`} className="mb-1 block text-xs text-steel-dark">{lang === "id" ? "Bahasa Indonesia" : "English"}</label>
    {multiline ? <textarea id={`${id}-${lang}`} className="editor-field min-h-24" value={value[lang]} maxLength={max} onChange={event => onChange({ ...value, [lang]: event.target.value })} /> : <input id={`${id}-${lang}`} className="editor-field" value={value[lang]} maxLength={max} onChange={event => onChange({ ...value, [lang]: event.target.value })} />}
  </div>)}</div></fieldset>;
}
const stockLabels = { unconfirmed: "Konfirmasi ketersediaan", available: "Tersedia", "made-to-order": "Dibuat berdasarkan pesanan", "out-of-stock": "Stok habis" };

export default function CatalogEditor() {
  if (!englishReady()) throw loadEnglish();
  const { t, language } = useLanguage();
  const [draft, setDraft] = useState(loadDraft);
  const [selected, setSelected] = useState(products[0].id);
  const [reviewed, setReviewed] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const active = draft.products.find(product => product.id === selected)!;
  const original = products.find(product => product.id === selected)!;
  const changed = useMemo(() => draft.products.filter((product, index) => JSON.stringify(product) !== JSON.stringify(publishedDraft().products[index])).length, [draft.products]);
  useEffect(() => { setPersistent(writeStored(storageKey, draft)); }, [draft]);
  const updateProduct = (patch: Partial<CatalogEditProduct>) => {
    setDraft(current => ({ ...current, products: current.products.map(product => product.id === selected ? { ...product, ...patch } : product) }));
    setReviewed(false); setError(""); setStatus("");
  };
  const updateVariant = (id: string, patch: Partial<CatalogEditVariant>) => updateProduct({ variants: active.variants.map(variant => variant.id === id ? { ...variant, ...patch } : variant) });
  const updateReview = (key: keyof CatalogRevision["review"], value: string) => {
    setDraft(current => ({ ...current, review: { ...current.review, [key]: value } })); setReviewed(false); setError("");
  };
  const exportRevision = () => {
    setStatus(""); setError("");
    try {
      if (!reviewed) throw new Error(t("Periksa data dan centang konfirmasi sebelum ekspor."));
      const checked = parseCatalogRevision(draft);
      const url = URL.createObjectURL(new Blob([JSON.stringify(checked, null, 2) + "\n"], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "hcbtech-catalog-update.json"; anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(t("Revisi diekspor. Katalog publik belum berubah."));
    } catch (failure) { setError(failure instanceof Error ? failure.message : t("Revisi tidak valid.")); }
  };
  const importRevision = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    try {
      if (file.size > 256000) throw new Error(t("Ukuran file maksimal 256 KB."));
      const imported = parseCatalogRevision(JSON.parse(await file.text()), { draft: true });
      setDraft(imported); setReviewed(false); setError(""); setStatus(t("Revisi dimuat untuk diperiksa. Katalog publik belum berubah."));
    } catch (failure) { setError(failure instanceof Error ? failure.message : t("Revisi tidak valid.")); }
  };
  return <>
    <Seo title={t("Editor katalog")} description={t("Siapkan revisi konten dan harga katalog HCBTECH untuk ditinjau sebelum publikasi.")} path="/kelola-katalog" noIndex />
    <PageHero number="ADMIN" eyebrow={t("Ruang kerja pemilik")} title={t("Perbarui katalog dengan jelas.")} description={t("Edit teks dua bahasa, harga, dan status varian. Draf tersimpan di browser ini. Ekspor revisi untuk ditinjau dan dipublikasikan melalui GitHub.")} aside={<p className="editor-mode">{t("Draf lokal · belum dipublikasikan")}</p>} />
    <section className="site-shell editor-workspace pb-20">
      <noscript><p className="surface-panel mb-6">{t("Aktifkan JavaScript untuk mengedit draf. Katalog publik tetap dapat dibaca tanpa JavaScript.")}</p></noscript>
      <div className="surface-panel mb-6 text-sm leading-relaxed">
        <p className="font-medium">{t("Halaman ini menyiapkan revisi, tidak mengubah situs secara langsung.")}</p>
        <p className="mt-2 text-steel-dark">{t("Revisi tidak mencakup ukuran, model 3D, atau foto per varian. Jangan isi data pelanggan atau rahasia; catatan sumber akan ikut dipublikasikan setelah revisi diterapkan.")}</p>
      </div>
      {!persistent && <p role="status" className="mb-5 border-l-2 border-industrial pl-4 text-sm">{t("Penyimpanan lokal diblokir. Ekspor revisi sebelum meninggalkan halaman ini.")}</p>}
      <div className="editor-toolbar mb-7">
        <div><label htmlFor="editor-product" className="label">{t("Keluarga mesin")}</label><select id="editor-product" className="editor-field" value={selected} onChange={event => setSelected(event.target.value)}>{draft.products.map(product => <option key={product.id} value={product.id}>{product.id} — {product.name[language]}</option>)}</select></div>
        <div className="flex flex-wrap gap-3"><label className="btn btn-outline cursor-pointer"><FileUp size={16} />{t("Impor revisi")}<input type="file" accept="application/json,.json" className="sr-only" onChange={importRevision} aria-label={t("Impor revisi JSON")} /></label><button type="button" className="btn btn-outline" onClick={() => { setDraft(publishedDraft()); setReviewed(false); setError(""); setStatus(t("Draf direset ke katalog publik.")); }}><RotateCcw size={15} />{t("Reset ke publik")}</button></div>
      </div>
      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-6">
          <div className="surface-panel grid gap-6"><h2 className="title-lg">{t("Konten keluarga mesin")}</h2><TextPair label={t("Nama mesin")} value={active.name} max={120} onChange={name => updateProduct({ name })} /><TextPair label={t("Deskripsi singkat")} value={active.shortDescription} max={350} multiline onChange={shortDescription => updateProduct({ shortDescription })} /><TextPair label={t("Deskripsi lengkap")} value={active.description} max={3000} multiline onChange={description => updateProduct({ description })} /></div>
          <div className="surface-panel"><h2 className="title-lg">{t("Harga & status varian")}</h2><p className="mt-3 mb-6 text-sm text-steel-dark">{t("Gunakan rupiah tanpa pemisah ribuan. Kosongkan harga bila belum diketahui. ID varian tetap agar tautan dan penawaran tidak berubah.")}</p><div className="grid gap-5">{active.variants.map(variant => <fieldset key={variant.id} className="editor-variant"><legend className="px-2 text-sm font-medium">{variant.id} · {variant.label[language]}</legend><div className="grid gap-4 md:grid-cols-3">
            <div><label htmlFor={`${variant.id}-price`} className="label">{t("Harga (IDR)")}</label><input id={`${variant.id}-price`} className="editor-field" type="number" min="1" step="1" inputMode="numeric" value={variant.priceIDR ?? ""} onChange={event => updateVariant(variant.id, { priceIDR: event.target.value === "" ? null : Number(event.target.value) })} /></div>
            <div><label htmlFor={`${variant.id}-kind`} className="label">{t("Status harga")}</label><select id={`${variant.id}-kind`} className="editor-field" value={variant.priceKind} onChange={event => updateVariant(variant.id, { priceKind: event.target.value as CatalogEditVariant["priceKind"] })}><option value="reference">{t("Referensi daftar")}</option><option value="confirmed">{t("Dikonfirmasi pemilik")}</option></select></div>
            <div><label htmlFor={`${variant.id}-stock`} className="label">{t("Ketersediaan")}</label><select id={`${variant.id}-stock`} className="editor-field" value={variant.availability} onChange={event => updateVariant(variant.id, { availability: event.target.value as CatalogEditVariant["availability"] })}>{stockValues.map(value => <option key={value} value={value}>{t(stockLabels[value])}</option>)}</select></div>
          </div><details className="mt-4"><summary className="cursor-pointer py-2 text-sm font-medium">{t("Nama & catatan dua bahasa")}</summary><div className="mt-3 grid gap-5"><TextPair label={t("Nama konfigurasi")} value={variant.label} max={120} onChange={label => updateVariant(variant.id, { label })} /><TextPair label={t("Catatan konfigurasi")} value={variant.note} max={1000} multiline onChange={note => updateVariant(variant.id, { note })} /></div></details></fieldset>)}</div></div>
        </div>
        <aside className="editor-preview grid gap-6">
          <div className="surface-panel" aria-label={t("Pratinjau draf")}><p className="mono mb-4 text-steel-dark">{t("Pratinjau draf")}</p><img src={original.gallery[0].src} alt="" className="mb-5 h-48 w-full rounded-lg bg-white object-contain" /><h2 className="title-lg break-words">{active.name[language]}</h2><p className="mt-4 break-words text-sm leading-relaxed text-steel-dark">{active.shortDescription[language]}</p><dl className="mt-5 grid gap-3 border-t hairline pt-5">{active.variants.map(variant => <div key={variant.id} className="flex flex-wrap justify-between gap-2 text-xs"><dt>{variant.id}</dt><dd className="font-medium tabular-nums">{t(formatIDR(variant.priceIDR))}</dd></div>)}</dl></div>
          <div className="surface-panel grid gap-5"><div><h2 className="title-lg">{t("Tinjau & ekspor")}</h2><p className="mt-3 text-sm text-steel-dark" aria-live="polite">{t("{count} keluarga memiliki perubahan", { count: changed })}</p></div>
            <div><label htmlFor="review-by" className="label">{t("Penanggung jawab publik")}</label><input id="review-by" className="editor-field" maxLength={100} value={draft.review.by} onChange={event => updateReview("by", event.target.value)} /></div>
            <div><label htmlFor="review-date" className="label">{t("Tanggal pemeriksaan")}</label><input id="review-date" type="date" className="editor-field" value={draft.review.date} onChange={event => updateReview("date", event.target.value)} /></div>
            <div><label htmlFor="review-source" className="label">{t("Sumber konfirmasi publik")}</label><textarea id="review-source" className="editor-field min-h-24" maxLength={1000} value={draft.review.source} onChange={event => updateReview("source", event.target.value)} /></div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed"><input className="mt-1 h-5 w-5 shrink-0 accent-industrial" type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />{t("Saya sudah memeriksa teks kedua bahasa, harga, stok, dan sumber revisi ini.")}</label>
            <button type="button" className="btn btn-red w-full" onClick={exportRevision}><Download size={16} />{t("Ekspor revisi JSON")}</button>
            {error && <p role="alert" className="break-words text-sm text-industrial">{error}</p>}{status && <p role="status" className="text-sm leading-relaxed">{status}</p>}
            <p className="text-xs leading-relaxed text-steel-dark">{t("Setelah ekspor: periksa revisi, impor ke proyek, jalankan validasi, lalu publikasikan commit yang sudah ditinjau. Katalog di halaman lain tetap memakai versi publik.")}</p>
          </div>
        </aside>
      </div>
    </section>
  </>;
}
