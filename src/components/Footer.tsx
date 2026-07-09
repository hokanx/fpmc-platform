import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { CONTACT_EMAIL, MAILTO } from "../config";

// Impressum + Datenschutz are reachable from every page via this footer.
export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-dotted border-light/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-ash sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display uppercase tracking-wide">{t("footer.rights")}</p>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href={MAILTO} className="hover:text-light transition-colors">
            {CONTACT_EMAIL}
          </a>
          <Link to="/impressum" className="hover:text-light transition-colors">
            {t("footer.impressum")}
          </Link>
          <Link to="/datenschutz" className="hover:text-light transition-colors">
            {t("footer.datenschutz")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
