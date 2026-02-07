FROM node:20-slim
WORKDIR /server
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ postgresql-client && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm exec medusa build
EXPOSE 9000
ENTRYPOINT ["/bin/sh", "start.sh"]
