import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { useLanguage } from "../i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return <section className="site-shell flex min-h-[80svh] flex-col justify-center pb-20 pt-[var(--header-height)]"><Seo title={t("Halaman tidak ditemukan")} description={t("Halaman yang Anda cari tidak tersedia. Kembali ke katalog mesin HCBTECH.")} path="/404" noIndex /><p className="mono mb-8 text-industrial">Error / 404</p><h1 className="display-lg max-w-5xl">{t("Bentuk ini tidak ada di katalog.")}</h1><p className="body-lg mt-8 max-w-xl text-steel-dark">{t("Tautan mungkin berubah atau nama konfigurasi belum tersedia. Kembali ke katalog untuk melihat semua referensi.")}</p><Link to="/mesin" className="btn btn-dark mt-9 self-start" aria-label={t("Kembali ke katalog")}><ArrowLeft size={16} />{t("Kembali ke katalog")}</Link></section>;
}
