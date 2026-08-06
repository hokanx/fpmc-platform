/* Chrome for the three cinematic pages: mark and the three routes.
 * The top bar belongs to the brand — the chapter rail lives at the bottom of
 * the film stage, never up here. No language switcher: the site is English only.
 */
import { NavLink } from "react-router-dom";

import { Logo } from "./Logo";
import { useI18n } from "../i18n";

export function CineNav() {
  const { t } = useI18n();

  const routes = [
    { to: "/", label: t("nav.start") },
    { to: "/arbeit", label: t("nav.arbeit") },
    { to: "/label", label: t("nav.label") },
  ];

  return (
    <header className="fpmc-nav">
      <NavLink to="/" aria-label="FPMC">
        <Logo className="h-7 w-auto" />
      </NavLink>
      <nav className="fpmc-nav-links" aria-label="FPMC">
        {routes.map((r) => (
          <NavLink key={r.to} to={r.to} end={r.to === "/"}>
            {r.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export function CineFoot() {
  const { t } = useI18n();
  return (
    <footer className="fpmc-foot">
      <span>
        © {new Date().getFullYear()} {t("foot.rights")}
      </span>
      <div className="fpmc-foot-links">
        <a href="mailto:hello@fpmc.house">{t("foot.contact")}</a>
        <a href="/impressum">{t("foot.impressum")}</a>
        <a href="/datenschutz">{t("foot.datenschutz")}</a>
      </div>
    </footer>
  );
}
