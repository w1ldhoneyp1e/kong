FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock* package-lock.json* ./

RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

COPY . .

RUN yarn build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock* package-lock.json* ./

RUN if [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci --omit=dev; \
    else npm install --omit=dev; fi

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/medusa-config.js ./
COPY --from=builder /app/package.json ./

RUN mkdir -p uploads

EXPOSE 9000

CMD ["yarn", "start"]

