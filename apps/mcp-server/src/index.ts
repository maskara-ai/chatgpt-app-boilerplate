import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { VERSION, PACKAGE_NAME } from "./utils/constants.js";
import type { Request, Response } from "express";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import loadedEnv from "@repo/env";
import todoTools from "./tools/todo-tools.js";
import logger from "./utils/logger.js";
import todoResources from "./resources/todo-resources.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPS_DIR = path.resolve(__dirname, "..", "..");

const baseUrl = new URL(loadedEnv.CAB_MCP_SERVER_BASE_URL);

const PORT = Number(baseUrl.port);

let serverInstance: McpServer | null = null;
let transportInstance:
  | StreamableHTTPServerTransport
  | StdioServerTransport
  | null = null;

export async function startServer(): Promise<McpServer> {
  logger.info(`Starting MCP server with ${PACKAGE_NAME} v${VERSION}`);

  logger.info("Starting MCP server initialization...");

  serverInstance = new McpServer({
    name: PACKAGE_NAME,
    version: VERSION,
  });

  // Register tools and resources
  logger.info("Registering MCP tools and resources...");
  todoTools.registerTools(serverInstance);
  todoResources.registerResources(serverInstance);
  logger.debug("All tools and resources registered");

  const app = express();
  app.use(cors());
  app.use(express.json());

  const mcpEndpoint = "/mcp";
  logger.debug(`MCP endpoint: ${mcpEndpoint}`);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await serverInstance.connect(transport);
  transportInstance = transport;

  app.all(mcpEndpoint, (req: Request, res: Response) => {
    transport.handleRequest(req, res, req.body).catch((err: unknown) => {
      logger.error("Error in transport.handleRequest: " + err);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Internal Server Error",
        });
      }
    });
  });

  app.get("/", (_req: Request, res: Response) => {
    res.send(`Boilerplate MCP Server v${VERSION} is running`);
  });

  app.use("/static", express.static(path.join(APPS_DIR, "widgets/dist")));

  await new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      logger.info(
        `HTTP transport listening on ${baseUrl.origin}${mcpEndpoint}`
      );
      resolve();
    });
  });

  setupGracefulShutdown();
  return serverInstance;
}

async function main() {
  // Optional configuration
  await startServer();
}

main().catch((err) => {
  logger.error("Unhandled error in main process", err);
  process.exit(1);
});

function setupGracefulShutdown() {
  const shutdown = async () => {
    try {
      logger.info("Shutting down gracefully...");

      if (
        transportInstance &&
        "close" in transportInstance &&
        typeof transportInstance.close === "function"
      ) {
        await transportInstance.close();
      }

      if (serverInstance && typeof serverInstance.close === "function") {
        await serverInstance.close();
      }

      process.exit(0);
    } catch (err) {
      logger.error("Error during shutdown: " + err);
      process.exit(1);
    }
  };

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal as NodeJS.Signals, shutdown);
  });
}
