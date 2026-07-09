import { LOCALES, useI18n, type Locale } from "../i18n";

// DE / EN / AR toggle. AR is stubbed but selectable — proves RTL flips.
export function LangSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={t("lang.label")}
    >
      {LOCALES.map((code: Locale, i) => {
        const active = code === locale;
        return (
          <span key={code} className="flex items-center">
            {i > 0 && <span className="text-graphite px-1">·</span>}
            <button
              type="button"
              onClick={() => setLocale(code)}
              aria-current={active ? "true" : undefined}
              className={
                "text-xs tracking-widest uppercase transition-colors " +
                (active ? "text-light" : "text-ash hover:text-light")
              }
            >
              {code}
            </button>
          </span>
        );
      })}
    </div>
  );
}
