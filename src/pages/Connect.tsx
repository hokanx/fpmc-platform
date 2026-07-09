import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Reveal } from "../components/motion/Reveal";
import { WordReveal } from "../components/motion/WordReveal";
import { CONTACT_EMAIL, MAILTO } from "../config";

export function Connect() {
  const { t } = useI18n();
  useDocumentTitle(t("nav.connect"));

  return (
    <section className="px-5 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("connect.kicker")}</p>
        </Reveal>
        <WordReveal as="h1" className="display-lg mt-6 max-w-4xl text-balance" text={t("connect.title")} />
        <Reveal delay={0.1}>
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
        </Reveal>
      </div>
    </section>
  );
}
