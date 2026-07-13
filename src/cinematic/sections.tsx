/* FPMC cinematic storefront — page sections (Lichtspiel v2, achromatic).
 * Ported from the preview build; wired to the platform i18n and /api/leads. */
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { useI18n, LOCALES, type Locale } from "../i18n";
import { Magnetic, SplitWords, useTilt } from "./motion";
import { SOCIALS, MAILTO, CONTACT_EMAIL } from "../config";

const LOGO = "/fpmc-logo.svg";

/* ---------- leads (Supabase via /api/leads, service-role server-side) ---------- */

async function submitLead(email: string, locale: string): Promise<boolean> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, locale }),
  });
  return res.ok;
}

/* ---------- header ---------- */

export function Header() {
  const { t } = useI18n();
  return (
    <header className="fpmc-header">
      <Link to="/" aria-label="FPMC — home" style={{ display: "inline-flex" }}>
        <img id="fpmc-header-logo" src={LOGO} alt="FPMC" style={{ height: 30, width: "auto" }} />
      </Link>
      <nav>
        <a href="#work" className="fpmc-eyebrow fpmc-nav-link">
          {t("cin.nav.work")}
        </a>
        <a href="#folio" className="fpmc-eyebrow fpmc-nav-link">
          {t("cin.nav.folio")}
        </a>
        <a href="#services" className="fpmc-eyebrow fpmc-nav-link">
          {t("cin.nav.services")}
        </a>
        <Link to="/studio" className="fpmc-eyebrow fpmc-nav-link">
          {t("nav.studio")}
        </Link>
        <a href="#connect" className="fpmc-eyebrow fpmc-nav-link">
          {t("nav.connect")}
        </a>
        <LangSwitch />
      </nav>
    </header>
  );
}

export function LangSwitch() {
  const { locale, setLocale } = useI18n();
  return (
    <span className="fpmc-lang" role="group" aria-label="Language">
      {LOCALES.map((l: Locale) => (
        <button key={l} data-active={locale === l} onClick={() => setLocale(l)}>
          {l === "ar" ? "ع" : l.toUpperCase()}
        </button>
      ))}
    </span>
  );
}

/* ---------- section shell ---------- */

