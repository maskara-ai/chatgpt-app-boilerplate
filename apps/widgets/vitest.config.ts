/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    restoreMocks: true,
    environment: "jsdom",
    setupFiles: ["./setup-test-env.ts"],
    include: ["./src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules"],
    coverage: {
      exclude: ["**/node_modules/**", "**/index.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
