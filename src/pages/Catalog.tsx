import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import InquiryLink from "../components/InquiryLink";
import { PageHero } from "../components/PageElements";
import Seo from "../components/Seo";
import { categories, type Product } from "../data/products";
import { useContent, useLanguage } from "../i18n/LanguageContext";
import { displayAvailability, displaySpec, formatIDR } from "../lib/inquiry";
import { isStringArray, readStored, writeStored } from "../lib/storage";

function CompareDialog({ items, onClose, onRemove }: { items: Product[]; onClose: () => void; onRemove: (product: Product) => void }) {
  const { t } = useLanguage();
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  const rows = ["Penggerak pada referensi", "Daya motor", "Tipe / daya engine", "Material rangka", "Grade material housing", "Dimensi keseluruhan", "Kapasitas kerja"];
  return (
    <motion.div className="fixed inset-0 z-[90] overflow-y-auto bg-graphite/80 p-3 backdrop-blur-sm md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div role="dialog" aria-modal="true" aria-labelledby="compare-title" className="mx-auto min-h-[50vh] max-w-6xl bg-ivory p-5 md:p-10" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ ease: [0.22, 1, 0.36, 1], duration: .45 }}>
        <div className="flex items-start justify-between gap-6 border-b hairline pb-6"><div><p className="mono mb-3 text-industrial">{t("Bandingkan konfigurasi")}</p><h2 id="compare-title" className="title-lg">{t("Perbedaan yang diketahui, bukan asumsi.")}</h2></div><button autoFocus type="button" className="icon-button shrink-0" onClick={onClose} aria-label={t("Tutup perbandingan")}><X size={20} /></button></div>
        <div className="no-scrollbar mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">{t("Perbandingan spesifikasi mesin pilihan")}</caption>
            <thead><tr className="border-b hairline"><th className="w-48 py-4 align-bottom"><span className="mono text-steel-dark">{t("Spesifikasi")}</span></th>{items.map((product) => <th key={product.id} className="min-w-56 p-3 align-top"><img src={product.posterImage} alt="" className="mb-4 aspect-[4/2.4] w-full object-cover object-center" /><span className="mono text-industrial">{product.id}</span><Link to={`/mesin/${product.slug}`} className="mt-2 block text-lg font-medium leading-tight hover:text-industrial">{product.name}</Link><button type="button" onClick={() => onRemove(product)} className="mono mt-3 min-h-9 text-steel-dark underline hover:text-industrial">{t("Hapus")}</button></th>)}</tr></thead>
            <tbody>
              <tr className="border-b hairline"><th className="py-4 align-top text-sm font-medium">{t("Harga")}</th>{items.map((product) => <td key={product.id} className="p-3 text-sm">{t(formatIDR(product.priceIDR))}</td>)}</tr>
              <tr className="border-b hairline"><th className="py-4 align-top text-sm font-medium">{t("Ketersediaan")}</th>{items.map((product) => <td key={product.id} className="p-3 text-sm">{t(displayAvailability(product.availability))}</td>)}</tr>
              {rows.map((row) => <tr key={row} className="border-b hairline"><th className="py-4 align-top text-sm font-medium">{t(row)}</th>{items.map((product) => { const spec = product.specifications.find((item) => item.label === t(row)); return <td key={product.id} className="p-3 align-top text-sm text-steel-dark">{spec ? t(displaySpec(spec.value)) : t("Tidak tercantum untuk referensi ini")}</td>; })}</tr>)}
            </tbody>
          </table>
        </div>
        <p className="mono mt-6 text-steel-dark">{t("Semua pilihan tetap memerlukan konfirmasi HCBTECH sebelum pemesanan.")}</p>
      </motion.div>
    </motion.div>
  );
}

