/* FPMC — Label. The record side of the house: what we release, the artist of
 * the first chapter, the release itself, and the collab call.
 *
 * SONG_TITLE_ART: drop the transparent song-title PNG into
 * public/media/label/song-title.png and set the constant below to that path.
 * Until then the slot renders as an honest placeholder instead of a guess.
 */
import { useEffect } from "react";

import { FilmHero } from "../cinematic/film-hero";
import { useReveal } from "../cinematic/use-reveal";
import { CineFoot, CineNav } from "../components/CineNav";
import { Countdown } from "../components/Countdown";
import { NotifyForm } from "../components/NotifyForm";
import { ReelBand } from "../components/ReelBand";
import { ARTIST, MAILTO, REELS, RELEASE_AT } from "../config";
import { useI18n } from "../i18n";

import "../cinematic/pages.css";

const SONG_TITLE_ART: string | null = null; // e.g. "/media/label/song-title.png"

export function Label() {
  const { t } = useI18n();
  useReveal();

  useEffect(() => {
    document.title = "FPMC — Label";
  }, []);

  return (
    <div className="fpmc-page fpmc-grain">
      <CineNav />

      <FilmHero
        slug="label"
        ariaLabel={t("label.ch1.title")}
        mark={{
          left: "51%",
          top: "50%",
          width: "11%",
          transform: "translate(-50%, -50%)",
          blend: "multiply",
          opacity: 0.9,
        }}
        chapters={[
          {
            eyebrow: t("label.ch1.eyebrow"),
            title: t("label.ch1.title"),
            line: t("label.ch1.line"),
            align: "left",
          },
          {
            eyebrow: t("label.ch2.eyebrow"),
            title: t("label.ch2.title"),
            line: t("label.ch2.line"),
            align: "right",
            actions: (
              <a href={MAILTO} className="fpmc-cta fpmc-cta--release">
                {t("label.ch2.cta")}
              </a>
            ),
          },
        ]}
      />

      {/* ---- artist: diptych ---- */}
      <section className="fpmc-band" id="artist">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("label.artist.eyebrow")}</span>
          <h2>{t("label.artist.title")}</h2>
          <p className="fpmc-band-body">{t("label.artist.body")}</p>
        </div>
        <div className="fpmc-artist" data-reveal>
          <div>
            {SONG_TITLE_ART ? (
              <img className="fpmc-title-art" src={SONG_TITLE_ART} alt="" aria-hidden />
            ) : (
              <div className="fpmc-title-art-pending">{t("label.artist.titleart.pending")}</div>
            )}
          </div>
          <div className="fpmc-artist-meta">
            <dl>
              <dt>{t("label.artist.role")}</dt>
              <dd>{t("label.artist.role.value")}</dd>
              <dt>{t("label.artist.followers")}</dt>
              <dd>{ARTIST.followers.toLocaleString("de-DE")}</dd>
            </dl>
            <p>
              <a
                href={ARTIST.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="fpmc-cta fpmc-cta--follow"
              >
                {t("label.artist.profile")}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---- release ---- */}
      <section id="release" aria-labelledby="label-release-title">
        <div className="fpmc-release">
          <div data-reveal>
            <span className="fh-eyebrow">{t("label.release.eyebrow")}</span>
            <h2 id="label-release-title" className="fpmc-release-when">
              {t("label.release.title")}
            </h2>
            <p className="fpmc-release-note">{t("label.release.note")}</p>
            <Countdown target={RELEASE_AT} />
          </div>
          <div data-reveal>
            <h3>{t("start.release.signup.title")}</h3>
            <p className="fpmc-band-body">{t("start.release.signup.body")}</p>
            <NotifyForm />
          </div>
        </div>
      </section>

      {/* ---- the clip ---- */}
      <div data-reveal>
        <ReelBand
          eyebrow={t("label.reels.eyebrow")}
          title={t("label.reels.title")}
          body={t("label.reels.body")}
          reels={[REELS.radi]}
        />
      </div>

      {/* ---- collab ---- */}
      <section className="fpmc-band" id="collab">
        <div className="fpmc-band-head" data-reveal>
          <span className="fh-eyebrow">{t("label.collab.eyebrow")}</span>
          <h2>{t("label.collab.title")}</h2>
          <p className="fpmc-band-body">{t("label.collab.body")}</p>
        </div>
        <p data-reveal>
          <a href={MAILTO} className="fpmc-cta fpmc-cta--enquire">
            {t("label.collab.cta")}
          </a>
        </p>
      </section>

      <CineFoot />
    </div>
  );
}
