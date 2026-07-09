import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Logo } from "../components/Logo";
import { Marquee } from "../components/Marquee";
import { Reveal } from "../components/motion/Reveal";
import { WordReveal } from "../components/motion/WordReveal";
import { Stagger, StaggerItem } from "../components/motion/Stagger";
import { Counter } from "../components/motion/Counter";
import { LangSwitcher } from "../components/LangSwitcher";
import { studioContent } from "../content/studio.content";
import { CONTACT_EMAIL, MAILTO, SOCIALS, WHATSAPP } from "../config";

type Copy = typeof studioContent.de;

function useStudioCopy(): Copy {
  const { locale } = useI18n();
  return (locale === "en" ? studioContent.en : studioContent.de) as unknown as Copy;
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={
        "scroll-mt-24 border-t border-dotted border-light/20 px-5 py-20 sm:py-24 " + className
      }
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function StudioNav({ c }: { c: Copy }) {
  const link =
    "font-display text-sm uppercase tracking-wide text-ash transition-colors hover:text-light";
  return (
    <header className="sticky top-0 z-40 border-b border-dotted border-light/20 bg-void/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" aria-label="FPMC — Home" className="shrink-0">
          <Logo className="h-6 w-auto" />
        </Link>
        <nav className="flex items-center gap-5">
          <a href="#how" className={"hidden sm:inline " + link}>{c.nav.services}</a>
          <a href="#showreel" className={"hidden sm:inline " + link}>{c.nav.work}</a>
          <a href="#pricing" className={"hidden sm:inline " + link}>{c.nav.pricing}</a>
          <span className="hidden h-4 w-px bg-graphite sm:block" aria-hidden />
          <LangSwitcher />
          <a href="#contact" className="btn btn-fill !px-4 !py-2 !text-xs">
            {c.nav.cta}
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ c }: { c: Copy }) {
  return (
    <section className="relative isolate overflow-hidden px-5 py-24 sm:py-28">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="hero-beam" />
        <div className="hero-haze" />
      </div>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">FPMC Studio</p>
        </Reveal>
        <WordReveal as="h1" className="display-lg mt-6 max-w-5xl text-balance" text={c.hero.headline} />
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-light/85">{c.hero.subline}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {c.hero.badges.map((b) => (
              <li key={b} className="badge">
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#contact" className="btn btn-fill">{c.hero.ctaPrimary}</a>
            <a href="#pricing" className="btn">{c.hero.ctaSecondary}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Why({ c }: { c: Copy }) {
  const [active, setActive] = useState(0);
  return (
    <Section id="why">
      <WordReveal as="h2" className="text-balance" text={c.why.headline} />
      <Reveal>
        <p className="mt-4 text-ash">{c.why.sub}</p>
      </Reveal>
      <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {c.why.reasons.map((r, i) => {
          const on = i === active;
          return (
            <StaggerItem key={r.label}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={
                  "w-full rounded-[6px] border p-4 text-left transition-colors " +
                  (on ? "border-light bg-carbon" : "border-graphite hover:border-ash/60")
                }
              >
                <span className="font-display text-base uppercase tracking-wide">{r.label}</span>
              </button>
            </StaggerItem>
          );
        })}
      </Stagger>
      <p className="display-lg mt-8 max-w-4xl text-balance !text-[clamp(1.75rem,4vw,3rem)]">
        {c.why.reasons[active].line}
      </p>
    </Section>
  );
}

function Crew({ c }: { c: Copy }) {
  return (
    <Section id="crew">
      <WordReveal as="h2" className="text-balance" text={c.crew.headline} />
      <Reveal>
        <p className="mt-4 text-ash">{c.crew.sub}</p>
      </Reveal>
      <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
        {c.crew.members.map((m) => (
          <StaggerItem key={m.name} className="h-full">
            <article className="card h-full p-6">
              <h3>{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{m.role}</p>
              <p className="mt-3 text-[0.7rem] uppercase tracking-widest text-ash/70">{m.langs}</p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
      <Stagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {c.crew.counters.map((k) => (
          <StaggerItem key={k.label}>
            <div className="card p-5 text-center">
              <Counter value={k.value} className="font-display text-5xl" />
              <div className="mt-2 text-[0.68rem] uppercase tracking-widest text-ash">{k.label}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

function Showreel({ c }: { c: Copy }) {
  return (
    <Section id="showreel">
      <WordReveal as="h2" className="text-balance" text={c.showreel.headline} />
      <Reveal>
        <p className="mt-4 text-ash">{c.showreel.sub}</p>
      </Reveal>
      <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <StaggerItem key={i}>
            <div
              className="card flex aspect-video items-center justify-center"
              aria-hidden="true"
            >
              <Logo className="w-20 opacity-10" />
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

function How({ c }: { c: Copy }) {
  return (
    <Section id="how">
      <WordReveal as="h2" className="text-balance" text={c.how.headline} />
      <Stagger className="mt-10 space-y-6">
        {c.how.steps.map((s, i) => (
          <StaggerItem key={s.title}>
            <div className="flex gap-5">
              <span className="font-display text-3xl leading-none text-ash tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{s.title}</h3>
                <p className="mt-1 text-sm text-ash">{s.line}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

function Pricing({ c }: { c: Copy }) {
  return (
    <Section id="pricing">
      <WordReveal as="h2" className="text-balance" text={c.pricing.headline} />
      <Reveal>
        <p className="mt-4 text-ash">{c.pricing.sub}</p>
      </Reveal>

      <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
        {c.pricing.tiers.map((t) => (
          <StaggerItem key={t.name} className="h-full">
            <article
              className={
                "relative flex h-full flex-col rounded-[6px] border bg-carbon p-6 " +
                (t.highlight ? "border-light" : "border-graphite")
              }
            >
              {"tag" in t && t.tag && (
                <span className="badge badge-solid absolute right-4 top-4">{t.tag}</span>
              )}
              <h3>{t.name}</h3>
              <p className="mt-2 font-display text-4xl">{t.price}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{t.line}</p>
              <a href="#contact" className={"btn mt-6 " + (t.highlight ? "btn-fill" : "")}>
                {c.nav.cta}
              </a>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Stagger className="mt-4 grid gap-4 sm:grid-cols-2">
        {c.pricing.addons.map((a) => (
          <StaggerItem key={a.name}>
            <article className="card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3>{a.name}</h3>
                <span className="font-display text-lg text-ash">{a.price}</span>
              </div>
              <p className="mt-2 text-sm text-ash">{a.line}</p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-6">
        <p className="text-xs uppercase tracking-widest text-ash/70">{c.pricing.footnote}</p>
      </Reveal>
    </Section>
  );
}

function Entertainment({ c }: { c: Copy }) {
  return (
    <Section id="entertainment">
      <WordReveal as="h2" className="text-balance" text={c.entertainment.headline} />
      <Reveal>
        <p className="mt-6 max-w-xl text-lg text-ash">{c.entertainment.body}</p>
        <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" className="btn mt-8">
          {c.entertainment.cta}
        </a>
      </Reveal>
    </Section>
  );
}

function Proof({ c }: { c: Copy }) {
  return (
    <Section id="proof">
      <WordReveal as="h2" className="text-balance" text={c.proof.headline} />
      <Reveal>
        <p className="mt-6 max-w-xl text-lg text-ash">{c.proof.body}</p>
      </Reveal>
    </Section>
  );
}

function Faq({ c }: { c: Copy }) {
  return (
    <Section id="faq">
      <WordReveal as="h2" className="text-balance" text={c.faq.headline} />
      <Stagger className="mt-8 border-y border-dotted border-light/20">
        {c.faq.items.map((item) => (
          <StaggerItem key={item.q}>
            <details className="group border-b border-dotted border-light/15 py-4 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-display text-lg uppercase tracking-wide">{item.q}</span>
                <span
                  className="text-ash transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ash">{item.a}</p>
            </details>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

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

  const labelCls = "block text-[0.7rem] uppercase tracking-widest text-ash";

  return (
    <Section id="contact">
      <WordReveal as="h2" className="text-balance" text={c.contact.headline} />
      <Reveal>
        <p className="mt-4 max-w-xl text-ash">{c.contact.sub}</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn btn-fill mt-8">
          {c.contact.whatsapp}
        </a>
      </Reveal>

      {sent ? (
        <p className="card mt-10 border-light p-6 text-light">{f.success}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:max-w-2xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {([
              ["need", f.need] as const,
              ["pkg", f.pkg] as const,
              ["start", f.start] as const,
            ]).map(([name, group]) => (
              <label key={name} className="space-y-2">
                <span className={labelCls}>{group.label}</span>
                <select name={name} defaultValue="" className="field">
                  <option value="" disabled>
                    —
                  </option>
                  {group.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="space-y-2">
              <span className={labelCls}>{f.name}</span>
              <input name="name" required className="field" autoComplete="name" />
            </label>
            <label className="space-y-2">
              <span className={labelCls}>{f.email}</span>
              <input name="email" type="email" required className="field" autoComplete="email" />
            </label>
            <label className="space-y-2">
              <span className={labelCls}>{f.phone}</span>
              <input name="phone" type="tel" className="field" autoComplete="tel" />
            </label>
          </div>

          <label className="space-y-2">
            <span className={labelCls}>{f.message}</span>
            <textarea name="message" rows={4} className="field" />
          </label>

          <label className="flex items-start gap-3 text-sm text-ash">
            <input type="checkbox" required className="mt-1 accent-light" />
            <span>
              {f.consent}{" "}
              <Link to="/datenschutz" className="underline hover:text-light">
                {c.contact.footer.datenschutz}
              </Link>
            </span>
          </label>

          <div>
            <button type="submit" className="btn btn-fill">
              {f.submit}
            </button>
          </div>
        </form>
      )}

      <p className="mt-8 text-sm text-ash">
        <a href={MAILTO} className="hover:text-light">
          {CONTACT_EMAIL}
        </a>
      </p>
    </Section>
  );
}

function StudioFooter({ c }: { c: Copy }) {
  return (
    <footer className="border-t border-dotted border-light/20 px-5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-ash sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display uppercase tracking-wide">{c.contact.footer.legal}</p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/impressum" className="hover:text-light">
            {c.contact.footer.impressum}
          </Link>
          <Link to="/datenschutz" className="hover:text-light">
            {c.contact.footer.datenschutz}
          </Link>
          <Link to="/" className="hover:text-light">
            fpmc.house
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export function Studio() {
  const c = useStudioCopy();
  useDocumentTitle("Studio");

  return (
    <div dir="ltr" className="flex min-h-dvh flex-col">
      <StudioNav c={c} />
      <main className="flex-1">
        <Hero c={c} />
        <Marquee text="Websites · Film · Sound · 7 Tage · KI · 48h" />
        <Why c={c} />
        <Crew c={c} />
        <Showreel c={c} />
        <How c={c} />
        <Pricing c={c} />
        <Entertainment c={c} />
        <Proof c={c} />
        <Faq c={c} />
        <Contact c={c} />
      </main>
      <StudioFooter c={c} />
    </div>
  );
}
