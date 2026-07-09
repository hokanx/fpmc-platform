import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Hero } from "../components/Hero";
import { ServiceCard } from "../components/ServiceCard";
import { CONTACT_EMAIL, MAILTO } from "../config";

const SERVICE_KEYS = ["aivideo", "websites", "boost", "artists"] as const;

export function Home() {
  const { t } = useI18n();
  useDocumentTitle("");

  return (
    <>
      <Hero />

      {/* Services */}
      <section
        id="services"
        className="border-t border-dotted border-light/20 px-5 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-4xl">{t("services.title")}</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {SERVICE_KEYS.map((key) => (
              <ServiceCard
                key={key}
                title={t(`services.${key}.title`)}
                body={t(`services.${key}.body`)}
              />
            ))}
          </div>
          <div className="mt-10">
            <a href={MAILTO} className="btn btn-fill">
              {t("services.cta")}
            </a>
          </div>
        </div>
      </section>

      {/* First-chapter teaser — poster statement */}
      <section className="border-t border-dotted border-light/20 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <span className="badge">{t("teaser.label")}</span>
          <p className="display-lg mt-6">
            {t("teaser.text")} <span aria-hidden="true">⏳</span>
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-dotted border-light/20 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2>{t("contact.title")}</h2>
          <p className="mt-6 max-w-xl text-lg text-ash">{t("contact.body")}</p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <a href={MAILTO} className="btn btn-fill">
              {t("contact.cta")}
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
    </>
  );
}
