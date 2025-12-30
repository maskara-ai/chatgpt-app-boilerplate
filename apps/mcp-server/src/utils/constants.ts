import packageJson from "../../package.json" with { type: "json" };

export const PACKAGE_NAME = packageJson.name;
export const VERSION = packageJson.version;
export const DEFAULT_PORT = 3002;