export default function Catalog() {
  const { products, t } = useContent();
  const [params, setParams] = useSearchParams();
  const pendingParams = useRef(params);
  useEffect(() => { pendingParams.current = params; }, [params]);
  const query = params.get("q") ?? "";
  const category = params.get("kategori") ?? "all";
  const drive = params.get("penggerak") ?? "all";
  const price = params.get("harga") ?? "all";
  const sort = params.get("urut") ?? "featured";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>(() => readStored("hcbtech-compare", [], isStringArray)
    .filter((id) => products.some((product) => product.id === id))
    .slice(0, 3));

  useEffect(() => { writeStored("hcbtech-compare", compareIds); }, [compareIds]);
  useEffect(() => { if (!notice) return; const timeout = setTimeout(() => setNotice(""), 2800); return () => clearTimeout(timeout); }, [notice]);

  const setParam = (key: string, value: string, defaultValue = "all") => {
    const next = new URLSearchParams(pendingParams.current);
    if (!value || value === defaultValue) next.delete(key); else next.set(key, value);
    pendingParams.current = next;
    setParams(next, { replace: true });
  };
  const reset = () => {
    const next = new URLSearchParams();
    const lang = pendingParams.current.get("lang");
    if (lang) next.set("lang", lang);
    pendingParams.current = next;
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    const result = products.filter((product) => {
      const matchesQuery = !normalized || `${product.name} ${product.id} ${product.familyLabel} ${product.shortDescription}`.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || product.category === category;
      const matchesDrive = drive === "all" || product.driveType === drive;
      const matchesPrice = price === "all" || (price === "quote" ? product.priceIDR === null : product.priceIDR !== null);
      return matchesQuery && matchesCategory && matchesDrive && matchesPrice;
    });
    return [...result].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "id");
      if (sort === "family") return a.familyLabel.localeCompare(b.familyLabel, "id") || a.id.localeCompare(b.id);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.id.localeCompare(b.id);
    });
  }, [query, category, drive, price, sort, products]);

  const compared = compareIds.map((id) => products.find((product) => product.id === id)).filter((item): item is Product => Boolean(item));
  const toggleCompare = (product: Product) => {
    if (compareIds.includes(product.id)) { setCompareIds((ids) => ids.filter((id) => id !== product.id)); return; }
    if (compareIds.length >= 3) { setNotice(t("Maksimal tiga konfigurasi dapat dibandingkan.")); return; }
    setCompareIds((ids) => [...ids, product.id]);
    setNotice(t("{id} ditambahkan ke perbandingan.", { id: product.id }));
  };
  const activeCount = [category !== "all", drive !== "all", price !== "all"].filter(Boolean).length;

  const filterControls = (prefix: "desktop" | "mobile") => <>
    <div><label htmlFor={`${prefix}-category`} className="label">{t("Kelompok bentuk")}</label><select id={`${prefix}-category`} className="field" value={category} onChange={(event) => setParam("kategori", event.target.value)}>{categories.map((item) => <option key={item.id} value={item.id}>{t(item.label)}</option>)}</select></div>
    <div><label htmlFor={`${prefix}-drive`} className="label">{t("Penggerak pada referensi")}</label><select id={`${prefix}-drive`} className="field" value={drive} onChange={(event) => setParam("penggerak", event.target.value)}><option value="all">{t("Semua penggerak")}</option><option value="listrik">{t("Motor listrik")}</option><option value="engine">Engine</option></select></div>
    <div><label htmlFor={`${prefix}-price`} className="label">{t("Status harga")}</label><select id={`${prefix}-price`} className="field" value={price} onChange={(event) => setParam("harga", event.target.value)}><option value="all">{t("Semua status harga")}</option><option value="quote">{t("Minta Penawaran ({count})", { count: products.filter((p) => p.priceIDR === null).length })}</option><option value="verified">{t("Harga terverifikasi ({count})", { count: products.filter((p) => p.priceIDR !== null).length })}</option></select></div>
  </>;

  return (
    <>
      <Seo title={t("Katalog mesin")} description={t("Telusuri konfigurasi mesin HCBTECH: piringan dan gearbox atau drum tertutup, dengan referensi penggerak listrik dan engine. Filter, bandingkan, dan minta penawaran.")} path="/mesin" />
      <PageHero number="01" eyebrow={t("Katalog mesin")} title={t("Pilih bentuk yang mendekati pekerjaan Anda.")} description={t("Gunakan referensi ini untuk memulai percakapan, bukan sebagai pengganti spesifikasi. Semua harga dan ketersediaan menunggu konfirmasi; tidak ada angka performa yang direkayasa.")} aside={<div className="border-t hairline pt-4"><span className="display-md block">{String(products.length).padStart(2, "0")}</span><span className="mono text-steel-dark">{t("Konfigurasi referensi")}</span></div>} />

      <section className="site-shell pb-24 md:pb-36" aria-label={t("Daftar dan filter mesin")}>
        <h2 className="sr-only">{t("Daftar konfigurasi mesin")}</h2>
        <div className="full-gutter sticky top-[var(--header-height)] z-30 border-y hairline bg-ivory/95 py-4 backdrop-blur-md lg:static lg:bg-transparent">
          <div className="flex gap-2">
            <div className="relative flex-1"><Search size={17} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-steel-dark" /><label htmlFor="catalog-search" className="sr-only">{t("Cari mesin, kode referensi, atau kategori")}</label><input id="catalog-search" type="search" value={query} onChange={(event) => setParam("q", event.target.value, "")} placeholder={t("Cari bentuk atau kode referensi…")} className="field min-h-12 pl-7 pr-8" />{query && <button type="button" onClick={() => setParam("q", "", "")} className="absolute right-0 top-1/2 flex h-11 w-8 -translate-y-1/2 items-center justify-center" aria-label={t("Hapus pencarian")}><X size={15} /></button>}</div>
            <button type="button" className="btn btn-outline lg:hidden" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} aria-controls="mobile-filters"><SlidersHorizontal size={16} />{t("Filter")}{activeCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-industrial text-[.65rem] text-white">{activeCount}</span>}</button>
            <div className="hidden w-52 lg:block"><label htmlFor="sort" className="sr-only">{t("Urutkan katalog")}</label><select id="sort" className="field min-h-12" value={sort} onChange={(event) => setParam("urut", event.target.value, "featured")}><option value="featured">{t("Unggulan lebih dulu")}</option><option value="name">{t("Nama A–Z")}</option><option value="family">{t("Kelompok bentuk")}</option></select></div>
          </div>
          <AnimatePresence>{filtersOpen && <motion.div id="mobile-filters" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden"><div className="grid gap-5 pb-4 pt-5 sm:grid-cols-2">{filterControls("mobile")}<div><label htmlFor="sort-mobile" className="label">{t("Urutkan")}</label><select id="sort-mobile" className="field" value={sort} onChange={(event) => setParam("urut", event.target.value, "featured")}><option value="featured">{t("Unggulan lebih dulu")}</option><option value="name">{t("Nama A–Z")}</option><option value="family">{t("Kelompok bentuk")}</option></select></div></div></motion.div>}</AnimatePresence>
        </div>

        <div className="grid gap-10 pt-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block" aria-label={t("Filter katalog")}><div className="sticky top-[calc(var(--header-height)+32px)]"><p className="mono mb-6 text-steel-dark">{t("Filter")} / {activeCount} {t("aktif")}</p><div className="grid gap-7">{filterControls("desktop")}</div><button type="button" className="mono mt-8 min-h-11 text-industrial underline disabled:no-underline" onClick={reset} disabled={!query && activeCount === 0 && sort === "featured"}>{t("Reset semua filter")}</button><div className="mt-10 border-t hairline pt-5"><p className="mono mb-3 text-steel-dark">{t("Catatan verifikasi")}</p><p className="text-sm leading-relaxed text-steel-dark">{t("Kode REF adalah identitas katalog internal, bukan SKU final. Pilihan varian di formulir menunjukkan konfigurasi yang diminati.")}</p></div></div></aside>
          <div className="lg:col-span-9">
            <div className="mb-8 flex items-center justify-between gap-5 border-b hairline pb-4"><p className="mono text-steel-dark" role="status">{t("Menampilkan {count} dari {total}", { count: filtered.length, total: products.length })}</p>{(query || activeCount > 0) && <button type="button" onClick={reset} className="mono min-h-11 text-industrial lg:hidden">{t("Reset")}</button>}</div>
            {filtered.length > 0 ? <motion.div layout className="grid gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product, index) => <motion.div layout key={product.id} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .05, .25) }}><ProductCard product={product} index={products.indexOf(product)} onCompare={toggleCompare} compared={compareIds.includes(product.id)} /></motion.div>)}</motion.div> : <EmptyState eyebrow={t("0 hasil / coba pendekatan lain")} title={t("Tidak ada referensi yang cocok.")} description={t("Hapus kata pencarian atau longgarkan filter. Jika bentuk yang Anda cari belum ada di katalog, kirim kebutuhan dan foto referensi agar kesesuaiannya dapat didiskusikan.")} reassurance={t("Anda tidak perlu mengetahui nama model untuk memulai. Seluruh produk saat ini memang berstatus Minta Penawaran.")} actions={<><button type="button" onClick={reset} className="btn btn-dark">{t("Reset filter")}<ArrowRight size={16} /></button><InquiryLink className="btn btn-red" label="Diskusikan kebutuhan" message={t("Saya belum menemukan referensi yang cocok di katalog. Pencarian: {query}. Kategori: {category}. Penggerak: {drive}. Mohon bantu menentukan langkah berikutnya.", { query: query || t("tidak diisi"), category, drive })} /></>} />}
          </div>
        </div>
      </section>

      <AnimatePresence>{compared.length > 0 && <motion.div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl bg-graphite p-3 text-ivory shadow-2xl md:bottom-6" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}><div className="flex items-center gap-3"><div className="hidden flex-1 gap-2 sm:flex">{compared.map((product) => <button key={product.id} type="button" onClick={() => toggleCompare(product)} className="mono flex min-h-10 items-center gap-2 border hairline-light px-3" aria-label={t("Hapus {name} dari perbandingan", { name: product.name })}>{product.id}<X size={12} /></button>)}</div><div className="flex-1 sm:hidden"><p className="mono">{compared.length} {t("konfigurasi dipilih")}</p></div><button type="button" className="btn btn-red" onClick={() => setCompareOpen(true)} disabled={compared.length < 2}>{t("Bandingkan")}{compared.length < 2 && ` (${t("pilih 2")})`}<ChevronDown size={15} className="rotate-180" /></button></div></motion.div>}</AnimatePresence>
      <AnimatePresence>{compareOpen && <CompareDialog items={compared} onClose={() => setCompareOpen(false)} onRemove={toggleCompare} />}</AnimatePresence>
      <AnimatePresence>{notice && <motion.div role="status" className="fixed bottom-24 left-1/2 z-[100] w-max max-w-[90vw] -translate-x-1/2 bg-ivory px-5 py-4 text-sm text-graphite shadow-xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{notice}</motion.div>}</AnimatePresence>
    </>
  );
}
