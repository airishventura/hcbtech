import { forwardRef } from "react";
import { Link as RouterLink, NavLink as RouterNavLink, type LinkProps, type NavLinkProps, type To } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
function localized(to: To, language: string): To {
  if (language !== "en") return to;
  if (typeof to === "string") {
    if (!to.startsWith("/")) return to;
    const url = new URL(to, "https://hcbtech.invalid");
    if (!url.searchParams.has("lang")) url.searchParams.set("lang", "en");
    return url.pathname + url.search + url.hash;
  }
  const params = new URLSearchParams(to.search);
  if (!params.has("lang")) params.set("lang", "en");
  return { ...to, search: `?${params}` };
}
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...props }, ref) {
  const { language } = useLanguage();
  return <RouterLink {...props} to={localized(to, language)} ref={ref} />;
});
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ to, ...props }, ref) {
  const { language } = useLanguage();
  return <RouterNavLink {...props} to={localized(to, language)} ref={ref} />;
});
