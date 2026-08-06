/* FPMC — Start. The landing page: the house in one breath, the release with a
 * live countdown to 07.08.2026 16:00 German time, the giveaway hint, the real
 * reels, and the follow row. The film hero runs the projector.
 */
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { FilmHero } from "../cinematic/film-hero";
import { useReveal } from "../cinematic/use-reveal";
import { CineFoot, CineNav } from "../components/CineNav";
import { Countdown } from "../components/Countdown";
import { NotifyForm } from "../components/NotifyForm";
import { ReelBand } from "../components/ReelBand";
import {
  GIVEAWAY,
  GIVEAWAY_VISIBLE,
  REELS,
  RELEASE_AT,
  SOCIAL_ROW,
} from "../config";
import { useI18n } from "../i18n";

import "../cinematic/pages.css";

export function Start() {
  const { t } = useI18n();
  useReveal();

  useEffect(() => {
    document.title = "FPMC — Film · Musik · KI";
  }, []);

  return (
    <div className="fpmc-page fpmc-grain">
      <CineNav />

      <FilmHero
        slug="home"
        ariaLabel="FPMC"
        mark={{
          left: "65%",
          top: "48%",
          width: "15%",
          transform: "translate(-50%, -50%) perspective(700px) rotateX(52deg) rotateZ(-10deg)",
          // overlay lets the case's scuffs read through the stencil
          blend: "overlay",
          opacity: 0.8,
          // the beam crosses the lid and leaves the stencil behind it
          reveal: "wipe",
        }}
        chapters={[
          {
            eyebrow: t("start.ch1.eyebrow"),
            title: t("start.ch1.title"),
            line: t("start.ch1.line"),
            align: "left",
          },
          {
            eyebrow: t("start.ch2.eyebrow"),
            title: t("start.ch2.title"),
            line: t("start.ch2.line"),
            align: "right",
            actions: (
              <>
                <a href="#release" className="fpmc-cta fpmc-cta--release">
                  {t("start.ch2.cta")}
                </a>
                <a
                  href={SOCIAL_ROW[0].href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="fpmc-cta fpmc-cta--follow"
                >
                  {t("start.ch2.follow")}
                </a>
              </>
            ),
          },
        ]}
      />

      {/* ---- the house: three trades (editorial grid) ---- */}
      <section className="fpmc-band" id="haus">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("start.house.eyebrow")}</span>
          <h2>{t("start.house.title")}</h2>
          <p className="fpmc-band-body">{t("start.house.body")}</p>
        </div>
        <div className="fpmc-trades" data-reveal>
          <article className="fpmc-trade">
            <img src="/media/icons/icon-01.png" alt="" aria-hidden />
            <h3>{t("start.house.film.title")}</h3>
            <p>{t("start.house.film.body")}</p>
          </article>
          <article className="fpmc-trade">
            <img src="/media/icons/icon-02.png" alt="" aria-hidden />
            <h3>{t("start.house.music.title")}</h3>
            <p>{t("start.house.music.body")}</p>
          </article>
          <article className="fpmc-trade">
            <img src="/media/icons/icon-04.png" alt="" aria-hidden />
            <h3>{t("start.house.ai.title")}</h3>
            <p>{t("start.house.ai.body")}</p>
          </article>
        </div>
      </section>

      {/* ---- manifesto rail (numbered rows) ---- */}
      <section className="fpmc-band">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("start.manifest.eyebrow")}</span>
        </div>
        <ul className="fpmc-manifest" data-reveal>
          <li>
            <p>{t("cin.manifesto.l1")}</p>
          </li>
          <li>
            <p>{t("cin.manifesto.l2")}</p>
          </li>
          <li>
            <p>{t("cin.manifesto.l3")}</p>
          </li>
          <li>
            <p>{t("cin.manifesto.l4")}</p>
          </li>
        </ul>
      </section>

      {/* ---- release: colour-blocked diptych ---- */}
      <section id="release" aria-labelledby="release-title">
        <div className="fpmc-release">
          <div data-reveal>
            <span className="fh-eyebrow">{t("start.release.eyebrow")}</span>
            <h2 id="release-title" className="fpmc-release-when">
              {t("start.release.when")}
            </h2>
            <p className="fpmc-release-note">{t("start.release.note")}</p>
            <Countdown target={RELEASE_AT} />
          </div>
          <div data-reveal>
            <h3>{t("start.release.signup.title")}</h3>
            <p className="fpmc-band-body">{t("start.release.signup.body")}</p>
            <NotifyForm />

            {GIVEAWAY_VISIBLE ? (
              <div className="fpmc-giveaway">
                <span className="fh-eyebrow">{t("start.release.giveaway.title")}</span>
                <p>{t("start.release.giveaway.body")}</p>
                <p style={{ marginTop: "1.2rem" }}>
                  <a
                    href={GIVEAWAY.channelHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="fpmc-cta fpmc-cta--follow"
                  >
                    {GIVEAWAY.channel}
                  </a>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---- reels ---- */}
      <div data-reveal>
        <ReelBand
          eyebrow={t("start.reels.eyebrow")}
          title={t("start.reels.title")}
          body={t("start.reels.body")}
          reels={[REELS.getReady1, REELS.getReady2, REELS.iykyk, REELS.radi]}
        />
      </div>

      {/* ---- numbers: giant numerals ---- */}
      <section className="fpmc-band">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("start.numbers.eyebrow")}</span>
        </div>
        <div className="fpmc-stats" data-reveal>
          <div>
            <div className="fpmc-stat-value">51.2K</div>
            <div className="fpmc-stat-label">{t("cin.numbers.n1")}</div>
          </div>
          <div>
            <div className="fpmc-stat-value">48h</div>
            <div className="fpmc-stat-label">{t("cin.numbers.n2")}</div>
          </div>
          <div>
            <div className="fpmc-stat-value">3</div>
            <div className="fpmc-stat-label">{t("cin.numbers.n3")}</div>
          </div>
          <div>
            <div className="fpmc-stat-value">2</div>
            <div className="fpmc-stat-label">{t("cin.numbers.n4")}</div>
          </div>
        </div>
      </section>

      {/* ---- follow row ---- */}
      <section className="fpmc-band" id="folgen">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("start.follow.eyebrow")}</span>
          <h2>{t("start.follow.title")}</h2>
          <p className="fpmc-band-body">{t("start.follow.body")}</p>
        </div>
        <div className="fpmc-follow" data-reveal>
          {SOCIAL_ROW.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="fpmc-cta fpmc-cta--follow"
            >
              {s.label} <span style={{ opacity: 0.6 }}>{s.handle}</span>
            </a>
          ))}
        </div>
        <p style={{ marginTop: "2.5rem" }} data-reveal>
          <Link to="/arbeit" className="fpmc-cta fpmc-cta--enquire">
            {t("nav.arbeit")} →
          </Link>
        </p>
      </section>

      <CineFoot />
    </div>
  );
}
