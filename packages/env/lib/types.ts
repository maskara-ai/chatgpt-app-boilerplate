import type { dynamicEnvValues } from "./index.js";

interface IChatGPTAppEnv {
  readonly CAB_MCP_SERVER_BASE_URL: string;
}

export type EnvType = IChatGPTAppEnv & typeof dynamicEnvValues;
