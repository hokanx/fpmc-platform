import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { CONTACT_EMAIL, MAILTO } from "../config";

export function Connect() {
  const { t } = useI18n();
  useDocumentTitle(t("nav.connect"));

  return (
    <section className="px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="text-[0.7rem] uppercase tracking-[0.35em] text-ash">
          {t("connect.kicker")}
        </p>
        <h1 className="mt-5 text-3xl sm:text-4xl">{t("connect.title")}</h1>
        <p className="mt-7 text-lg leading-relaxed text-light/90">
          {t("connect.body")}
        </p>
        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a href={MAILTO} className="btn">
            {t("connect.cta")}
          </a>
          <a
            href={MAILTO}
            className="text-sm tracking-wide text-ash transition-colors hover:text-light"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
