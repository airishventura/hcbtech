import { Languages } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function LanguageToggle({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const { language, toggleLanguage, t } = useLanguage();
  const next = language === "id" ? "EN" : "ID";
  const label = language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia";
  return <button type="button" onClick={toggleLanguage} className={`${compact ? "min-w-12 px-2" : "min-w-[70px] px-3"} mono inline-flex min-h-12 items-center justify-center gap-2 border transition-colors ${light ? "border-ivory/30 text-ivory hover:bg-ivory hover:text-graphite" : "hairline border text-graphite hover:bg-graphite hover:text-ivory"}`} aria-label={label} title={label}><Languages size={15} aria-hidden="true" /><span>{next}</span><span className="sr-only">{t("Bahasa saat ini")}: {language === "id" ? "Indonesia" : "English"}</span></button>;
}
