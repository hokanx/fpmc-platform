import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "../i18n";
import { Logo } from "./Logo";
import { MAILTO } from "../config";

// Cinematic assets generated with Higgsfield/Seedance. Both fail gracefully:
// video → image → CSS beam. Drop the files in public/media/ and they take over.
const HERO_VIDEO = "/media/hero-loop.mp4";
const HERO_IMAGE = "/media/hero.png";

export function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-scrub: as the hero scrolls out, the wordmark scales down + drifts up,
  // content fades, and the loop parallaxes behind it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.72]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);

  const hide = (e: { currentTarget: HTMLElement }) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 py-24"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduce ? undefined : { y: bgY, scale: bgScale }}
        aria-hidden="true"
      >
        <div className="hero-beam" />
        <div className="hero-haze" />
        {HERO_IMAGE && (
          <img
            src={HERO_IMAGE}
            alt=""
            onError={hide}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            decoding="async"
          />
        )}
        {HERO_VIDEO && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_IMAGE || undefined}
            onError={hide}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
      </motion.div>

      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col items-start"
        style={reduce ? undefined : { opacity: fade }}
      >
        <p className="eyebrow">{t("hero.kicker")}</p>
        <h1 className="sr-only">FPMC — {t("hero.kicker")}</h1>
        <motion.div
          className="origin-left"
          style={reduce ? undefined : { scale: logoScale, y: logoY }}
        >
          <Logo className="hero-logo w-[min(88vw,680px)]" />
        </motion.div>
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
      </motion.div>
    </section>
  );
}
