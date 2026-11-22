import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Box, ChevronLeft, ChevronRight, Images, Play } from "lucide-react";
import { lazy, Suspense, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Product, ProductVariant } from "../data/products";
import EmptyState from "./EmptyState";
import InquiryLink from "./InquiryLink";
import { useLanguage } from "../i18n/LanguageContext";

const MachineViewer = lazy(() => import("./MachineViewer"));

type Tab = "media" | "3d" | "video";

export default function ProductMedia({ product, variant }: { product: Product; variant?: ProductVariant }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>(() => product.gallery.length ? "media" : product.modelAccuracy !== "none" ? "3d" : "video");
  const [imageIndex, setImageIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const hasOriginal = product.gallery.some((item) => item.kind === "original-photo");
  const mediaLabel = hasOriginal ? t(product.gallery.every(item => item.kind === "original-photo") ? "Foto asli" : "Foto & visualisasi") : t("Visualisasi");
  const tabs = [
    ...(product.modelAccuracy !== "none" ? [{ id: "3d" as const, label: t(product.modelGLB ? "3D referensi" : "Lihat 3D"), icon: Box }] : []),
    ...(product.gallery.length ? [{ id: "media" as const, label: mediaLabel, icon: Images }] : []),
    ...(product.demonstrationVideo ? [{ id: "video" as const, label: t("Video Demo"), icon: Play }] : []),
  ];
  const goToImage = (index: number) => {
    const next = Math.max(0, Math.min(product.gallery.length - 1, index));
    setImageIndex(next);
    galleryRef.current?.scrollTo({ left: next * galleryRef.current.clientWidth, behavior: reduced ? "auto" : "smooth" });
  };
  const onTabKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    const nextTab = tabs[next].id;
    setTab(nextTab);
    document.getElementById(`tab-${product.id}-${nextTab}`)?.focus();
  };

  if (!tabs.length) return <EmptyState compact variant="media" eyebrow={t("Media / belum tersedia")} title={t("Belum ada media untuk unit ini.")} description={t("Deskripsi dan tabel spesifikasi tetap dapat diperiksa. Foto atau model hanya akan ditampilkan setelah asetnya tersedia dan statusnya jelas.")} reassurance={t("Tidak ada foto atau video yang disembunyikan dari Anda.")} actions={<InquiryLink product={product} className="btn btn-dark" label={t("Minta foto unit")} message={t("Mohon foto aktual unit ini dari beberapa sisi dan informasi media yang tersedia.")} />} />;

  return <div className="min-w-0">
    {tab === "3d" && product.modelReferenceNote && <p className="mb-4 border-l-2 border-industrial pl-3 text-sm leading-relaxed text-steel-dark">{product.modelReferenceNote}</p>}
    <div role="tablist" aria-label={t("Media {name}", { name: product.name })} className="no-scrollbar mb-3 flex gap-1 overflow-x-auto border-b hairline">
      {tabs.map((item, index) => <button key={item.id} type="button" role="tab" id={`tab-${product.id}-${item.id}`} tabIndex={tab === item.id ? 0 : -1} aria-selected={tab === item.id} aria-controls={`panel-${product.id}-${item.id}`} onKeyDown={(event) => onTabKey(event, index)} onClick={() => setTab(item.id)} className={`mono relative flex min-h-12 shrink-0 items-center gap-2 px-4 transition-colors ${tab === item.id ? "text-graphite" : "text-steel-dark hover:text-graphite"}`}><item.icon size={15} />{item.label}{tab === item.id && <motion.span layoutId="media-tab" className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-industrial" />}</button>)}
    </div>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={tab} id={`panel-${product.id}-${tab}`} role="tabpanel" aria-labelledby={`tab-${product.id}-${tab}`} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25 }}>
        {tab === "media" && <div className="relative">
          <div ref={galleryRef} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto" onScroll={(event) => { const element = event.currentTarget; setImageIndex(Math.round(element.scrollLeft / element.clientWidth)); }}>
            {product.gallery.map((image, index) => <figure key={`${image.src}-${index}`} className="relative aspect-[4/4.7] w-full shrink-0 snap-start overflow-hidden bg-[#e8e4dc] md:aspect-[4/4.35]">
              <img src={image.src} alt={image.alt} width={image.width ?? 768} height={image.height ?? 960} loading={index === 0 ? "eager" : "lazy"} decoding="async" className={`h-full w-full ${image.kind === "original-photo" ? "object-contain" : "object-cover"}`} />
              <span className="media-label absolute left-4 top-4">{image.kind === "original-photo" ? t("Foto asli") : t("Visualisasi / bukan foto unit")}</span>
              <figcaption className="absolute inset-x-0 bottom-0 bg-graphite/90 px-4 py-3 text-xs leading-relaxed text-ivory/75">{image.caption}</figcaption>
            </figure>)}
          </div>
          {product.gallery.length > 1 && <>
            <button type="button" className="icon-button absolute left-3 top-1/2 -translate-y-1/2 bg-ivory/90" onClick={() => goToImage(imageIndex - 1)} disabled={imageIndex === 0} aria-label={t("Foto sebelumnya")}><ChevronLeft size={18} /></button>
            <button type="button" className="icon-button absolute right-3 top-1/2 -translate-y-1/2 bg-ivory/90" onClick={() => goToImage(imageIndex + 1)} disabled={imageIndex === product.gallery.length - 1} aria-label={t("Foto berikutnya")}><ChevronRight size={18} /></button>
            <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2">{product.gallery.map((_, index) => <button key={index} type="button" className="flex h-11 w-11 items-center justify-center" onClick={() => goToImage(index)} aria-label={t("Buka foto {index}", { index: index + 1 })} aria-current={index === imageIndex}><span className={`h-2 rounded-full transition-all ${index === imageIndex ? "w-7 bg-industrial" : "w-2 bg-graphite/35"}`} /></button>)}</div>
          </>}
        </div>}
        {tab === "3d" && <div className="w-full aspect-[4/4.7] min-h-[460px] md:aspect-[4/4.35]">
          <Suspense fallback={<div className="flex h-full min-h-[460px] flex-col items-center justify-center bg-[#e8e4dc]" role="status"><span className="loader-ring mb-5 h-8 w-8 rounded-full border-2 border-graphite/20 border-t-industrial" /><span className="mono">{t("Menyiapkan viewer 3D")}</span><span className="mt-2 max-w-xs text-center text-xs text-steel-dark">{t("Konten produk tetap tersedia tanpa WebGL.")}</span></div>}>
            <MachineViewer key={product.modelGLB ?? product.id} glbUrl={product.modelGLB} posterImage={product.posterImage} family={product.category} drive={variant?.drive === "engine" ? "engine" : "listrik"} hotspots={product.hotspots} modelAccuracy={product.modelAccuracy} productName={product.name} />
          </Suspense>
        </div>}
        {tab === "video" && product.demonstrationVideo && <div className="aspect-video bg-graphite">
          {/\.(mp4|webm|ogg)(\?|$)/i.test(product.demonstrationVideo.url) ? <video className="h-full w-full" controls playsInline preload="metadata" poster={product.demonstrationVideo.poster} title={product.demonstrationVideo.title}><source src={product.demonstrationVideo.url} />{t("Browser Anda tidak dapat memutar video ini.")}</video> : <iframe className="h-full w-full" src={product.demonstrationVideo.url} title={product.demonstrationVideo.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
        </div>}
      </motion.div>
    </AnimatePresence>
    <p className="mono mt-3 leading-relaxed text-steel-dark">{tab === "3d" ? product.modelAccuracy === "geometry-verified" ? t("Geometri model telah diverifikasi terhadap referensi; bukan sertifikasi performa atau keselamatan.") : t("Model interaktif adalah aproksimasi bentuk luar; bukan gambar teknik atau animasi kerja.") : tab === "video" ? t("Video ditampilkan dari sumber yang dicantumkan pada data produk.") : hasOriginal ? t("Foto asli disediakan pemilik. Klik dan geser galeri pada layar sentuh.") : t("Visualisasi digunakan sementara sampai foto asli pemilik tersedia di aset proyek.")}</p>
  </div>;
}
