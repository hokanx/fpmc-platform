import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Reveal } from "../components/motion/Reveal";
import { ServiceCard } from "../components/ServiceCard";
import { CONTACT_EMAIL, MAILTO } from "../config";

const SERVICE_KEYS = ["aivideo", "websites", "boost", "artists"] as const;

export function Home() {
  const { t } = useI18n();
  useDocumentTitle("");

  return (
    <>
      <Hero />

      <Marquee text="Film · Music · AI · DACH × MENA · Cinematic · 48h" />

      {/* Services */}
      <section id="services" className="px-5 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-6xl">
          <h2 className="max-w-4xl text-balance">{t("services.title")}</h2>
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
        </Reveal>
      </section>

      {/* First-chapter teaser — poster statement */}
      <section className="border-t border-dotted border-light/20 px-5 py-24">
        <Reveal className="mx-auto max-w-6xl">
          <span className="badge">{t("teaser.label")}</span>
          <p className="display-lg mt-6 text-balance">
            {t("teaser.text")} <span aria-hidden="true">⏳</span>
          </p>
        </Reveal>
      </section>

      {/* Contact */}
      <section className="border-t border-dotted border-light/20 px-5 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-6xl">
          <h2 className="text-balance">{t("contact.title")}</h2>
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
        </Reveal>
      </section>
    </>
  );
}
