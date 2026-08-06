import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Fonts are loaded from Google Fonts in index.html (FPMC request, 06.08.2026).
// The previous build self-hosted the same OFL families via @fontsource; that
// path is DSGVO-safer for a German audience and is one <link> away if wanted.

import "./index.css";
import { I18nProvider } from "./i18n";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
);
