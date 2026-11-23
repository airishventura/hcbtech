import type { ComponentType } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
export interface PageComponents { Home: ComponentType; About: ComponentType; Catalog: ComponentType; Contact: ComponentType; ProductDetail: ComponentType; Workshop: ComponentType; CatalogEditor: ComponentType; NotFound: ComponentType; }
export default function SiteRoutes({ pages: P }: { pages: PageComponents }) {
  return <Routes><Route element={<Layout />}>
    <Route index element={<P.Home />} /><Route path="mesin" element={<P.Catalog />} />
    <Route path="mesin/:slug" element={<P.ProductDetail />} /><Route path="bengkel" element={<P.Workshop />} />
    <Route path="tentang" element={<P.About />} /><Route path="kontak" element={<P.Contact />} />
    <Route path="kelola-katalog" element={<P.CatalogEditor />} />
    <Route path="*" element={<P.NotFound />} />
  </Route></Routes>;
}
