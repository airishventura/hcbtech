import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { GalleryItem } from "../data/products";
import { useLanguage } from "../i18n/LanguageContext";
import { useDialogFocus } from "../lib/useDialogFocus";

export default function PhotoLightbox({ images, index, onChange, onClose }: { images: GalleryItem[]; index: number; onChange: (value: number) => void; onClose: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  useDialogFocus(ref, onClose, "[data-photo-zoom]");
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); onChange((index - 1 + images.length) % images.length); }
      if (event.key === "ArrowRight") { event.preventDefault(); onChange((index + 1) % images.length); }
    };
    window.addEventListener("keydown", handle);return () => window.removeEventListener("keydown", handle);
  }, [images.length, index, onChange]);
  return <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-3 text-white md:p-6" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="photo-dialog-title" className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-4"><h2 id="photo-dialog-title" className="text-sm">{t("Foto asli")} <span className="tabular-nums">{index + 1} / {images.length}</span></h2><button autoFocus type="button" onClick={onClose} className="icon-button border-white/40" aria-label={t("Tutup foto")}><X size={20} /></button></div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center py-4"><img src={images[index].src} alt={images[index].alt} width={images[index].width} height={images[index].height} className="max-h-full max-w-full object-contain" /><button type="button" onClick={() => onChange((index - 1 + images.length) % images.length)} className="icon-button absolute left-0 bg-black/70" aria-label={t("Foto sebelumnya")}><ChevronLeft size={22} /></button><button type="button" onClick={() => onChange((index + 1) % images.length)} className="icon-button absolute right-0 bg-black/70" aria-label={t("Foto berikutnya")}><ChevronRight size={22} /></button></div>
      <p className="max-w-3xl pb-2 text-sm leading-relaxed text-white/75">{images[index].caption}</p>
    </div>
  </div>;
}
