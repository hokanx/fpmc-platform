import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";

// Route-split: framer-motion (used by Home/Studio) stays out of the shared bundle,
// keeping /links and the legal pages light (Lighthouse budget).
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
      </Suspense>
    </>
  );
}
