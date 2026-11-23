import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App, { preparePage } from "./App";
import { loadEnglish } from "./i18n/load-English";

document.documentElement.dataset.js = "true";

async function start() {
const requested = new URLSearchParams(location.search).get("lang");
let language = requested;
try { language ??= JSON.parse(localStorage.getItem("hcbtech-language") ?? '"id"'); } catch { /* storage is optional */ }
await Promise.all([preparePage(location.pathname), language === "en" ? loadEnglish() : Promise.resolve()]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

}
void start();
