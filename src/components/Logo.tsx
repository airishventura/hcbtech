import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function Logo({ light = false }: { light?: boolean }) {
  const { t } = useLanguage();
  return (
    <Link to="/" aria-label={t("HCBTECH — beranda")} className="inline-flex min-h-12 items-center gap-3">
      <img src="/brand/hcbtech.webp" alt="HCBTECH" width="1179" height="564" className={`h-auto w-[130px] sm:w-[150px] ${light ? "ring-1 ring-white/10" : ""}`} />
    </Link>
  );
}
