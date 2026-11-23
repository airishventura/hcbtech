import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "./LocalizedLink";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export function PageHero({ number, eyebrow, title, description, aside }: { number: string; eyebrow: string; title: string; description: string; aside?: ReactNode }) {
  return (
    <section className="site-shell pb-20 pt-[calc(var(--header-height)+72px)] md:pb-32 md:pt-[calc(var(--header-height)+112px)]">
      <motion.div initial={false} animate="show" variants={{ show: { transition: { staggerChildren: .09 } } }}>
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mono mb-12 border-t hairline pt-5 text-steel-dark"><span className="text-industrial">{number}</span> / {eyebrow}</motion.p>
        <div className="overflow-hidden"><motion.h1 variants={{ hidden: { y: "110%" }, show: { y: 0 } }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }} className="display-lg max-w-6xl">{title}</motion.h1></div>
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <motion.p variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }} className="body-lg text-steel-dark md:col-span-6 md:col-start-4">{description}</motion.p>
          {aside && <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="md:col-span-3 md:col-start-10">{aside}</motion.div>}
        </div>
      </motion.div>
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
