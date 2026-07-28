import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Serves `api/*.ts` from the Vite dev server so `npm run dev` gives a working
 * app without the Vercel CLI. In production those same files are Vercel
 * serverless functions — they take (req, res) and write via api/_lib/http.ts,
 * which only uses plain Node ServerResponse methods, so the two paths behave
 * identically.
 */
function apiDev(): Plugin {
  return {
    name: "papkram-api-dev",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/")) return next();

        const route = url.split("?")[0].slice("/api/".length).replace(/\/+$/, "");
        // No traversal outside api/ — the route is a bare filename.
        if (!/^[a-z0-9_-]+$/i.test(route)) return next();

        const file = resolve(here, "api", `${route}.ts`);
        if (!existsSync(file)) return next();

        void server
          .ssrLoadModule(file)
          .then((mod) => (mod.default as (rq: unknown, rs: unknown) => unknown)(req, res))
          .catch((err: Error) => {
            server.ssrFixStacktrace(err);
            server.config.logger.error(`[api/${route}] ${err.stack ?? err.message}`);
            if (!res.writableEnded) {
              res.statusCode = 500;
              res.setHeader("content-type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: "dev_handler_failed", message: err.message }));
            }
          });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDev()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
  },
});
