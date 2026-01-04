# FROM node:22-alpine AS base

# # RUN npm install --global corepack@latest
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# RUN corepack install --global pnpm@10.26.2

# # COPY . /app
# # WORKDIR /app



# # Generate a partial monorepo for a target package. The output will be placed into a directory named "out"
# # FROM base AS prune
# # RUN apk update
# # RUN apk add --no-cache libc6-compat

# FROM base AS prune
# WORKDIR /app
# RUN pnpm install turbo --global
# COPY . .
# RUN turbo prune mcp-server --docker



# # This Step only installs Production & Dev dependencies
# FROM base AS installer
# WORKDIR /app
# # the /out/json contain the package.json file that is used to install packages related to the "web" 
# COPY --from=prune /app/out/json/ .
# RUN pnpm install



# # This Step only installs Production dependencies only
# FROM base AS installer-production
# WORKDIR /app
# # the /out/json contain the package.json file that is used to install packages related to the "web" 
# COPY --from=prune /app/out/json/ .
# RUN pnpm install --prod



# # Uses the dev & production dependencies to make a production build
# FROM base AS builder
# WORKDIR /app
# COPY --from=installer /app /app
# # the /out/full contain the code files that is used to run the package "web" 
# COPY --from=prune /app/out/full/ .
# RUN pnpm turbo build --filter=mcp-server



# # runner will use the builder output, and use only the node_modules for production to reduce the size of the final image
# FROM base AS runner
# WORKDIR /app

# # Don't run production as root
# RUN addgroup --system --gid 1001 web-group
# RUN adduser --system --uid 1001 web-user
# USER web-user

# # Copy Production dependencies, build and public dirctories
# COPY --from=installer-production --chown=web-user:web-group /app/node_modules /app/node_modules
# COPY --from=prune   --chown=web-user:web-group /app/out/json/ .
# COPY --from=builder --chown=web-user:web-group /app/apps/mcp-server/dist /app/apps/mcp-server/dist
# COPY --from=builder --chown=web-user:web-group /app/apps/widgets/dist /app/apps/widgets/dist

# WORKDIR /app/apps/mcp-server

# CMD ["pnpm", "run", "start"]

FROM node:22-alpine AS base

# Inherited across all stages from the base image
WORKDIR /app

RUN apk update && \ 
    apk add --no-cache libc6-compat curl && \
    corepack enable && \
    corepack install --global pnpm@10.26.2

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Both runtime and build time environment variables
ENV CAB_MCP_SERVER_BASE_URL=$CAB_MCP_SERVER_BASE_URL
ENV CAB_MCP_SERVER_PORT=$CAB_MCP_SERVER_PORT
 
# ---
FROM base AS prepare
RUN pnpm install turbo --global
COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune mcp-server --docker
 
# ---
FROM base AS builder
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN pnpm install
# Build the project
COPY --from=prepare /app/out/full/ .
RUN pnpm turbo build

# ---
FROM base AS prod-deps
COPY --from=prepare /app/out/json/ .
RUN pnpm install --prod
 
# ---
FROM base AS runner

# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 chatgptapp
USER chatgptapp
 
COPY --from=prod-deps --chown=chatgptapp:nodejs /app/node_modules /app/node_modules
COPY --from=prod-deps --chown=chatgptapp:nodejs /app/apps/mcp-server/node_modules /app/apps/mcp-server/node_modules
COPY --from=builder --chown=chatgptapp:nodejs /app/apps/mcp-server/dist /app/apps/mcp-server/dist
COPY --from=builder --chown=chatgptapp:nodejs /app/apps/widgets/dist /app/apps/widgets/dist
 
EXPOSE $CAB_MCP_SERVER_PORT

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${CAB_MCP_SERVER_PORT:-3002}/health || exit 1
 
CMD ["node", "apps/mcp-server/dist/index.js"]