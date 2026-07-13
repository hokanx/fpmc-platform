/* FPMC /links — link-in-bio, rebuilt in the Lichtspiel v2 cinematic language.
 * Deliberately LIGHT: no GSAP/Lenis, CSS-only entrances, zero third-party.
 * Same void-black stage as the home: grain, vignette, beam glow, monogram. */
import { Link } from "react-router-dom";

import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Cursor, Magnetic } from "../cinematic/motion";
import { LangSwitch } from "../cinematic/sections";
import { MAILTO, SOCIALS } from "../config";
import "../cinematic/cinematic.css";

const LOGO = "/fpmc-logo.svg";

export function Links() {
  const { t } = useI18n();
  useDocumentTitle(t("nav.links"));

  const buttons: { label: string; href: string; external: boolean; primary?: boolean }[] = [
    { label: t("links.youtube"), href: SOCIALS.youtube, external: true, primary: true },
    { label: t("links.instagram"), href: SOCIALS.instagram, external: true },
    { label: t("links.tiktok"), href: SOCIALS.tiktok, external: true },
    { label: t("links.contact"), href: MAILTO, external: false },
  ];

  return (
    <div className="fpmc" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4.5rem 1.5rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* projector glow behind the monogram */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 38% at 50% 18%, rgba(242,242,242,0.08), transparent 70%)",
          }}
        />
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h1 className="sr-only">FPMC — {t("links.tagline")}</h1>
          <Link to="/" aria-label="FPMC — home" className="rise-in" style={{ display: "inline-flex" }}>
            <img src={LOGO} alt="FPMC" style={{ width: 170, height: "auto" }} />
          </Link>
          <p className="fpmc-eyebrow rise-in" style={{ marginTop: "1.6rem", animationDelay: "0.08s" }}>
            {t("links.tagline")}
          </p>

          <nav
            aria-label="FPMC links"
            style={{ marginTop: "2.8rem", width: "100%", display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {buttons.map((b, i) => (
              <span
                key={b.label}
                className="rise-in"
                style={{ animationDelay: `${0.16 + i * 0.07}s`, display: "block", width: "100%" }}
              >
                <Magnetic strength={0.18}>
                  <a
                    href={b.href}
                    className={b.primary ? "fpmc-cta-primary" : "fpmc-cta-ghost"}
                    style={{ display: "block", width: "100%", textAlign: "center" }}
                    {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {b.label}
                  </a>
                </Magnetic>
              </span>
            ))}
          </nav>

          <p
            className="fpmc-eyebrow rise-in"
            style={{ marginTop: "2.2rem", animationDelay: `${0.16 + buttons.length * 0.07}s` }}
          >
            {t("links.soon")}
          </p>
        </div>
      </main>

      <footer style={{ padding: "0 1.5rem 2rem" }}>
        <nav
          style={{
            display: "flex",
            gap: "1.4rem",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
            fpmc.house
          </Link>
          <Link to="/studio" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
            {t("nav.studio")}
          </Link>
          <Link to="/impressum" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
            {t("footer.impressum")}
          </Link>
          <Link to="/datenschutz" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
            {t("footer.datenschutz")}
          </Link>
          <LangSwitch />
        </nav>
      </footer>

      <Cursor />
      <div className="fpmc-vignette" aria-hidden />
      <div className="fpmc-grain" aria-hidden />
    </div>
  );
}
