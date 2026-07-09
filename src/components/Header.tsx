import { NavLink, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { useI18n } from "../i18n";

export function Header() {
  const { t } = useI18n();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    "font-display text-sm uppercase tracking-wide transition-colors " +
    (isActive ? "text-light" : "text-ash hover:text-light");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dotted border-light/20 bg-void/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" aria-label="FPMC — Home" className="shrink-0">
          <Logo className="h-7 w-auto" />
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1"
          aria-label={t("nav.home")}
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) => "hidden sm:inline " + navClass({ isActive })}
          >
            {t("nav.home")}
          </NavLink>
          <NavLink to="/studio" className={navClass}>
            {t("nav.studio")}
          </NavLink>
          <NavLink to="/connect" className={navClass}>
            {t("nav.connect")}
          </NavLink>
          <NavLink to="/links" className={navClass}>
            {t("nav.links")}
          </NavLink>
          <span className="hidden h-4 w-px bg-graphite sm:block" aria-hidden />
          <LangSwitcher />
        </nav>
      </div>
    </header>
  );
}
