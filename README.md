# ChatGPT App Boilerplate

Fast development with Turborepo setup for MCP server and widgets built with React. Easy local testing with Storybook.

## Overview

This monorepo provides a boilerplate for building ChatGPT apps with:

- **MCP Server**: A Model Context Protocol server built with TypeScript and Express
- **React Widgets**: UI components built with React, Vite, and Tailwind CSS
- **Storybook**: For easy local testing and component development

## Getting Started

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

The MCP server will start on `http://localhost:3002` (or the port specified in the `PORT` environment variable).

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

## Available Scripts

### Root Level

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all apps and packages
- `pnpm check-types` - Type check all TypeScript files
- `pnpm format` - Format code with Prettier

### MCP Server (`apps/mcp-server`)

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the TypeScript project
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm check-types` - Type check without emitting files

### Widgets (`apps/widgets`)

- `pnpm dev` - Start Vite dev server with watch mode
- `pnpm build` - Build for production
- `pnpm storybook` - Start Storybook development server
- `pnpm build-storybook` - Build Storybook for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Project Structure

```
.
├── apps/
│   ├── mcp-server/     # MCP server application
│   └── widgets/        # React widgets application
├── packages/
│   ├── eslint-config/  # Shared ESLint configuration
│   ├── typescript-config/ # Shared TypeScript configuration
│   └── ui/             # Shared UI components
└── turbo.json          # Turborepo configuration
```

## Technology Stack

- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **MCP Server**: TypeScript, Express, @modelcontextprotocol/sdk
- **Widgets**: React 19, Vite, Tailwind CSS, Storybook
- **Code Quality**: ESLint, Prettier, TypeScript

## Deployment

> WIP
