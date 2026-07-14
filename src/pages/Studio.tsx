/* FPMC /studio — SMB services page, rebuilt in the Lichtspiel v2 cinematic
 * language (same look as the masterpiece home): void black, grain, haze,
 * split-word titles, beam rules, magnetic CTAs, custom cursor, scroll
 * choreography via Lenis + GSAP. Content unchanged (studio.content.ts).
 * prefers-reduced-motion → static. */
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { BeamRule, Cursor, Magnetic, SplitWords, useTilt } from "../cinematic/motion";
import { LangSwitch } from "../cinematic/sections";
import { studioContent } from "../content/studio.content";
import { CONTACT_EMAIL, MAILTO, SOCIALS, WHATSAPP } from "../config";
import "../cinematic/cinematic.css";

const LOGO = "/fpmc-logo.svg";

type Copy = typeof studioContent.de;

function useStudioCopy(): Copy {
  const { locale } = useI18n();
  return (locale === "en" ? studioContent.en : studioContent.de) as unknown as Copy;
}

/* ---------- shared shell ---------- */

function Shell({
  id,
  eyebrow,
  children,
  wide,
}: {
  id?: string;
  eyebrow?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} style={{ padding: "8rem 1.6rem", position: "relative" }}>
      <div style={{ maxWidth: wide ? 1240 : 980, margin: "0 auto" }}>
        {eyebrow ? (
          <p className="fpmc-eyebrow" data-eyebrow style={{ marginBottom: "3rem" }}>
            {eyebrow}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/* ---------- header ---------- */

function StudioHeader({ c }: { c: Copy }) {
  const { t } = useI18n();
  return (
    <header className="fpmc-header">
      <Link to="/" aria-label="FPMC — home" style={{ display: "inline-flex" }}>
        <img src={LOGO} alt="FPMC" style={{ height: 30, width: "auto" }} />
      </Link>
      <nav>
        <Link to="/" className="fpmc-eyebrow fpmc-nav-link">
          ← {t("nav.home")}
        </Link>
        <a href="#how" className="fpmc-eyebrow fpmc-nav-link">
          {c.nav.services}
        </a>
        <a href="#showreel" className="fpmc-eyebrow fpmc-nav-link">
          {c.nav.work}
        </a>
        <a href="#pricing" className="fpmc-eyebrow fpmc-nav-link">
          {c.nav.pricing}
        </a>
        <a href="#contact" className="fpmc-eyebrow fpmc-nav-link">
          {c.nav.contact}
        </a>
        <LangSwitch />
      </nav>
    </header>
  );
}

/* ---------- hero ---------- */

function StudioHero({ c }: { c: Copy }) {
  return (
    <section
      style={{
        minHeight: "92svh",
        display: "flex",
        alignItems: "center",
        padding: "9rem 1.6rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(242,242,242,0.07), transparent 70%)",
        }}
      />
      <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <p className="fpmc-eyebrow" data-eyebrow style={{ marginBottom: "2.4rem" }}>
          FPMC Studio
        </p>
        <h1
          className="fpmc-display"
          data-split-title="rise"
          style={{
            fontSize: "clamp(2.8rem, 8.5vw, 7rem)",
            margin: "0 0 2rem",
            color: "var(--light)",
            maxWidth: 1100,
          }}
        >
          <SplitWords text={c.hero.headline} />
        </h1>
        <p style={{ color: "var(--ash)", maxWidth: 520, fontSize: "1.05rem", margin: "0 0 2.2rem" }}>
          {c.hero.subline}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem", marginBottom: "2.8rem" }}>
          {c.hero.badges.map((b) => (
            <span
              key={b}
              className="fpmc-eyebrow"
              style={{
                border: "1px dotted rgba(242,242,242,0.35)",
                borderRadius: 999,
                padding: "0.5rem 1.1rem",
              }}
            >
              {b}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.1rem", alignItems: "center" }}>
          <Magnetic>
            <a href="#contact" className="fpmc-cta-primary">
              {c.hero.ctaPrimary}
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#pricing" className="fpmc-cta-ghost">
              {c.hero.ctaSecondary}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/* ---------- marquee (studio words) ---------- */

const STUDIO_MARQUEE = ["Websites", "Film", "Sound", "7 Tage", "KI", "48h"];

function StudioMarquee() {
  const items = [...STUDIO_MARQUEE, ...STUDIO_MARQUEE];
  return (
    <div className="fpmc-marquee" aria-hidden>
      <div className="fpmc-marquee-track">
        {items.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- why (interactive selector) ---------- */

function Why({ c }: { c: Copy }) {
  const [active, setActive] = useState(0);
  return (
    <Shell id="why" eyebrow={c.why.sub}>
      <h2
        className="fpmc-display"
        data-split-title="slide"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", margin: "0 0 3rem", color: "var(--light)" }}
      >
        <SplitWords text={c.why.headline} />
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "0.9rem",
          marginBottom: "3rem",
        }}
      >
        {c.why.reasons.map((r, i) => (
          <button
            key={r.label}
            type="button"
            data-service-card
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            aria-pressed={i === active}
            className="fpmc-card"
            style={{
              padding: "1.4rem 1.1rem",
              cursor: "pointer",
              textAlign: "start",
              borderColor: i === active ? "var(--light)" : undefined,
              color: "var(--light)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              fontSize: "0.95rem",
              background: "var(--carbon)",
            }}
          >
            <span className="fpmc-craft-index" style={{ display: "block", marginBottom: "0.5rem" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {r.label}
          </button>
        ))}
      </div>
      <p
        className="fpmc-display"
        style={{ fontSize: "clamp(1.7rem, 4vw, 3rem)", margin: 0, color: "var(--light)", minHeight: "2.6em" }}
      >
        {c.why.reasons[active].line}
      </p>
    </Shell>
  );
}

/* ---------- team + counters ---------- */

function Team({ c }: { c: Copy }) {
  return (
    <Shell id="team" eyebrow={c.team.sub} wide>
      <h2
        className="fpmc-display"
        data-split-title="flip"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", margin: "0 0 3.6rem", color: "var(--light)" }}
      >
        <SplitWords text={c.team.headline} />
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.4rem",
          marginBottom: "3.2rem",
        }}
      >
        {c.team.members.map((m) => (
          <article key={m.name} data-service-card className="fpmc-card" style={{ padding: "2rem 1.7rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "1.3rem",
                margin: "0 0 0.9rem",
                color: "var(--light)",
              }}
            >
              {m.name}
            </h3>
            <p style={{ color: "var(--ash)", fontSize: "0.92rem", margin: "0 0 1rem" }}>{m.role}</p>
            <p className="fpmc-eyebrow" style={{ margin: 0 }}>
              {m.langs}
            </p>
          </article>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "2.4rem",
          borderTop: "1px dotted rgba(242,242,242,0.3)",
          paddingTop: "2.6rem",
        }}
      >
        {c.team.counters.map((k) => (
          <div key={k.label} data-number-cell>
            <p
              className="fpmc-display"
              style={{ fontSize: "clamp(2.6rem, 6vw, 4.6rem)", margin: 0, color: "var(--light)" }}
            >
              {k.value}
            </p>
            <p className="fpmc-eyebrow" style={{ marginTop: "0.7rem" }}>
              {k.label}
            </p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- showreel (live sites, tilt cards) ---------- */

const SHOWREEL_SITES = [
  { name: "Lobby Shishalounge", href: "https://lobby-shishalounge.higgsfield.app/", img: "/media/cinematic/portfolio/lobby.jpg" },
  { name: "Geuenich Immobilien", href: "https://geuenich-immobilien.higgsfield.app/", img: "/media/cinematic/portfolio/geuenich.jpg" },
  { name: "ChiRi", href: "https://chiri-cinema.higgsfield.app/", img: "/media/cinematic/portfolio/chiri.jpg" },
  { name: "Sacky Ink", href: "https://sacky-ink.higgsfield.app/", img: "/media/cinematic/portfolio/sacky.jpg" },
] as const;

function ShowreelCard({ site }: { site: (typeof SHOWREEL_SITES)[number] }) {
  const ref = useTilt();
  return (
    <a
      ref={ref}
      className="fpmc-folio"
      href={site.href}
      target="_blank"
      rel="noreferrer noopener"
      data-folio-card
      aria-label={site.name}
    >
      <img src={site.img} alt={site.name} loading="lazy" />
      <figcaption>
        <span>
          <span className="fpmc-folio-name">{site.name}</span>
        </span>
        <span className="fpmc-folio-arrow" aria-hidden>
          →
        </span>
      </figcaption>
    </a>
  );
}

function Showreel({ c }: { c: Copy }) {
  return (
    <Shell id="showreel" eyebrow={c.showreel.sub} wide>
      <h2
        className="fpmc-display"
        data-split-title="slide"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", margin: "0 0 3.6rem", color: "var(--light)" }}
      >
        <SplitWords text={c.showreel.headline} />
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "1.6rem",
        }}
      >
        {SHOWREEL_SITES.map((s) => (
          <ShowreelCard key={s.name} site={s} />
        ))}
      </div>
    </Shell>
  );
}

/* ---------- how (numbered steps) ---------- */

function How({ c }: { c: Copy }) {
  return (
    <Shell id="how">
      <h2
        className="fpmc-display"
        data-split-title="rise"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", margin: "0 0 3.4rem", color: "var(--light)" }}
      >
        <SplitWords text={c.how.headline} />
      </h2>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {c.how.steps.map((s, i) => (
          <li
            key={s.title}
            data-work-row
            style={{
              display: "flex",
              gap: "1.8rem",
              alignItems: "baseline",
              padding: "1.6rem 0",
              borderBottom: i < c.how.steps.length - 1 ? "1px dotted rgba(242,242,242,0.2)" : "none",
            }}
          >
            <span className="fpmc-craft-index" style={{ fontSize: "1.6rem" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "1.25rem",
                  margin: "0 0 0.4rem",
                  color: "var(--light)",
                }}
              >
                {s.title}
              </h3>
              <p style={{ color: "var(--ash)", fontSize: "0.92rem", margin: 0 }}>{s.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

/* ---------- pricing ---------- */

function Pricing({ c }: { c: Copy }) {
  return (
    <Shell id="pricing" eyebrow={c.pricing.sub} wide>
      <h2
        className="fpmc-display"
        data-split-title="flip"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", margin: "0 0 3.6rem", color: "var(--light)" }}
      >
        <SplitWords text={c.pricing.headline} />
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.4rem",
          marginBottom: "1.4rem",
        }}
      >
        {c.pricing.tiers.map((tier) => (
          <article
            key={tier.name}
            data-service-card
            className={`fpmc-card${tier.highlight ? " fpmc-card--featured" : ""}`}
            style={{ padding: "2.2rem 1.8rem", display: "flex", flexDirection: "column", position: "relative" }}
          >
            {"tag" in tier && tier.tag ? (
              <span
                className="fpmc-eyebrow"
                style={{
                  position: "absolute",
                  top: "1.2rem",
                  insetInlineEnd: "1.2rem",
                  border: "1px solid var(--light)",
                  borderRadius: 999,
                  padding: "0.3rem 0.8rem",
                }}
              >
                {tier.tag}
              </span>
            ) : null}
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "1.2rem",
                margin: "0 0 1rem",
                color: "var(--light)",
              }}
            >
              {tier.name}
            </h3>
            <p
              className="fpmc-display"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", margin: "0 0 1.2rem", color: "var(--light)" }}
            >
              {tier.price}
            </p>
            <p style={{ color: "var(--ash)", fontSize: "0.92rem", margin: "0 0 2rem", flex: 1 }}>{tier.line}</p>
            <Magnetic>
              <a href="#contact" className={tier.highlight ? "fpmc-cta-primary" : "fpmc-cta-ghost"}>
                {c.nav.cta}
              </a>
            </Magnetic>
          </article>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.4rem",
          marginBottom: "2rem",
        }}
      >
        {c.pricing.addons.map((a) => (
          <article key={a.name} data-service-card className="fpmc-card" style={{ padding: "1.7rem 1.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "1.05rem",
                  margin: 0,
                  color: "var(--light)",
                }}
              >
                {a.name}
              </h3>
              <span className="fpmc-eyebrow">{a.price}</span>
            </div>
            <p style={{ color: "var(--ash)", fontSize: "0.9rem", margin: "0.8rem 0 0" }}>{a.line}</p>
          </article>
        ))}
      </div>
      <p className="fpmc-eyebrow" style={{ margin: 0 }}>
        {c.pricing.footnote}
      </p>
    </Shell>
  );
}

/* ---------- entertainment + proof (display statements) ---------- */

function Statements({ c }: { c: Copy }) {
  return (
    <>
      <Shell id="entertainment">
        <h2
          className="fpmc-display"
          data-split-title="spread"
          style={{ fontSize: "clamp(2.4rem, 6.5vw, 5rem)", margin: "0 0 1.8rem", color: "var(--light)" }}
        >
          <SplitWords text={c.entertainment.headline} />
        </h2>
        <p style={{ color: "var(--ash)", maxWidth: 560, margin: "0 0 2.4rem" }}>{c.entertainment.body}</p>
        <Magnetic>
          <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" className="fpmc-cta-ghost">
            {c.entertainment.cta}
          </a>
        </Magnetic>
      </Shell>
      <BeamRule />
      <Shell id="proof">
        <h2
          className="fpmc-display"
          data-split-title="rise"
          style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", margin: "0 0 1.6rem", color: "var(--light)" }}
        >
          <SplitWords text={c.proof.headline} />
        </h2>
        <p style={{ color: "var(--ash)", maxWidth: 560, margin: 0 }}>{c.proof.body}</p>
      </Shell>
    </>
  );
}

/* ---------- faq ---------- */

function Faq({ c }: { c: Copy }) {
  return (
    <Shell id="faq">
      <h2
        className="fpmc-display"
        data-split-title="slide"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", margin: "0 0 2.8rem", color: "var(--light)" }}
      >
        <SplitWords text={c.faq.headline} />
      </h2>
      <div style={{ borderTop: "1px dotted rgba(242,242,242,0.25)" }}>
        {c.faq.items.map((item) => (
          <details
            key={item.q}
            data-work-row
            style={{ borderBottom: "1px dotted rgba(242,242,242,0.25)", padding: "1.3rem 0" }}
          >
            <summary
              style={{
                cursor: "pointer",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                gap: "1.4rem",
                alignItems: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "1.05rem",
                color: "var(--light)",
              }}
            >
              {item.q}
              <span aria-hidden style={{ color: "var(--ash)" }}>
                +
              </span>
            </summary>
            <p style={{ color: "var(--ash)", fontSize: "0.92rem", margin: "0.9rem 0 0", maxWidth: 620 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- contact ---------- */

function Contact({ c }: { c: Copy }) {
  const f = c.contact.form;
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const g = (k: string) => (data.get(k) as string) || "—";
    const body = [
      `${f.need.label} ${g("need")}`,
      `${f.pkg.label} ${g("pkg")}`,
      `${f.start.label} ${g("start")}`,
      "",
      `${f.name}: ${g("name")}`,
      `${f.email}: ${g("email")}`,
      `${f.phone}: ${g("phone")}`,
      "",
      `${g("message")}`,
    ].join("\n");
    const url = `${MAILTO}?subject=${encodeURIComponent("FPMC Studio — " + g("name"))}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setSent(true);
  };

  const label = "fpmc-eyebrow";
  const fieldWrap = { display: "flex", flexDirection: "column" as const, gap: "0.55rem" };

  return (
    <Shell id="contact" eyebrow={c.contact.sub}>
      <h2
        className="fpmc-display"
        data-split-title="spread"
        style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)", margin: "0 0 2.4rem", color: "var(--light)" }}
      >
        <SplitWords text={c.contact.headline} />
      </h2>
      <Magnetic>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="fpmc-cta-primary">
          {c.contact.whatsapp}
        </a>
      </Magnetic>

      {sent ? (
        <p
          className="fpmc-card"
          style={{ marginTop: "3rem", padding: "2rem", color: "var(--light)", borderColor: "var(--light)" }}
        >
          {f.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} style={{ marginTop: "3.4rem", display: "grid", gap: "1.6rem", maxWidth: 720 }}>
          <div style={{ display: "grid", gap: "1.6rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {([
              ["need", f.need] as const,
              ["pkg", f.pkg] as const,
              ["start", f.start] as const,
            ]).map(([name, group]) => (
              <label key={name} style={fieldWrap}>
                <span className={label}>{group.label}</span>
                <select name={name} defaultValue="" className="fpmc-input" style={{ appearance: "none" }}>
                  <option value="" disabled>
                    —
                  </option>
                  {group.options.map((o) => (
                    <option key={o} value={o} style={{ background: "#0a0a0a" }}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <div style={{ display: "grid", gap: "1.6rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <label style={fieldWrap}>
              <span className={label}>{f.name}</span>
              <input name="name" required className="fpmc-input" autoComplete="name" />
            </label>
            <label style={fieldWrap}>
              <span className={label}>{f.email}</span>
              <input name="email" type="email" required className="fpmc-input" autoComplete="email" />
            </label>
            <label style={fieldWrap}>
              <span className={label}>{f.phone}</span>
              <input name="phone" type="tel" className="fpmc-input" autoComplete="tel" />
            </label>
          </div>
          <label style={fieldWrap}>
            <span className={label}>{f.message}</span>
            <textarea name="message" rows={4} className="fpmc-input" style={{ borderRadius: 18 }} />
          </label>
          <label style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start", color: "var(--ash)", fontSize: "0.88rem" }}>
            <input type="checkbox" required style={{ marginTop: 3, accentColor: "#f2f2f2" }} />
            <span>
              {f.consent}{" "}
              <Link to="/datenschutz" className="fpmc-link">
                {c.contact.footer.datenschutz}
              </Link>
            </span>
          </label>
          <div>
            <Magnetic>
              <button type="submit" className="fpmc-cta-primary" style={{ cursor: "pointer" }}>
                {f.submit}
              </button>
            </Magnetic>
          </div>
        </form>
      )}

      <p style={{ marginTop: "2.6rem" }}>
        <a href={MAILTO} className="fpmc-link" style={{ fontSize: "0.9rem" }}>
          {CONTACT_EMAIL}
        </a>
      </p>
    </Shell>
  );
}

/* ---------- footer ---------- */

function StudioFooter({ c }: { c: Copy }) {
  return (
    <footer style={{ padding: "4rem 1.6rem 3rem" }}>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.6rem",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px dotted rgba(242,242,242,0.3)",
          paddingTop: "2.2rem",
        }}
      >
        <p className="fpmc-eyebrow" style={{ margin: 0 }}>
          {c.contact.footer.legal}
        </p>
        <nav style={{ display: "flex", gap: "1.6rem", flexWrap: "wrap" }}>
          <Link to="/" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
            fpmc.house
          </Link>
          <Link to="/links" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
            Links
          </Link>
          <Link to="/impressum" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
            {c.contact.footer.impressum}
          </Link>
          <Link to="/datenschutz" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
            {c.contact.footer.datenschutz}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

/* ---------- page ---------- */

export function Studio() {
  const c = useStudioCopy();
  const { locale } = useI18n();
  useDocumentTitle("Studio");

  useEffect(() => {
    // Reduced-motion path has no Lenis — honour #hash deep links natively.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { hash } = window.location;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const gsap = gsapMod.gsap ?? gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ autoRaf: false, lerp: 0.09 });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-split-title]").forEach((title) => {
          const words = title.querySelectorAll<HTMLElement>("[data-split-word]");
          if (!words.length) return;
          const variant = title.dataset.splitTitle || "rise";
          const st = { trigger: title, start: "top 95%", end: "top 55%", scrub: true } as const;
          if (variant === "slide") {
            words.forEach((w, i) => {
              gsap.fromTo(
                w,
                { xPercent: i % 2 ? 60 : -60, opacity: 0.22 },
                { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { ...st } },
              );
            });
          } else if (variant === "flip") {
            gsap.set(title, { perspective: 600 });
            gsap.fromTo(
              words,
              { rotateX: -68, yPercent: 34, opacity: 0.22, transformOrigin: "50% 0%" },
              { rotateX: 0, yPercent: 0, opacity: 1, ease: "none", stagger: 0.09, scrollTrigger: st },
            );
          } else if (variant === "spread") {
            gsap.fromTo(
              words,
              { scale: 1.28, yPercent: 22, opacity: 0.2 },
              { scale: 1, yPercent: 0, opacity: 1, ease: "none", stagger: 0.07, scrollTrigger: st },
            );
          } else {
            gsap.fromTo(
              words,
              { yPercent: 62, opacity: 0.22 },
              { yPercent: 0, opacity: 1, ease: "none", stagger: 0.08, scrollTrigger: st },
            );
          }
        });

        gsap.utils.toArray<HTMLElement>("[data-eyebrow]").forEach((eb) => {
          gsap.fromTo(
            eb,
            { x: -28, opacity: 0.3 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: eb, start: "top 96%", end: "top 70%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-beam-sweep]").forEach((beam) => {
          gsap.fromTo(
            beam,
            { xPercent: -110 },
            {
              xPercent: 480,
              ease: "none",
              scrollTrigger: {
                trigger: beam.parentElement,
                start: "top 105%",
                end: "top 25%",
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 46 + (i % 4) * 12, scale: 0.965, opacity: 0.45 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 100%", end: "top 64%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-folio-card]").forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 70 + i * 20, rotate: i % 2 ? 0.8 : -0.8, opacity: 0.4 },
            {
              y: 0,
              rotate: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 102%", end: "top 55%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-work-row]").forEach((row, i) => {
          gsap.fromTo(
            row,
            { x: i % 2 ? 36 : -36, opacity: 0.35 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top 96%", end: "top 68%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-number-cell]").forEach((cell, i) => {
          gsap.fromTo(
            cell,
            { y: 40 + i * 12, opacity: 0.35 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: cell, start: "top 98%", end: "top 66%", scrub: true },
            },
          );
        });
      });

      const onAnchorClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a) return;
        const target = document.querySelector(a.getAttribute("href") || "");
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.6 });
      };
      document.addEventListener("click", onAnchorClick);

      // Deep-link arrival (e.g. /studio#contact from the home funnel): the page
      // is lazy-loaded, so the native anchor jump misses — scroll via Lenis.
      const { hash } = window.location;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          window.setTimeout(() => {
            lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.4 });
          }, 350);
        }
      }

      cleanup = () => {
        document.removeEventListener("click", onAnchorClick);
        ctx.revert();
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [locale]);

  return (
    <div className="fpmc" dir="ltr">
      <StudioHeader c={c} />
      <main>
        <StudioHero c={c} />
        <StudioMarquee />
        <BeamRule />
        <Why c={c} />
        <BeamRule />
        <Team c={c} />
        <BeamRule />
        <Showreel c={c} />
        <BeamRule />
        <How c={c} />
        <BeamRule />
        <Pricing c={c} />
        <BeamRule />
        <Statements c={c} />
        <BeamRule />
        <Faq c={c} />
        <BeamRule />
        <Contact c={c} />
      </main>
      <StudioFooter c={c} />
      <Cursor />
      <div className="fpmc-vignette" aria-hidden />
      <div className="fpmc-grain" aria-hidden />
    </div>
  );
}
