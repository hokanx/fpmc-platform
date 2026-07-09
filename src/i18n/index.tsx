import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import de from "./de.json";
import en from "./en.json";
import ar from "./ar.json";

export const LOCALES = ["de", "en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "de";
const RTL_LOCALES: Locale[] = ["ar"];
const STORAGE_KEY = "fpmc.locale";

type Dict = Record<string, string>;
const DICTS: Record<Locale, Dict> = { de, en, ar };

// Fallback chain: active locale → EN → DE → the key itself.
// This is what lets AR ship stubbed: missing keys resolve gracefully.
function resolve(locale: Locale, key: string): string {
  return (
    DICTS[locale]?.[key] ||
    DICTS.en?.[key] ||
    DICTS.de?.[key] ||
    key
  );
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

function isLocale(value: string | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

function initialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  // DE is the hard default (spec). Only a prior explicit choice overrides it —
  // no browser-language sniffing, so first load is deterministic German.
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

type I18nValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (next: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Keep <html lang/dir> in sync — RTL mirroring is driven from here.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dirFor(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked — language simply won't persist */
    }
  }, []);

  const t = useCallback((key: string) => resolve(locale, key), [locale]);

  const value = useMemo<I18nValue>(
    () => ({ locale, dir: dirFor(locale), setLocale, t }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
