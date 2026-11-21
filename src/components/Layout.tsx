import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, Play, X } from "lucide-react";

function FacebookMark({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}><path d="M13.6 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.4-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.1V10H8v3h2.5v8h3.1Z" /></svg>;
}
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { buildWhatsAppUrl, FACEBOOK_URL, formatWhatsAppNumber, TIKTOK_URL, getWhatsAppNumber } from "../lib/inquiry";
import InquiryLink from "./InquiryLink";
import Logo from "./Logo";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../i18n/LanguageContext";

const nav = [
  { to: "/mesin", label: "Mesin", number: "01" },
  { to: "/bengkel", label: "Bengkel", number: "02" },
  { to: "/tentang", label: "Tentang", number: "03" },
  { to: "/kontak", label: "Kontak", number: "04" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.25 });

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = document.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]');
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key !== "Tab") return;
      const items = menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !menuRef.current?.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !menuRef.current?.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); trigger?.focus(); };
  }, [open]);

  return (
    <>
      <a href="#konten" className="sr-only-focusable fixed left-4 top-4 z-[100] bg-ivory px-4 py-3 text-graphite">{t("Lewati ke konten utama")}</a>
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--header-height)] border-b hairline bg-ivory/95 backdrop-blur-md">
        <motion.div className="absolute inset-x-0 top-0 h-[3px] origin-left bg-industrial" style={{ scaleX: progress }} />
        <div className="site-shell flex h-full items-center justify-between gap-6">
          <Logo />
          <nav aria-label={t("Navigasi utama")} className="hidden h-full items-center lg:flex">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `relative flex h-full items-center gap-2 px-5 text-[.82rem] transition-colors hover:text-industrial ${isActive ? "text-industrial" : "text-graphite"}`}>
                <span className="mono text-[.54rem] opacity-55">{item.number}</span>{t(item.label)}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="mono hidden text-steel-dark xl:inline">Machining / Fabrication</span>
            <LanguageToggle compact />
            <InquiryLink className="btn btn-dark" label="Minta penawaran" showIcon={false} />
          </div>
          <div className="flex items-center gap-2 lg:hidden"><LanguageToggle compact /><button type="button" className="icon-button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu" aria-label={t("Buka menu navigasi")}><Menu size={21} /></button></div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div ref={menuRef} id="mobile-menu" role="dialog" aria-modal="true" aria-label={t("Navigasi mobile")} className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-graphite text-ivory" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .5, ease: [0.76, 0, 0.24, 1] }}>
            <div className="site-shell flex h-[var(--header-height)] shrink-0 items-center justify-between border-b hairline-light">
              <Logo light />
              <button autoFocus type="button" className="icon-button border-ivory/30" onClick={() => setOpen(false)} aria-label={t("Tutup menu navigasi")}><X size={22} /></button>
            </div>
            <nav aria-label={t("Navigasi mobile")} className="site-shell flex flex-1 flex-col justify-center py-8">
              {nav.map((item, index) => (
                <motion.div key={item.to} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .18 + index * .07 }}>
                  <NavLink to={item.to} className="flex items-end justify-between border-b hairline-light py-5">
                    <span className="text-[clamp(2.3rem,12vw,4.8rem)] leading-none tracking-[-.06em]">{t(item.label)}</span><span className="mono text-ivory/50">{item.number}</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="site-shell grid gap-3 pb-7">
              <InquiryLink className="btn btn-red w-full" label="Minta penawaran" />
              <LanguageToggle light /><div className="flex gap-5 pt-2"><a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="mono flex min-h-11 items-center gap-2 text-ivory/65"><FacebookMark size={15} /> Facebook</a><a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="mono flex min-h-11 items-center gap-2 text-ivory/65"><Play size={15} /> TikTok</a></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <main id="konten"><Outlet /></main>
      {["/", "/bengkel", "/tentang"].includes(location.pathname) && getWhatsAppNumber() && <motion.a
        href={buildWhatsAppUrl({ message: t("Halo HCBTECH, saya ingin berkonsultasi tentang kebutuhan mesin atau fabrikasi."), language }) ?? "/kontak"}
        target="_blank" rel="noreferrer"
        aria-label={t("Chat WhatsApp HCBTECH di {number}", { number: formatWhatsAppNumber() })}
        className="fixed bottom-6 right-6 z-40 hidden min-h-14 items-center gap-3 border border-ivory/20 bg-graphite px-5 py-3 text-ivory shadow-2xl transition-colors hover:bg-industrial md:flex"
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7 }}
      ><MessageCircle size={19} aria-hidden="true" /><span><span className="mono block text-ivory/55">{t("WhatsApp HCBTECH")}</span><span className="mt-0.5 block text-sm font-medium">{formatWhatsAppNumber()}</span></span><ArrowUpRight size={16} aria-hidden="true" /></motion.a>}
      <footer className="bg-graphite text-ivory">
        <div className="site-shell py-24 md:py-32">
          <div className="grid gap-12 border-b hairline-light pb-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="mono mb-6 text-ivory/50"><span className="text-industrial">05</span> / {t("Mulai dari kebutuhan")}</p>
              <h2 className="display-md max-w-4xl">{t("Kerja nyata dimulai dari spesifikasi yang jelas.")}</h2>
            </div>
            <div className="flex items-end lg:col-span-4 lg:justify-end"><InquiryLink className="btn btn-red" label="Diskusikan kebutuhan" /></div>
          </div>
          <div className="grid gap-10 pt-10 md:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-5"><Logo light /><p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/55">{t("Katalog mesin dan fabrikasi Indonesia. Foto, spesifikasi, harga, dan model hanya dipublikasikan sesuai status verifikasinya.")}</p></div>
            <div className="lg:col-span-3"><p className="mono mb-5 text-ivory/40">{t("Navigasi")}</p><div className="grid gap-3">{nav.map((item) => <Link key={item.to} to={item.to} className="flex min-h-8 items-center text-sm text-ivory/75 hover:text-ivory">{t(item.label)}<ArrowUpRight className="ml-2" size={13} /></Link>)}</div></div>
            <div className="lg:col-span-4"><p className="mono mb-5 text-ivory/40">{t("Dokumentasi sosial")}</p><div className="grid gap-3"><a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="flex min-h-8 items-center text-sm text-ivory/75 hover:text-ivory"><FacebookMark size={15} className="mr-3" /> Anto Nugraha<ArrowUpRight className="ml-2" size={13} /></a><a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="flex min-h-8 items-center text-sm text-ivory/75 hover:text-ivory"><Play size={15} className="mr-3" /> @mangatto_cees<ArrowUpRight className="ml-2" size={13} /></a></div></div>
          </div>
          <div className="mt-14 flex flex-col gap-3 border-t hairline-light pt-5 md:flex-row md:items-center md:justify-between"><p className="mono text-ivory/40">© {new Date().getFullYear()} HCBTECH / Indonesia</p><p className="mono text-ivory/40">{getWhatsAppNumber() ? t("WhatsApp bisnis terhubung") : t("WhatsApp belum dikonfigurasi — formulir & Facebook aktif")}</p></div>
        </div>
      </footer>
    </>
  );
}
