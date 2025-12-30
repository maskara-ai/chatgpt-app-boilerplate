import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import logger from "../utils/logger.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPS_DIR = path.resolve(__dirname, "..", "..", "..");

function readWidgetHtml(componentName: string): string {
  if (!fs.existsSync(APPS_DIR)) {
    throw new Error(`Widget assets not found. Expected directory ${APPS_DIR}.`);
  }

  const directPath = path.join(APPS_DIR, `${componentName}/dist/index.html`);
  let htmlContents: string | null = null;

  htmlContents = fs.readFileSync(directPath, "utf8");

  if (!htmlContents) {
    throw new Error(
      `Widget HTML for "${componentName}" not found in ${APPS_DIR}.`
    );
  }

  return htmlContents;
}

function registerResources(server: McpServer) {
  logger.info("Registering todo widget resources...");

  server.registerResource(
    "todo-widget",
    "ui://widget/todo.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/todo.html",
          name: "Todo Widget",
          description: "Todo widget markup",
          mimeType: "text/html+skybridge",
          text: readWidgetHtml("widgets"),
          _meta: {
            "openai/outputTemplate": "ui://widget/todo.html",
            "openai/toolInvocation/invoking": "Invoke Todo Widget",
            "openai/toolInvocation/invoked": "Invoked Todo Widget",
            "openai/widgetAccessible": true,
          },
        },
      ],
    })
  );

  logger.info("Todo widget resources registered successfully");
}

export default { registerResources };
