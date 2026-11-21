import { ArrowRight, GitCompareArrows } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import InquiryLink from "./InquiryLink";
import { displayAvailability, displayDrive, formatIDR } from "../lib/inquiry";
import { useLanguage } from "../i18n/LanguageContext";

export default function ProductCard({ product, index, onCompare, compared = false }: { product: Product; index: number; onCompare?: (product: Product) => void; compared?: boolean }) {
  const { t } = useLanguage();
  const image = product.gallery[0];
  return (
    <article className="group flex h-full min-w-0 flex-col border-t hairline pt-5" data-product={product.slug}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="mono text-steel-dark">{String(index + 1).padStart(2, "0")} / {product.id}</span>
        <span className="mono text-right text-steel-dark">{product.familyLabel}</span>
      </div>
      <Link to={`/mesin/${product.slug}`} className="image-visual relative block aspect-[4/4.5] overflow-hidden" aria-label={t("Lihat detail {name}", { name: product.name })}>
        <img src={image.src} alt={image.alt} loading={index < 2 ? "eager" : "lazy"} decoding="async" width={image.width ?? 768} height={image.height ?? 960} className={`h-full w-full ${image.kind === "original-photo" ? "object-contain" : "object-cover"} transition-transform duration-700 ease-out group-hover:scale-[1.035]`} />
        <span className="media-label absolute left-3 top-3">{image.kind === "original-photo" ? t("Foto asli") : t("Visualisasi")}</span>
        <span className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center bg-graphite text-ivory transition-colors group-hover:bg-industrial"><ArrowRight size={19} aria-hidden="true" /></span>
      </Link>
      <div className="flex flex-1 flex-col pt-6">
        <div className="mb-4">
          <p className="mono mb-2 text-industrial">{product.nameStatus === "draft" ? t("Nama model sementara") : product.sku ?? product.id}</p>
          <h3 className="title-lg"><Link to={`/mesin/${product.slug}`} className="hover:text-industrial">{product.name}</Link></h3>
        </div>
        <p className="mb-6 max-w-md text-[.94rem] leading-relaxed text-steel-dark">{product.shortDescription}</p>
        <dl className="mb-6 grid grid-cols-2 gap-4 border-y hairline py-5">
          <div><dt className="mono mb-1 text-steel-dark">{t("Harga")}</dt><dd className="text-sm font-medium">{t(formatIDR(product.priceIDR))}</dd></div>
          <div><dt className="mono mb-1 text-steel-dark">{t("Penggerak referensi")}</dt><dd className="text-sm font-medium">{t(displayDrive(product.driveType))}</dd></div>
        </dl>
        <div className="mt-auto flex flex-wrap gap-2">
          <InquiryLink product={product} className="btn btn-dark flex-1" label="Minta penawaran" />
          {onCompare && <button type="button" className={`icon-button ${compared ? "bg-graphite text-ivory" : ""}`} onClick={() => onCompare(product)} aria-pressed={compared} aria-label={compared ? t("Hapus {name} dari perbandingan", { name: product.name }) : t("Tambah {name} ke perbandingan", { name: product.name })}><GitCompareArrows size={18} /></button>}
        </div>
        <p className="mono mt-3 text-steel-dark">{t(displayAvailability(product.availability))} · {t("opsi varian dikonfirmasi")}</p>
      </div>
    </article>
  );
}
