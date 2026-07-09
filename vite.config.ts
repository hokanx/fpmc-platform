import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// FPMC Website V0 — React + Vite + Tailwind v4 (Lichtspiel tokens live in src/index.css @theme).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
  },
});
