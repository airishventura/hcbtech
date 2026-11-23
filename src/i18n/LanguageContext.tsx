import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { englishText, englishReady, loadEnglish } from "./load-English";
import { localizeProducts, localizeSite } from "./localize";
import { readStored, writeStored } from "../lib/storage";

export type Language = "id" | "en";
type Variables = Record<string, string | number>;
interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  t: (text: string, variables?: Variables) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: unknown): value is Language {
  return value === "id" || value === "en";
}

function initialLanguage(query: string | null): Language {
  if (isLanguage(query)) return query;
  const stored = readStored<unknown>("hcbtech-language", "id");
  return isLanguage(stored) ? stored : "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [language, setLanguageState] = useState<Language>(() => initialLanguage(searchParams.get("lang")));
  const pendingLanguage = useRef<Language | null>(null);

  const setLanguage = useCallback(async (next: Language) => {
    if (next === "en") await loadEnglish();
    pendingLanguage.current = next;
    setLanguageState(next);
    writeStored("hcbtech-language", next);
    const params = new URLSearchParams(searchParams);
    if (next === "en") params.set("lang", "en"); else params.delete("lang");
    setSearchParams(params, { replace: true, preventScrollReset: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const query = searchParams.get("lang");
    // Router navigation may commit after the local preference update.
    // Do not restore the old query language during that transition.
    if (pendingLanguage.current) {
      if ((isLanguage(query) ? query : "id") !== pendingLanguage.current) return;
      pendingLanguage.current = null;
    }
    if (isLanguage(query) && query !== language) setLanguageState(query);
    if (!isLanguage(query) && language === "en") {
      const params = new URLSearchParams(searchParams);
      params.set("lang", "en");
      setSearchParams(params, { replace: true, preventScrollReset: true });
    }
    document.documentElement.lang = language;
  }, [language, searchParams, setSearchParams]);

  const toggleLanguage = useCallback(() => setLanguage(language === "id" ? "en" : "id"), [language, setLanguage]);
  const t = useCallback((text: string, variables?: Variables) => {
    let translated = language === "en" ? englishText(text) : text;
    if (variables) for (const [key, value] of Object.entries(variables)) translated = translated.split(`{${key}}`).join(String(value));
    return translated;
  }, [language]);
  const value = useMemo(() => ({ language, toggleLanguage, setLanguage, t }), [language, toggleLanguage, setLanguage, t]);
  if (language === "en" && !englishReady()) throw loadEnglish();
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function useContent() {
  const { language, t } = useLanguage();
  return useMemo(() => ({ language, t, products: localizeProducts(t, language), ...localizeSite(t) }), [language, t]);
}
