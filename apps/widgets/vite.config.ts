import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import loadedEnv from "@repo/env";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: `${loadedEnv.CAB_MCP_SERVER_BASE_URL}/static/`,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
