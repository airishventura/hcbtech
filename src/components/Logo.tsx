import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function Logo(_props: { light?: boolean }) {
  const { t } = useLanguage();
  return (
    <Link to="/" aria-label={t("HCBTECH — beranda")} className="inline-flex min-h-12 items-center gap-3">
      <img src="/brand/hcbtech-transparent.webp" alt="HCBTECH" width="1000" height="479" className="h-auto w-[140px] sm:w-[164px]" />
    </Link>
  );
}
