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
      <section id="services" className="border-t border-graphite/60 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl">{t("services.title")}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {SERVICE_KEYS.map((key) => (
              <ServiceCard
                key={key}
                title={t(`services.${key}.title`)}
                body={t(`services.${key}.body`)}
              />
            ))}
          </div>
          <div className="mt-10">
            <a href={MAILTO} className="btn">
              {t("services.cta")}
            </a>
          </div>
        </div>
      </section>

      {/* First-chapter teaser (no name reveal) */}
      <section className="border-t border-graphite/60 px-5 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-ash">
            {t("teaser.label")}
          </p>
          <p className="mt-4 font-display text-xl uppercase tracking-widest sm:text-2xl">
            {t("teaser.text")} <span aria-hidden="true">⏳</span>
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-graphite/60 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl">{t("contact.title")}</h2>
          <p className="mt-5 max-w-xl text-ash">{t("contact.body")}</p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a href={MAILTO} className="btn">
              {t("contact.cta")}
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
    </>
  );
}
