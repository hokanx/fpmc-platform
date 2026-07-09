import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Reveal } from "../components/motion/Reveal";

export function NotFound() {
  const { t } = useI18n();
  useDocumentTitle("404");

  return (
    <section className="px-5 py-28">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="font-display text-5xl tracking-widest text-ash">404</p>
        <h1 className="mt-6 text-2xl">{t("notfound.title")}</h1>
        <p className="mt-4 text-ash">{t("notfound.body")}</p>
        <div className="mt-8 flex justify-center">
          <Link to="/" className="btn">
            {t("notfound.cta")}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
