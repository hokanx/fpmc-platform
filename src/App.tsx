import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";

// Route-split so each page pulls only its own film + copy.
const Start = lazy(() => import("./pages/Start").then((m) => ({ default: m.Start })));
const Arbeit = lazy(() => import("./pages/Arbeit").then((m) => ({ default: m.Arbeit })));
const Label = lazy(() => import("./pages/Label").then((m) => ({ default: m.Label })));

// Kept, not deleted: the previous cinematic one-pager and the v0 home stay
// reachable as verified fallbacks until FPMC signs the restructure off.
const CinematicHome = lazy(() =>
  import("./pages/CinematicHome").then((m) => ({ default: m.CinematicHome })),
);
const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const Connect = lazy(() => import("./pages/Connect").then((m) => ({ default: m.Connect })));
const Links = lazy(() => import("./pages/Links").then((m) => ({ default: m.Links })));
const Studio = lazy(() => import("./pages/Studio").then((m) => ({ default: m.Studio })));
const Impressum = lazy(() => import("./pages/Impressum").then((m) => ({ default: m.Impressum })));
const Datenschutz = lazy(() =>
  import("./pages/Datenschutz").then((m) => ({ default: m.Datenschutz })),
);
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

// Reset scroll on route change (but honour in-page #anchor jumps).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Standard site chrome (header + footer) for the secondary routes.
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
      <Suspense fallback={<div className="min-h-dvh bg-void" />}>
        <Routes>
          {/* The three-page structure. Each page carries its own two-chapter film. */}
          <Route path="/" element={<Start />} />
          <Route path="/arbeit" element={<Arbeit />} />
          <Route path="/label" element={<Label />} />

          {/* Previous versions, kept reachable. */}
          <Route path="/v1" element={<CinematicHome />} />

          <Route element={<SiteLayout />}>
            <Route path="/v0" element={<Home />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone cinematic pages with their own chrome. */}
          <Route path="/studio" element={<Studio />} />
          <Route path="/links" element={<Links />} />
        </Routes>
      </Suspense>
    </>
  );
}
