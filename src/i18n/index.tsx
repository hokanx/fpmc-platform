/* FPMC — i18n.
 *
 * The site is ENGLISH ONLY (FPMC decision, 06.08.2026). German and Arabic were
 * removed from the interface together with the language switcher. The `de.json`,
 * `ar.json` and `pages.de.json` dictionaries are deliberately LEFT IN THIS
 * FOLDER, unimported: the German copy is finished work and can be brought back
 * by re-adding it to LOCALES and DICTS. Nothing else in the app needs to change.
 *
 * The `t()` / `locale` / `dir` API is unchanged, so every existing page keeps
 * working untouched.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import en from "./en.json";
import pagesEn from "./pages.en.json";

export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

type Dict = Record<string, string>;
const DICT: Dict = { ...en, ...pagesEn };

function resolve(key: string): string {
  return DICT[key] || key;
}

export function dirFor(_locale: Locale): "rtl" | "ltr" {
  return "ltr";
}

type I18nValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (next: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const t = useCallback((key: string) => resolve(key), []);

  const value = useMemo<I18nValue>(
    () => ({
      locale: DEFAULT_LOCALE,
      dir: "ltr",
      // kept for API compatibility — there is nothing to switch to
      setLocale: () => {},
      t,
    }),
    [t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
