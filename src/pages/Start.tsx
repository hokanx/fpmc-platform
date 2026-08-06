/* FPMC — Start. The landing page.
 *
 * Order (FPMC, 06.08.2026): the animated-logo film hero, then the social clips
 * laid out fixed, then the follow CTA, then the release with the countdown and
 * the song details. The house, the manifesto and the numbers close it out.
 *
 * The hero film IS the animated logo, so it carries no code-registered mark and
 * the chapter copy sits in the upper band — the centre of the frame stays free.
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
  ARTIST,
  GIVEAWAY,
  GIVEAWAY_VISIBLE,
  REELS,
  RELEASE_AT,
  SOCIAL_ROW,
} from "../config";
import { useI18n } from "../i18n";

import "../cinematic/pages.css";

const SONG_TITLE_ART = "/media/label/song-title.png";
const SONG_TITLE_TEXT = "موسم الهجرة الي الشمال";

export function Start() {
  const { t } = useI18n();
  useReveal();

  useEffect(() => {
    document.title = "FPMC — Film · Music · AI";
  }, []);

  return (
    <div className="fpmc-page fpmc-grain">
      <CineNav />

      <FilmHero
        slug="home"
        ariaLabel="FPMC"
        zone="split"
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
              <a href="#release" className="fpmc-cta fpmc-cta--release">
                {t("start.ch2.cta")}
              </a>
            ),
          },
        ]}
      />

      {/* ---- 1. the social clips, laid out fixed ---- */}
      <div data-reveal>
        <ReelBand
          eyebrow={t("start.reels.eyebrow")}
          title={t("start.reels.title")}
          body={t("start.reels.body")}
          layout="fixed"
          reels={[REELS.radi, REELS.getReady1, REELS.getReady2, REELS.iykyk]}
        />
      </div>

      {/* ---- 2. follow ---- */}
      <section className="fpmc-band" id="follow">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("start.follow.eyebrow")}</span>
          <h2>{t("start.follow.title")}</h2>
          <p className="fpmc-band-body">{t("start.follow.body")}</p>
        </div>
        <div className="fpmc-follow fpmc-follow--prominent" data-reveal>
          {SOCIAL_ROW.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="fpmc-cta fpmc-cta--follow fpmc-cta--follow-solid"
            >
              {s.label} <span style={{ opacity: 0.7 }}>{s.handle}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ---- 3. the release: countdown + song details ---- */}
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
            <span className="fh-eyebrow">{t("start.release.song.eyebrow")}</span>
            <img
              className="fpmc-title-art"
              src={SONG_TITLE_ART}
              alt={SONG_TITLE_TEXT}
              dir="rtl"
              loading="lazy"
              decoding="async"
              style={{ margin: "1.4rem 0 1.8rem" }}
            />
            <div className="fpmc-artist-meta">
              <dl>
                <dt>{t("start.release.song.artistLabel")}</dt>
                <dd>
                  <a href={ARTIST.instagram} target="_blank" rel="noreferrer noopener">
                    {ARTIST.name}
                  </a>
                </dd>
              </dl>
            </div>

            <div style={{ marginTop: "2.4rem" }}>
              <h3>{t("start.release.signup.title")}</h3>
              <p className="fpmc-band-body">{t("start.release.signup.body")}</p>
              <NotifyForm />
            </div>

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

      {/* ---- 4. the house: three trades ---- */}
      <section className="fpmc-band" id="house">
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

      {/* ---- 5. manifesto rail ---- */}
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

      {/* ---- 6. numbers ---- */}
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
        <p style={{ marginTop: "3rem" }} data-reveal>
          <Link to="/arbeit" className="fpmc-cta fpmc-cta--enquire">
            {t("nav.arbeit")} →
          </Link>
        </p>
      </section>

      <CineFoot />
    </div>
  );
}
