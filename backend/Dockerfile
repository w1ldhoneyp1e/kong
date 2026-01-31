FROM node:20-slim
WORKDIR /server
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ postgresql-client && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install
COPY . .
RUN pnpm run build
EXPOSE 9000
ENTRYPOINT ["/bin/sh", "start.sh"]
