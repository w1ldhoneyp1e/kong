# Kong E-commerce

Интернет-магазин на Next.js + Medusa.js

## Стек технологий

- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Medusa.js
- **UI Kit**: Shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL
- **Type Safety**: TypeScript

## Быстрый старт

### Frontend

```bash
# Установка зависимостей
yarn install

# Запуск dev сервера
yarn dev
```

Откроется на http://localhost:3000

### Backend

**С Docker (рекомендуется):**

```bash
cd backend
docker-compose up
```

**Без Docker:**

См. `backend/INSTALL.md`

Backend доступен на:
- API: http://localhost:9000
- Admin: http://localhost:7001

## Документация

- **SETUP.md** - Настройка проекта
- **backend/INSTALL.md** - Установка и запуск backend
- **DEPLOYMENT.md** - Деплой на production

## Deployment

### Frontend → Vercel
1. Подключи репозиторий на vercel.com
2. Deploy автоматически

### Backend → VPS/Railway
См. подробную инструкцию в `DEPLOYMENT.md`

