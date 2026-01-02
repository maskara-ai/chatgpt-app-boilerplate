import { config } from "@dotenvx/dotenvx";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_DIR = path.resolve(__dirname, "..", "..", "..", "..");

export const baseEnv =
  config({
    path: `${REPO_DIR}/.env`,
  }).parsed ?? {};

export const dynamicEnvValues = {
  // EXAMPLE: EXAMPLE_ENV_VALUE: condition ? value : value2
} as const;
