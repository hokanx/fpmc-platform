import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { CONTACT_EMAIL, MAILTO } from "../config";

export function Connect() {
  const { t } = useI18n();
  useDocumentTitle(t("nav.connect"));

  return (
    <section className="px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow">{t("connect.kicker")}</p>
        <h1 className="display-lg mt-6 max-w-4xl">{t("connect.title")}</h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-light/85">
          {t("connect.body")}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <a href={MAILTO} className="btn btn-fill">
            {t("connect.cta")}
          </a>
          <a
            href={MAILTO}
            className="font-display text-lg uppercase tracking-wide text-ash transition-colors hover:text-light"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
