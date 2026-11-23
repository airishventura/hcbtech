import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function HomeHero() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 65]);
  return <section ref={ref} className={`home-hero ${reduced ? "home-hero-static" : ""}`} aria-labelledby="hero-title">
    <div className="home-hero-stage">
      <motion.figure className="home-hero-art" style={reduced ? undefined : { scale, y }} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }}>
        <img src="/images/hero-shell-peeler.webp" alt={t("Ilustrasi mesin kupas batok dengan motor listrik, gearbox, piringan, dan saluran keluar pada rangka meja")} width="1536" height="1024" fetchPriority="high" />
      </motion.figure>
      <div className="home-hero-shade" aria-hidden="true" />
      <div className="site-shell home-hero-content">
        <motion.div className="home-hero-copy" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .12 }}>
          <p className="mb-6 flex items-center gap-3 text-sm text-ivory/70"><span className="h-px w-8 bg-industrial" aria-hidden="true" />{t("Katalog mesin & fabrikasi / Indonesia")}</p>
          <h1 id="hero-title" className="home-hero-title"><span>{t("Mesin yang dibuat")}</span> <span>{t("untuk kerja nyata")}</span></h1>
          <p className="home-hero-description">{t("Mesin parut kelapa, kupas batok, dan peras santan. Pilih konfigurasi yang sesuai, lalu bicarakan kebutuhan Anda dengan HCBTECH.")}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/mesin/kupas-batok-kelapa" className="btn btn-red">{t("Lihat mesin unggulan")}<ArrowRight size={16} aria-hidden="true" /></Link><Link to="/mesin" className="btn btn-outline-light">{t("Buka semua mesin")}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        </motion.div>
        <div className="home-hero-caption">
          <div><Link to="/mesin/kupas-batok-kelapa" className="text-sm font-medium underline-offset-4 hover:underline">{t("Mesin Kupas Batok Kelapa")}</Link><p className="mt-1 max-w-sm text-xs leading-relaxed text-ivory/65">{t("Ilustrasi bentuk dari foto pemilik. Konfigurasi unit dikonfirmasi saat penawaran.")}</p></div>
          <a href="#mesin" className="inline-flex min-h-11 items-center gap-3 text-sm text-ivory/75">{t("Gulir")}<ArrowDown size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </div>
  </section>;
}
