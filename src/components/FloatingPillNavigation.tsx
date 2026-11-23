import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { NavLink } from "./LocalizedLink";

// Adapted from the supplied Framer FloatingPillNavigation component.
// Keep its shared spring-driven active pill; use real router links for keyboard,
// modified-click, localization, and aria-current support instead of clickable divs.
export default function FloatingPillNavigation({ items }: {
  items: readonly { to: string; label: string; number: string }[];
}) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  return (
    <nav aria-label={t("Navigasi utama")} className="floating-pill hidden lg:inline-flex">
      {items.map(item => (
        <NavLink key={item.to} to={item.to} className="floating-pill-link">
          {({ isActive }) => <>
            {isActive && <motion.span aria-hidden="true" className="floating-pill-active"
              layoutId={reducedMotion ? undefined : `${id}-active`}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 800, damping: 60, mass: 1 }} />}
            <span className="mono floating-pill-number">{item.number}</span><span>{t(item.label)}</span>
          </>}
        </NavLink>
      ))}
    </nav>
  );
}
