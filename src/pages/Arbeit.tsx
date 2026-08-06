/* FPMC — Arbeit. The portfolio, categorised: websites, film & music video,
 * podcast — plus what we build for businesses. Everything here is real: four
 * live client websites, and states named honestly where work is still coming.
 */
import { useEffect } from "react";

import { FilmHero } from "../cinematic/film-hero";
import { useReveal } from "../cinematic/use-reveal";
import { CineFoot, CineNav } from "../components/CineNav";
import { ReelBand } from "../components/ReelBand";
import { MAILTO, REELS, WEBSITES } from "../config";
import { useI18n } from "../i18n";

import "../cinematic/pages.css";

export function Arbeit() {
  const { t } = useI18n();
  useReveal();

  useEffect(() => {
    document.title = "FPMC — Arbeit";
  }, []);

  const categories = [
    {
      title: t("arbeit.cats.web.title"),
      body: t("arbeit.cats.web.body"),
      state: t("arbeit.cats.web.state"),
      href: "#websites",
    },
    {
      title: t("arbeit.cats.film.title"),
      body: t("arbeit.cats.film.body"),
      state: t("arbeit.cats.film.state"),
      href: "/label",
    },
    {
      title: t("arbeit.cats.pod.title"),
      body: t("arbeit.cats.pod.body"),
      state: t("arbeit.cats.pod.state"),
      href: null,
    },
  ];

  const services = [
    { title: t("arbeit.services.aivideo.title"), body: t("arbeit.services.aivideo.body"), icon: "/media/icons/icon-01.png" },
    { title: t("arbeit.services.websites.title"), body: t("arbeit.services.websites.body"), icon: "/media/icons/icon-04.png" },
    { title: t("arbeit.services.boost.title"), body: t("arbeit.services.boost.body"), icon: "/media/icons/icon-06.png" },
    { title: t("arbeit.services.artists.title"), body: t("arbeit.services.artists.body"), icon: "/media/icons/icon-02.png" },
  ];

  return (
    <div className="fpmc-page fpmc-grain">
      <CineNav />

      <FilmHero
        slug="arbeit"
        ariaLabel={t("arbeit.ch1.title")}
        mark={{
          left: "55%",
          top: "45%",
          width: "16%",
          transform: "translate(-50%, -50%) perspective(800px) rotateY(14deg) rotateZ(-2deg)",
          blend: "screen",
          opacity: 0.5,
        }}
        chapters={[
          {
            eyebrow: t("arbeit.ch1.eyebrow"),
            title: t("arbeit.ch1.title"),
            line: t("arbeit.ch1.line"),
            align: "left",
          },
          {
            eyebrow: t("arbeit.ch2.eyebrow"),
            title: t("arbeit.ch2.title"),
            line: t("arbeit.ch2.line"),
            align: "right",
            actions: (
              <a href="#websites" className="fpmc-cta fpmc-cta--release">
                {t("arbeit.ch2.cta")}
              </a>
            ),
          },
        ]}
      />

      {/* ---- categories: numbered rows ---- */}
      <section className="fpmc-band">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("arbeit.cats.eyebrow")}</span>
          <h2>{t("arbeit.cats.title")}</h2>
        </div>
        <div className="fpmc-rows" data-reveal>
          {categories.map((c, i) => (
            <div className="fpmc-row" key={c.title}>
              <span className="fpmc-row-index">0{i + 1}</span>
              <div>
                <h3>
                  {c.href ? (
                    <a href={c.href} style={{ textDecoration: "none" }}>
                      {c.title}
                    </a>
                  ) : (
                    c.title
                  )}
                </h3>
                <p>{c.body}</p>
              </div>
              <span className="fpmc-row-state">{c.state}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- websites: staggered cards, real live links ---- */}
      <section className="fpmc-band" id="websites">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("arbeit.sites.eyebrow")}</span>
          <h2>{t("arbeit.sites.title")}</h2>
          <p className="fpmc-band-body">{t("arbeit.sites.body")}</p>
        </div>
        <div className="fpmc-cards" data-reveal>
          {WEBSITES.map((w) => (
            <a
              key={w.name}
              className="fpmc-card"
              href={w.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="fpmc-card-kind">
                {w.kind} · {w.city}
              </span>
              <h3>{w.name}</h3>
              <span className="fpmc-card-go">{t("arbeit.sites.visit")} →</span>
            </a>
          ))}
        </div>
      </section>

      {/* ---- behind the scenes ---- */}
      <div data-reveal>
        <ReelBand
          eyebrow={t("arbeit.reels.eyebrow")}
          title={t("arbeit.reels.title")}
          reels={[REELS.iykyk, REELS.getReady2]}
        />
      </div>

      {/* ---- services ---- */}
      <section className="fpmc-band" id="leistungen">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("arbeit.services.eyebrow")}</span>
          <h2>{t("arbeit.services.title")}</h2>
        </div>
        <div className="fpmc-trades" data-reveal>
          {services.map((s) => (
            <article className="fpmc-trade" key={s.title}>
              <img src={s.icon} alt="" aria-hidden />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: "3rem" }} data-reveal>
          <a href={MAILTO} className="fpmc-cta fpmc-cta--enquire">
            {t("arbeit.services.cta")}
          </a>
        </p>
      </section>

      <CineFoot />
    </div>
  );
}
