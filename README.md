# Kong Store

Современный интернет-магазин на Next.js 16 с Medusa backend и Algolia Search.

## Возможности

- ✅ **Medusa Backend** - мощный e-commerce backend
- ✅ **Algolia Search** - мгновенный поиск и фильтрация
- ✅ **Next.js 16 App Router** - современная архитектура
- ✅ **TypeScript** - типизация для надежности
- ✅ **Tailwind CSS v4** - современные стили
- ✅ **shadcn/ui** - красивые компоненты
- ✅ **Docker** - простой деплой на любом сервере

## Быстрый старт

### 1. Запуск через Docker (рекомендуется)

```bash
# Backend (Medusa + Postgres + Redis)
cd backend
sudo docker compose up -d --build

# Frontend
yarn install
yarn dev
```

→ Frontend: http://localhost:3000  
→ Backend API: http://localhost:9000  
→ Admin категорий: http://localhost:3000/admin/categories

### 2. Локальная разработка без Docker

```bash
# Frontend
yarn install
yarn dev

# Backend (требуется Postgres и Redis)
cd backend
cp .env.example .env
npm install
npm run dev
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=kong_products
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

#### Backend (.env)

```env
DATABASE_URL=postgres://postgres:postgres@postgres:5432/medusa
REDIS_URL=redis://redis:6379
ALGOLIA_APP_ID=your_app_id
ALGOLIA_ADMIN_API_KEY=your_admin_api_key
ALGOLIA_INDEX_NAME=kong_products
```

### 3. Запуск проекта

```bash
# Backend (в отдельном терминале)
cd backend
docker-compose up -d  # Запуск PostgreSQL и Redis
pnpm dev

# Frontend
yarn dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Архитектура

### Frontend

```
src/
├── app/                    # Next.js App Router страницы
│   ├── catalog/           # Страницы каталога
│   ├── product/           # Страницы продуктов
│   └── layout.tsx         # Основной layout
├── components/
│   ├── layout/            # Header, Footer, Logo
│   ├── product/           # ProductCard и связанные
│   ├── search/            # Algolia Search компоненты
│   ├── pwa/              # PWA функциональность
│   └── ui/               # shadcn/ui компоненты
└── lib/
    ├── algolia/          # Algolia клиент
    └── medusa/           # Medusa клиент
```

### Backend

```
backend/
├── src/
│   ├── api/              # API endpoints
│   └── subscribers/      # Event subscribers (Algolia sync)
└── medusa-config.js      # Конфигурация Medusa
```

## Algolia интеграция

### Синхронизация продуктов

Backend автоматически синхронизирует продукты с Algolia при:
- Создании продукта
- Обновлении продукта
- Удалении продукта

### Поиск на фронтенде

Используется `react-instantsearch` для:
- Мгновенный поиск
- Фильтрация
- Сортировка
- Пагинация

## PWA

Приложение поддерживает PWA:
- Service Worker для кэширования
- Manifest для установки
- Работает офлайн (базовые страницы)

## Разработка

### Добавление новых продуктов

```bash
# Через Medusa API
curl -X POST http://localhost:9000/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Новый продукт",
    "description": "Описание",
    "status": "published"
  }'
```

Продукт автоматически синхронизируется с Algolia.

### Создание новых компонентов UI

```bash
# Используйте shadcn/ui CLI
npx shadcn@latest add [component]
```

## Структура данных Algolia

```typescript
{
  objectID: string
  title: string
  description: string
  handle: string
  thumbnail: string
  variants: Array<{
    id: string
    title: string
    sku: string
    prices: Array<any>
  }>
  categories: string[]
  collection: string | null
  tags: string[]
  created_at: string
  updated_at: string
}
```

## Деплой

### Vercel (Frontend)

```bash
vercel --prod
```

### Docker (Backend)

```bash
cd backend
docker build -t kong-backend .
docker run -p 9000:9000 kong-backend
```
