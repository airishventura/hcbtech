import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
const About = lazy(() => import("./pages/About"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Contact = lazy(() => import("./pages/Contact"));
import Home from "./pages/Home";
const NotFound = lazy(() => import("./pages/NotFound"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Workshop = lazy(() => import("./pages/Workshop"));
import { spring } from "./lib/motion";
import { LanguageProvider } from "./i18n/LanguageContext";

function AnimatedRoutes() {
  const location = useLocation();
  const reduced = useReducedMotion();
  return <AnimatePresence mode="wait" initial={false}>
    <motion.div key={location.pathname} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={reduced ? { duration: 0 } : spring}>
      <Routes location={location}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mesin" element={<Catalog />} />
          <Route path="mesin/:slug" element={<ProductDetail />} />
          <Route path="bengkel" element={<Workshop />} />
          <Route path="tentang" element={<About />} />
          <Route path="kontak" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </motion.div>
  </AnimatePresence>;
}

export default function App() {
  return <BrowserRouter><LanguageProvider><AnimatedRoutes /></LanguageProvider></BrowserRouter>;
}
