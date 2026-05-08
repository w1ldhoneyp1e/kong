# Kong Store

Интернет-магазин с фронтендом на Next.js 16 и проектным backend на NestJS.

## Стек

- Next.js 16 App Router
- NestJS API в `api/`
- TypeScript
- Tailwind CSS v4
- TanStack Query

## Быстрый старт

### Frontend

```bash
pnpm install
pnpm dev
```

### Backend

```bash
pnpm api:dev
```

### Локальный env

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Открой:

- фронт: `http://localhost:3000`
- backend: `http://localhost:9001`

## Полезные команды

```bash
pnpm typecheck
pnpm test
pnpm api:build
pnpm --dir api typecheck
```

## Структура

```text
src/   # frontend и next api routes
api/   # nest backend
docs/  # актуальная документация
```

## Примечания

- storefront и админка работают через Next API и Nest backend
- сидовый owner для локального старта:
  - `owner@kong.local`
  - `password123`
