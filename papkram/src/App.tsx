import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Start from "./pages/Start";
import Hilfe from "./pages/Hilfe";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import NotFound from "./pages/NotFound";

const FOOTER_LINKS = [
  { to: "/hilfe", label: "So geht's" },
  { to: "/datenschutz", label: "Daten·schutz" },
  { to: "/impressum", label: "Impressum" },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const onStart = pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-action focus:px-4 focus:py-3 focus:font-bold focus:text-white"
      >
        Zum Inhalt springen
      </a>

      <header className="border-b border-line">
        <div className="wrap flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Papkram
          </Link>
          {!onStart && (
            <Link to="/" className="font-bold text-action underline underline-offset-4">
              Startseite
            </Link>
          )}
        </div>
      </header>

      <main id="inhalt" className="wrap flex-1 py-8">
        {children}
      </main>

      <footer className="mt-12 border-t border-line py-6">
        <nav className="wrap flex flex-wrap gap-x-6 gap-y-3" aria-label="Weitere Seiten">
          {FOOTER_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `min-h-[2.75rem] py-2 font-bold underline underline-offset-4 ${
                  isActive ? "text-ink" : "text-action"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/hilfe" element={<Hilfe />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
