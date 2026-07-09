import { useI18n } from "../i18n";
import { Logo } from "./Logo";
import { MAILTO } from "../config";

// Cinematic still generated with Higgsfield (achromatic beam-room). Drop the file
// at public/media/hero.jpg and it takes over; until then it fails gracefully to the
// CSS projector-beam below (onError hides the <img>, revealing the beam).
const HERO_IMAGE = "/media/hero.jpg";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden px-5 py-24">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="hero-beam" />
        <div className="hero-haze" />
        {HERO_IMAGE && (
          <img
            src={HERO_IMAGE}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            decoding="async"
          />
        )}
        {/* scrims keep the poster type legible over the still */}
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-start">
        <p className="eyebrow">{t("hero.kicker")}</p>
        <h1 className="sr-only">FPMC — {t("hero.kicker")}</h1>
        <Logo className="hero-logo mt-6 w-[min(88vw,760px)]" />
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-light/85">
          {t("hero.tagline")}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href={MAILTO} className="btn btn-fill">
            {t("hero.cta")}
          </a>
          <a href="#services" className="btn">
            {t("hero.scroll")}
          </a>
        </div>
      </div>
    </section>
  );
}
