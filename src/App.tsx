import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";

// Route-split: framer-motion (used by Home/Studio) stays out of the shared bundle,
// keeping /links and the legal pages light (Lighthouse budget).
const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const CinematicHome = lazy(() =>
  import("./pages/CinematicHome").then((m) => ({ default: m.CinematicHome })),
);
const Connect = lazy(() => import("./pages/Connect").then((m) => ({ default: m.Connect })));
const Links = lazy(() => import("./pages/Links").then((m) => ({ default: m.Links })));
const Studio = lazy(() => import("./pages/Studio").then((m) => ({ default: m.Studio })));
const Confirm = lazy(() => import("./pages/Confirm").then((m) => ({ default: m.Confirm })));
const Impressum = lazy(() => import("./pages/Impressum").then((m) => ({ default: m.Impressum })));
const Datenschutz = lazy(() =>
  import("./pages/Datenschutz").then((m) => ({ default: m.Datenschutz })),
);
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));

// Reset scroll on route change (but honour in-page #anchor jumps).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
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
      <Suspense fallback={<div className="min-h-dvh bg-void" />}>
        <Routes>
          {/* Track 2 masterpiece — the cinematic one-pager owns "/" with its
              own chrome. The v0 Home stays at /v0 as a verified fallback. */}
          <Route path="/" element={<CinematicHome />} />
          <Route element={<SiteLayout />}>
            <Route path="/v0" element={<Home />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/confirm" element={<Confirm />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            {/* Giveaway T&C — flag-gated inside Terms (404 while off, unlinked) */}
            <Route path="/teilnahmebedingungen" element={<Terms />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* /studio and /links are standalone cinematic pages with their own
              chrome (Lichtspiel v2, same stage as the home). */}
          <Route path="/studio" element={<Studio />} />
          <Route path="/links" element={<Links />} />
        </Routes>
      </Suspense>
    </>
  );
}
