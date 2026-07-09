import { useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Connect } from "./pages/Connect";
import { Links } from "./pages/Links";
import { Studio } from "./pages/Studio";
import { Impressum } from "./pages/Impressum";
import { Datenschutz } from "./pages/Datenschutz";
import { NotFound } from "./pages/NotFound";

// Reset scroll on route change (but honour in-page #anchor jumps).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Reveal .reveal elements as they scroll into view (re-scans on route change).
function ScrollReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    const id = window.setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    }, 60);
    return () => {
      window.clearTimeout(id);
      io.disconnect();
    };
  }, [pathname]);
  return null;
}

// Standard site chrome (header + footer) for the main routes.
function SiteLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollReveal />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/links" element={<Links />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* /studio is a standalone landing page with its own nav + footer. */}
        <Route path="/studio" element={<Studio />} />
      </Routes>
    </>
  );
}
