<div align="center">

# ChatGPT App Boilerplate

**Fast development with Turborepo setup for MCP server and widgets built with React. Easy local testing with Storybook.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat&logo=turborepo&logoColor=white)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)

</div>

## Overview

This monorepo provides a boilerplate for building ChatGPT apps with:

- **MCP Server**: A Model Context Protocol server built with TypeScript and Express
- **React Widgets**: UI components built with React, Vite, and Tailwind CSS
- **Storybook**: For easy local testing and component development

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm (install via `npm install -g pnpm` or `corepack enable`)
- [ngrok](https://ngrok.com/) (for connecting to OpenAI)

### Cloning the Repository

```bash
git clone git@github.com:maskara-ai/chatgpt-app-boilerplate.git
cd chatgpt-app-boilerplate
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# MCP Server Configuration
CAB_MCP_SERVER_BASE_URL=http://localhost
CAB_MCP_SERVER_PORT=3002

# Optional: Logging
PINO_LOG_LEVEL=info
```

You can copy from a sample file if available, or create the `.env` file manually with the variables above.

### Installation

```bash
pnpm install
```

### Development

Run all apps in development mode:

```bash
pnpm dev
```

This will start:

- MCP server (default: `http://localhost:3002`)
- Widgets development server with Vite (default: `http://localhost:5173`)

### Running Individual Apps

#### MCP Server

```bash
cd apps/mcp-server
pnpm dev
```

The MCP server will start on `http://localhost:3002` (or the port specified in the `CAB_MCP_SERVER_PORT` environment variable).

Use ngrok in order to connect to OpenAI:

```bash
ngrok http 3002
```

#### Widgets with Storybook (local testing)

```bash
cd apps/widgets
pnpm storybook
```

Storybook will start on `http://localhost:6006` for easy local testing and component development.

### Chrome Local Testing (Local Network Access)

When testing locally in Chrome, you may encounter restrictions due to Chrome's [Local Network Access](https://developer.chrome.com/blog/local-network-access) security feature, because JS and CSS for widgets served under localhost for development.

**To enable local network access in Chrome:**

1. Go to `chrome://flags/#local-network-access-check`
2. Set the flag to **"Enabled (Blocking)"**
3. Restart Chrome

When you visit a site that needs to connect to localhost, Chrome will show a permission prompt: _"Look for and connect to any device on your local network."_ Grant this permission to allow your application to connect to the local MCP server.

**Note:** This is particularly important when:

- Testing widgets that connect to `localhost:3002`
- Using HTTPS pages that need to connect to HTTP localhost endpoints
- Developing features that require local network access

For more details, see the [Chrome Local Network Access documentation](https://developer.chrome.com/blog/local-network-access).

## Project Structure

```
.
├── apps/
│   ├── mcp-server/     # MCP server application
│   └── widgets/        # React widgets application
├── packages/
│   ├── eslint-config/  # Shared ESLint configuration
│   ├── typescript-config/ # Shared TypeScript configuration
└── turbo.json          # Turborepo configuration
```

## Technology Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **MCP Server**: TypeScript, Express, @modelcontextprotocol/sdk
- **Widgets**: React 19, Vite, Tailwind CSS, Storybook
- **Code Quality**: ESLint, Prettier, TypeScript

## Deployment - Container Setup

### Building the Container

The project includes a Dockerfile for containerized deployment. **Important:** Environment variables must be provided at build time in order to provide absolute url for static assets like JS and CSS (React).

Build the container using Podman (or Docker):

```bash
podman build --env CAB_MCP_SERVER_BASE_URL=http://localhost --env CAB_MCP_SERVER_PORT=3002 -t localhost/mcp-server:1 .
```

**Note:** The `CAB_MCP_SERVER_BASE_URL` and `CAB_MCP_SERVER_PORT` environment variables are required at build time and will be baked into the container image.

### Running the Container

After building, run the container:

```bash
podman run -p 3002:3002 localhost/mcp-server:1
```

Or with Docker:

```bash
docker run -p 3002:3002 localhost/mcp-server:1
```

The MCP server will be available at `http://localhost:3002`.
