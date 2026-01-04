import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    envDir: "../../.env",
    plugins: [react(), tailwindcss()],
    base: `${process.env.CAB_MCP_SERVER_BASE_URL}:${process.env.CAB_MCP_SERVER_PORT}/static/`,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
