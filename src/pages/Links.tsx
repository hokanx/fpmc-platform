import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Logo } from "../components/Logo";
import { MAILTO, SOCIALS } from "../config";

// Link-in-bio. Deliberately light: logo + a handful of buttons, zero third-party.
export function Links() {
  const { t } = useI18n();
  useDocumentTitle(t("nav.links"));

  const buttons: { label: string; href: string; external: boolean }[] = [
    { label: t("links.youtube"), href: SOCIALS.youtube, external: true },
    { label: t("links.instagram"), href: SOCIALS.instagram, external: true },
    { label: t("links.tiktok"), href: SOCIALS.tiktok, external: true },
    { label: t("links.contact"), href: MAILTO, external: false },
  ];

  return (
    <section className="px-5 py-16 sm:py-20">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <h1 className="sr-only">FPMC — {t("links.tagline")}</h1>
        <div className="rise-in w-40">
          <Logo className="w-40" />
        </div>
        <p className="eyebrow rise-in mt-6" style={{ animationDelay: "0.08s" }}>
          {t("links.tagline")}
        </p>

        <nav className="mt-10 flex w-full flex-col gap-3">
          {buttons.map((b, i) => (
            <a
              key={b.label}
              href={b.href}
              className="btn btn-block rise-in"
              style={{ animationDelay: `${0.16 + i * 0.07}s` }}
              {...(b.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {b.label}
            </a>
          ))}
        </nav>

        <p
          className="rise-in mt-8 text-xs uppercase tracking-widest text-ash/70"
          style={{ animationDelay: `${0.16 + buttons.length * 0.07}s` }}
        >
          {t("links.soon")} <span aria-hidden="true">⏳</span>
        </p>
      </div>
    </section>
  );
}