function SectionShell({
  id,
  eyebrow,
  children,
  wide,
}: {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} style={{ padding: "9rem 1.6rem", position: "relative" }}>
      <div style={{ maxWidth: wide ? 1240 : 980, margin: "0 auto" }}>
        {eyebrow ? (
          <p className="fpmc-eyebrow" data-eyebrow style={{ marginBottom: "3.2rem" }}>
            {eyebrow}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/* ---------- manifesto ---------- */

export function Manifesto() {
  const { t } = useI18n();
  const lines = [1, 2, 3, 4].map((n) => t(`cin.manifesto.l${n}`));
  return (
    <SectionShell eyebrow={t("cin.manifesto.eyebrow")}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4.5rem" }}>
        {lines.map((line, i) => (
          <h2
            key={i}
            data-manifesto-line
            className="fpmc-display"
            style={{
              fontSize: "clamp(2.2rem, 6.5vw, 5.2rem)",
              margin: 0,
              color: "var(--light)",
              textAlign: i % 2 ? "end" : "start",
            }}
          >
            {line}
          </h2>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------- the release (locked teaser — tease rule) ---------- */

const PREMIERE = Date.UTC(2026, 6, 23, 22, 0, 0); // 24.07.2026 00:00 CEST

function countdownParts(now: number) {
  const d = Math.max(0, PREMIERE - now);
  return [
    Math.floor(d / 86400000),
    Math.floor(d / 3600000) % 24,
    Math.floor(d / 60000) % 60,
    Math.floor(d / 1000) % 60,
  ];
}

function Countdown({ units }: { units: string[] }) {
  const [parts, setParts] = useState(() => countdownParts(Date.now()));
  useEffect(() => {
    const id = window.setInterval(() => setParts(countdownParts(Date.now())), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="fpmc-countdown" role="timer" aria-label={units.join(" ")}>
      {parts.map((v, i) => (
        <div key={i} className="fpmc-countdown-cell">
          <span className="fpmc-display fpmc-countdown-num">{String(v).padStart(2, "0")}</span>
          <span className="fpmc-eyebrow">{units[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function ReleaseTeaser() {
  const { t, locale } = useI18n();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [email, setEmail] = useState("");
  const units = [1, 2, 3, 4].map((n) => t(`cin.release.u${n}`));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || state === "busy") return;
    setState("busy");
    try {
      const ok = await submitLead(email, locale);
      setState(ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <SectionShell eyebrow={t("cin.release.eyebrow")}>
      <div
        data-parallax="6"
        className="fpmc-parallax-panel"
        style={{
          border: "1px dotted rgba(242,242,242,0.4)",
          borderRadius: 6,
          padding: "5rem 2rem",
          textAlign: "center",
          background: "var(--carbon)",
        }}
      >
        <span aria-hidden style={{ display: "inline-block", marginBottom: "1.6rem" }}>
          <svg width="26" height="30" viewBox="0 0 26 30" fill="none" aria-hidden>
            <rect x="1" y="12" width="24" height="17" rx="3" stroke="#8A8A8A" />
            <path d="M6 12V9a7 7 0 0 1 14 0v3" stroke="#8A8A8A" />
          </svg>
        </span>
        <h2
          className="fpmc-display"
          data-split-title="spread"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)", margin: "0 0 1.2rem", color: "var(--light)" }}
        >
          <SplitWords text={t("cin.release.title")} />
        </h2>
        <p style={{ color: "var(--ash)", margin: "0 0 2.4rem" }}>{t("cin.release.line")}</p>

        <Countdown units={units} />

        {state === "done" ? (
          <p style={{ color: "var(--light)", margin: 0 }}>{t("cin.release.done")}</p>
        ) : (
          <form
            onSubmit={submit}
            style={{
              display: "flex",
              gap: "0.8rem",
              maxWidth: 460,
              margin: "0 auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              className="fpmc-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("cin.release.email")}
              aria-label={t("cin.release.email")}
              style={{ flex: "1 1 240px" }}
            />
            <button type="submit" className="fpmc-cta-ghost" disabled={state === "busy"}>
              {t("cin.release.notify")}
            </button>
            {state === "error" ? (
              <p style={{ color: "var(--ash)", fontSize: "0.85rem", width: "100%", margin: 0 }}>
                {t("cin.release.error")}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </SectionShell>
  );
}

/* ---------- work / the craft (interactive chapters) ---------- */

const CRAFT_MEDIA = [
  { type: "video" as const, src: "/media/cinematic/the-sound.mp4" },
  { type: "video" as const, src: "/media/cinematic/craft-ki.mp4" },
  { type: "image" as const, src: "/media/cinematic/hero-poster.jpg" },
];

export function WorkSection() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const items = [1, 2, 3].map((n) => ({
    title: t(`cin.work.i${n}.title`),
    tag: t(`cin.work.i${n}.tag`),
  }));

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (reduced) {
        v.pause();
        return;
      }
      if (i === active) void v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  return (
    <SectionShell id="work" eyebrow={t("cin.work.eyebrow")} wide>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3.5rem",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            className="fpmc-display"
            data-split-title="rise"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", margin: "0 0 1.6rem", color: "var(--light)" }}
          >
            <SplitWords text={t("cin.work.title")} />
          </h2>
          <p style={{ color: "var(--ash)", maxWidth: 420, margin: "0 0 0.8rem" }}>{t("cin.work.body")}</p>
          <p className="fpmc-eyebrow" style={{ margin: "0 0 2.4rem" }}>
            {t("cin.work.hint")}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((item, i) => (
              <li key={i} data-work-row>
                <button
                  type="button"
                  className="fpmc-craft-row"
                  data-active={active === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className="fpmc-craft-index">{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ flex: 1, textAlign: "start" }}>{item.title}</span>
                  <span className="fpmc-eyebrow">{item.tag}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div
          data-parallax="-8"
          className="fpmc-parallax-panel"
          style={{
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid var(--graphite)",
            aspectRatio: "16 / 9",
            background: "var(--carbon)",
            position: "relative",
          }}
        >
          {CRAFT_MEDIA.map((m, i) =>
            m.type === "video" ? (
              <video
                key={m.src}
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={m.src}
                poster="/media/cinematic/hero-poster.jpg"
                autoPlay={i === 0}
                muted
                loop
                playsInline
                className="fpmc-craft-media"
                data-visible={active === i}
                style={{ filter: "grayscale(1)" }}
              />
            ) : (
              <img
                key={m.src}
                src={m.src}
                alt=""
                aria-hidden
                className="fpmc-craft-media fpmc-craft-still"
                data-visible={active === i}
              />
            ),
          )}
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------- portfolio (websites built on this stack) ---------- */

const FOLIO_SITES = [
  {
    key: "geuenich",
    name: "Geuenich Immobilien",
    href: "https://geuenich-immobilien.higgsfield.app/",
    img: "/media/cinematic/portfolio/geuenich.jpg",
  },
  {
    key: "chiri",
    name: "ChiRi",
    href: "https://chiri-cinema.higgsfield.app/",
    img: "/media/cinematic/portfolio/chiri.jpg",
  },
  {
    key: "sacky",
    name: "Sacky Ink",
    href: "https://sacky-ink.higgsfield.app/",
    img: "/media/cinematic/portfolio/sacky.jpg",
  },
  {
    key: "lobby",
    name: "Lobby Shishalounge",
    href: "https://lobby-shishalounge.higgsfield.app/",
    img: "/media/cinematic/portfolio/lobby.jpg",
  },
] as const;

function FolioCard({
  site,
  tag,
  visit,
}: {
  site: (typeof FOLIO_SITES)[number];
  tag: string;
  visit: string;
}) {
  const ref = useTilt();
  return (
    <a
      ref={ref}
      className="fpmc-folio"
      href={site.href}
      target="_blank"
      rel="noreferrer noopener"
      data-folio-card
      aria-label={`${site.name} — ${visit}`}
    >
      <img src={site.img} alt={site.name} loading="lazy" />
      <figcaption>
        <span>
          <span className="fpmc-folio-name">{site.name}</span>
          <span className="fpmc-eyebrow" style={{ display: "block", marginTop: "0.35rem" }}>
            {tag}
          </span>
        </span>
        <span className="fpmc-folio-arrow" aria-hidden>
          →
        </span>
      </figcaption>
    </a>
  );
}

export function Portfolio() {
  const { t } = useI18n();
  return (
    <SectionShell id="folio" eyebrow={t("cin.folio.eyebrow")} wide>
      <h2
        className="fpmc-display"
        data-split-title="slide"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", margin: "0 0 1.4rem", color: "var(--light)" }}
      >
        <SplitWords text={t("cin.folio.title")} />
      </h2>
      <p style={{ color: "var(--ash)", maxWidth: 560, margin: "0 0 4rem" }}>{t("cin.folio.body")}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "1.6rem",
        }}
      >
        {FOLIO_SITES.map((site, i) => (
          <FolioCard
            key={site.key}
            site={site}
            tag={t(`cin.folio.tag${i + 1}`)}
            visit={t("cin.folio.visit")}
          />
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------- services (each card carries its own living motif) ---------- */

function ServiceMotif({ kind }: { kind: number }) {
  switch (kind) {
    case 0:
      return (
        <span className="fpmc-motif fpmc-motif-film" aria-hidden>
          <span />
        </span>
      );
    case 1:
      return (
        <span className="fpmc-motif" aria-hidden>
          <svg viewBox="0 0 44 30" width="44" height="30" fill="none">
            <rect x="1" y="1" width="42" height="28" rx="3" className="fpmc-motif-wire" />
            <line x1="1" y1="9" x2="43" y2="9" className="fpmc-motif-wire fpmc-motif-wire-2" />
            <circle cx="6" cy="5" r="1.2" fill="#8A8A8A" />
          </svg>
        </span>
      );
    case 2:
      return (
        <span className="fpmc-motif fpmc-motif-pulse" aria-hidden>
          <span />
          <span />
          <i />
        </span>
      );
    default:
      return (
        <span className="fpmc-motif fpmc-motif-eq" aria-hidden>
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      );
  }
}

const SERVICE_KEYS = ["aivideo", "websites", "boost", "artists"] as const;

export function Services() {
  const { t } = useI18n();
  return (
    <SectionShell id="services" eyebrow={t("cin.services.eyebrow")} wide>
      <h2
        className="fpmc-display"
        data-split-title="flip"
        style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", margin: "0 0 4rem", color: "var(--light)" }}
      >
        <SplitWords text={t("services.title")} />
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.4rem",
          marginBottom: "3.5rem",
        }}
      >
        {SERVICE_KEYS.map((key, i) => (
          <article
            key={key}
            data-service-card
            className={`fpmc-card${key === "boost" ? " fpmc-card--featured" : ""}`}
            style={{ padding: "2.2rem 1.8rem" }}
          >
            <ServiceMotif kind={i} />
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.01em",
                fontSize: "1.35rem",
                margin: "1.3rem 0 1rem",
                color: "var(--light)",
              }}
            >
              {t(`services.${key}.title`)}
            </h3>
            <p style={{ color: "var(--ash)", fontSize: "0.95rem", margin: 0 }}>
              {t(`services.${key}.body`)}
            </p>
          </article>
        ))}
      </div>
      <Magnetic>
        <a href={MAILTO} className="fpmc-cta-primary">
          {t("services.cta")}
        </a>
      </Magnetic>
    </SectionShell>
  );
}

/* ---------- numbers ---------- */

function Counter({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (value * eased).toFixed(decimals);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = value.toFixed(decimals);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, decimals]);

  return (
    <span>
      <span ref={ref}>{value.toFixed(decimals)}</span>
      {suffix}
    </span>
  );
}

const NUMBERS = [
  { value: 51.2, suffix: "K", decimals: 1 },
  { value: 48, suffix: "h", decimals: 0 },
  { value: 3, suffix: "", decimals: 0 },
  { value: 2, suffix: "", decimals: 0 },
];

export function Numbers() {
  const { t } = useI18n();
  return (
    <SectionShell eyebrow={t("cin.numbers.eyebrow")} wide>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "3rem",
        }}
      >
        {NUMBERS.map((n, i) => (
          <div key={i} data-number-cell>
            <p
              className="fpmc-display"
              style={{ fontSize: "clamp(3.4rem, 8vw, 6.5rem)", margin: 0, color: "var(--light)" }}
            >
              <Counter value={n.value} suffix={n.suffix} decimals={n.decimals} />
            </p>
            <p className="fpmc-eyebrow" style={{ marginTop: "0.8rem" }}>
              {t(`cin.numbers.n${i + 1}`)}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------- connect ---------- */

export function Connect() {
  const { t } = useI18n();
  return (
    <SectionShell id="connect" eyebrow={t("nav.connect")}>
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <h2
          className="fpmc-display"
          data-split-title="spread"
          style={{ fontSize: "clamp(2.6rem, 8vw, 6.5rem)", margin: "0 0 1.8rem", color: "var(--light)" }}
        >
          <SplitWords text={t("connect.title")} />
        </h2>
        <p style={{ color: "var(--ash)", maxWidth: 560, margin: "0 auto 3.2rem" }}>
          {t("connect.body")}
        </p>
        <Magnetic>
          <a href={MAILTO} className="fpmc-cta-primary fpmc-ping">
            <span className="fpmc-ping-ring" aria-hidden />
            <span className="fpmc-ping-ring fpmc-ping-ring-2" aria-hidden />
            {t("connect.cta")}
          </a>
        </Magnetic>
      </div>
    </SectionShell>
  );
}

/* ---------- footer ---------- */

const FOOTER_SOCIALS = [
  { label: "Instagram", href: SOCIALS.instagram },
  { label: "TikTok", href: SOCIALS.tiktok },
  { label: "YouTube", href: SOCIALS.youtube },
];

export function Footer() {
  const { t } = useI18n();
  return (
    <footer style={{ padding: "7rem 1.6rem 3rem", overflow: "hidden" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <img
          data-footer-logo
          src={LOGO}
          alt="FPMC — Film Production Music Club"
          style={{ width: "100%", height: "auto", display: "block", marginBottom: "4.5rem" }}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px dotted rgba(242,242,242,0.3)",
            paddingTop: "2.2rem",
          }}
        >
          <a href={MAILTO} className="fpmc-link" style={{ fontSize: "0.9rem" }}>
            {CONTACT_EMAIL}
          </a>
          <nav style={{ display: "flex", gap: "1.6rem", flexWrap: "wrap" }}>
            {FOOTER_SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="fpmc-eyebrow"
                style={{ textDecoration: "none" }}
              >
                {s.label}
              </a>
            ))}
          </nav>
          <nav style={{ display: "flex", gap: "1.6rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link to="/studio" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
              {t("nav.studio")}
            </Link>
            <Link to="/links" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
              {t("nav.links")}
            </Link>
            <Link to="/impressum" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
              {t("footer.impressum")}
            </Link>
            <Link to="/datenschutz" className="fpmc-eyebrow" style={{ textDecoration: "none" }}>
              {t("footer.datenschutz")}
            </Link>
            <LangSwitch />
          </nav>
        </div>
        <p className="fpmc-eyebrow" style={{ marginTop: "2rem" }}>
          © {new Date().getFullYear()} FPMC GbR — {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
