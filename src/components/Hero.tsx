import { useI18n } from "../i18n";
import { Logo } from "./Logo";
import { MAILTO } from "../config";

// Hero motion source. Empty today → the CSS projector-beam renders instead.
// Drop the compressed Higgsfield loop at public/media/hero-loop.mp4 (≤ 4 MB,
// muted/loop/playsinline) and set this to "/media/hero-loop.mp4" — no other change.
const HERO_VIDEO_SRC = "";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative isolate flex min-h-[86vh] items-center justify-center overflow-hidden px-5 py-24">
      {/* Motion layer */}
      {HERO_VIDEO_SRC ? (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="hero-beam" />
          <div className="hero-haze" />
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <h1 className="sr-only">FPMC — {t("hero.kicker")}</h1>
        <Logo className="hero-logo w-[min(76vw,400px)]" />
        <p className="mt-8 text-[0.7rem] uppercase tracking-[0.35em] text-ash">
          {t("hero.kicker")}
        </p>
        <p className="mt-5 max-w-md text-base leading-relaxed text-light/90">
          {t("hero.tagline")}
        </p>
        <a href={MAILTO} className="btn mt-9">
          {t("hero.cta")}
        </a>
        <a
          href="#services"
          className="mt-14 text-xs uppercase tracking-widest text-ash transition-colors hover:text-light"
        >
          {t("hero.scroll")} ↓
        </a>
      </div>
    </section>
  );
}
