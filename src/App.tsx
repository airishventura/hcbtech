import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import SiteRoutes from "./routes";
import Home from "./pages/Home";
import { LanguageProvider } from "./i18n/LanguageContext";
const pages = {
  Home,
  About: lazy(() => import("./pages/About")), Catalog: lazy(() => import("./pages/Catalog")),
  Contact: lazy(() => import("./pages/Contact")), ProductDetail: lazy(() => import("./pages/ProductDetail")),
  Workshop: lazy(() => import("./pages/Workshop")), NotFound: lazy(() => import("./pages/NotFound")),
  CatalogEditor: lazy(() => import("./pages/CatalogEditor")),
};
export async function preparePage(path: string) {
  if (path.startsWith("/mesin/")) await import("./pages/ProductDetail");
  else if (path === "/mesin") await import("./pages/Catalog");
  else if (path === "/kontak") await import("./pages/Contact");
  else if (path === "/bengkel") await import("./pages/Workshop");
  else if (path === "/tentang") await import("./pages/About");
  else if (path === "/kelola-katalog") await import("./pages/CatalogEditor");
  else if (path !== "/") await import("./pages/NotFound");
}
export default function App() {
  return <BrowserRouter><Suspense fallback={<div className="site-shell min-h-screen pt-32" role="status">HCBTECH…</div>}><LanguageProvider><SiteRoutes pages={pages} /></LanguageProvider></Suspense></BrowserRouter>;
}
