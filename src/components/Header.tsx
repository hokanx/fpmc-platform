import { NavLink, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { useI18n } from "../i18n";

export function Header() {
  const { t } = useI18n();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    "text-xs uppercase tracking-widest transition-colors " +
    (isActive ? "text-light" : "text-ash hover:text-light");

  return (
    <header className="w-full border-b border-graphite/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" aria-label="FPMC — Home" className="shrink-0">
          <Logo className="h-7 w-auto" />
        </Link>

        <nav
          className="flex items-center gap-5"
          aria-label={t("nav.home")}
        >
          <NavLink to="/" end className={navClass}>
            {t("nav.home")}
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
