import type { ReactNode } from "react";
import { Link } from "./LocalizedLink";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export function PageHero({ number, eyebrow, title, description, aside }: { number: string; eyebrow: string; title: string; description: string; aside?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="site-shell page-hero-inner">
        <p className="mono page-hero-eyebrow text-steel-dark"><span className="text-industrial">{number}</span> / {eyebrow}</p>
        <h1 className="page-hero-title">{title}</h1>
        <div className="page-hero-summary">
          <p className="body-lg text-steel-dark">{description}</p>
          {aside && <div className="page-hero-aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

export function BackToCatalog() {
  const { t } = useLanguage();
  return <Link to="/mesin" className="mono inline-flex min-h-12 items-center gap-3 text-steel-dark hover:text-industrial"><ArrowLeft size={15} /> {t("Kembali ke katalog")}</Link>;
}

export function TextLink({ to, children, external = false }: { to: string; children: ReactNode; external?: boolean }) {
  const className = "mono inline-flex min-h-12 items-center gap-3 border-b border-graphite/30 transition-colors hover:border-industrial hover:text-industrial";
  if (external) return <a href={to} target="_blank" rel="noreferrer" className={className}>{children}<ArrowUpRight size={15} /></a>;
  return <Link to={to} className={className}>{children}<ArrowUpRight size={15} /></Link>;
}
