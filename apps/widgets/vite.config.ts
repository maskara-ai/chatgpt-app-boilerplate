import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base for URL for serve package with CORS setup
  base: "http://localhost:4444/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
