# Kong Store

Современный интернет-магазин на Next.js 16 с Medusa backend и Yandex Suggest.

## Возможности

- ✅ **Medusa Backend** - мощный e-commerce backend
- ✅ **Поиск** - подсказки запросов (Yandex), товары и фильтрация через фронт и бэкенд
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
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

#### Backend (.env)

```env
DATABASE_URL=postgres://postgres:postgres@postgres:5432/medusa
REDIS_URL=redis://redis:6379
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
│   ├── search/            # Поиск (подсказки Yandex + результаты с бэка)
│   ├── pwa/              # PWA функциональность
│   └── ui/               # shadcn/ui компоненты
└── lib/
    ├── yandex/           # Yandex Suggest (подсказки запросов)
    └── medusa/           # Medusa клиент
```

### Backend

```
backend/
├── src/
│   └── api/              # API endpoints
└── medusa-config.js      # Конфигурация Medusa
```

## Поиск

- **Подсказки запросов** — Yandex Suggest (прокси через `/api/suggest`).
- **Результаты и фильтрация** — данные с Medusa Store API (`/store/products?q=...`), отображение и фильтрация на фронте.

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

### Создание новых компонентов UI

```bash
# Используйте shadcn/ui CLI
npx shadcn@latest add [component]
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
