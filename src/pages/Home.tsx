import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Reveal } from "../components/motion/Reveal";
import { WordReveal } from "../components/motion/WordReveal";
import { Stagger, StaggerItem } from "../components/motion/Stagger";
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
        <div className="mx-auto max-w-6xl">
          <WordReveal as="h2" className="max-w-4xl text-balance" text={t("services.title")} />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
            {SERVICE_KEYS.map((key) => (
              <StaggerItem key={key} className="h-full">
                <ServiceCard title={t(`services.${key}.title`)} body={t(`services.${key}.body`)} />
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <a href={MAILTO} className="btn btn-fill">
              {t("services.cta")}
            </a>
          </Reveal>
        </div>
      </section>

      {/* First-chapter teaser — poster statement */}
      <section className="border-t border-dotted border-light/20 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="badge">{t("teaser.label")}</span>
          </Reveal>
          <WordReveal
            as="p"
            className="display-lg mt-6 text-balance"
            text={`${t("teaser.text")} ⏳`}
          />
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-dotted border-light/20 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <WordReveal as="h2" className="text-balance" text={t("contact.title")} />
          <Reveal>
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
        </div>
      </section>
    </>
  );
}
