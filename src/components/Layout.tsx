import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useI18n } from "../i18n";

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-light focus:px-3 focus:py-2 focus:text-void"
      >
        {t("meta.skip")}
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
