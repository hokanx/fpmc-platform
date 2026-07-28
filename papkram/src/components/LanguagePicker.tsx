import { OUT_LANGS, type OutLang } from "../../api/_lib/schema";
import { LABELS, LANG_NAMES } from "../i18n/labels";
import { TranslateIcon } from "./icons";

type Props = {
  current: OutLang;
  busy: boolean;
  onPick: (lang: OutLang) => void;
};

/**
 * Languages are listed by their endonym — a picker you can only navigate if you
 * already read German defeats the point. The five targets match the groups most
 * likely to be holding a German official letter they can't read.
 */
export default function LanguagePicker({ current, busy, onPick }: Props) {
  const l = LABELS[current];

  return (
    <section aria-labelledby="sprache-titel">
      <h2
        id="sprache-titel"
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-soft"
      >
        <TranslateIcon className="h-5 w-5" />
        {l.spracheWaehlen}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {OUT_LANGS.map((lang) => {
          const active = lang === current;
          return (
            <button
              key={lang}
              type="button"
              lang={lang}
              disabled={busy || active}
              aria-current={active ? "true" : undefined}
              onClick={() => onPick(lang)}
              className={`min-h-[3rem] rounded-full border-2 px-5 py-2 font-bold transition-colors disabled:cursor-default ${
                active
                  ? "border-action bg-action text-white"
                  : "border-line-strong bg-surface text-ink hover:border-ink disabled:opacity-50"
              }`}
            >
              {LANG_NAMES[lang]}
            </button>
          );
        })}
      </div>

      {busy && (
        <p role="status" aria-live="polite" className="mt-3 text-ink-soft">
          {l.uebersetzen}
        </p>
      )}
    </section>
  );
}
