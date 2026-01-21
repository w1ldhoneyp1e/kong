# Kong Store Backend (Medusa)

Backend для интернет-магазина Kong на базе Medusa.js

## Требования

- Node.js 18+
- Docker и Docker Compose
- Yarn

## Локальная разработка

### 1. Установка зависимостей

```bash
cd backend
yarn install
```

### 2. Запуск через Docker Compose

```bash
docker-compose up
```

Это запустит:
- PostgreSQL (порт 5432)
- Redis (порт 6379)
- Medusa API (порт 9000)
- Medusa Admin (порт 7001)

### 3. Запуск миграций

После первого запуска:

```bash
yarn migration:run
```

### 4. Seed данных (опционально)

```bash
yarn seed
```

## Доступ

- **API**: http://localhost:9000
- **Admin Panel**: http://localhost:7001
- **Store API**: http://localhost:9000/store
- **Admin API**: http://localhost:9000/admin

## Команды

```bash
yarn dev              # Запуск в режиме разработки
yarn build            # Сборка для production
yarn start            # Запуск production сервера
yarn migration:generate  # Создать новую миграцию
yarn migration:run    # Применить миграции
yarn seed             # Заполнить БД тестовыми данными
```

## Переменные окружения

См. `.env.example`

## Production Deployment

### Сборка Docker образа

```bash
docker build -t kong-backend .
```

### Запуск

```bash
docker run -p 9000:9000 \
  -e DATABASE_URL=your_db_url \
  -e REDIS_URL=your_redis_url \
  -e JWT_SECRET=your_secret \
  -e COOKIE_SECRET=your_secret \
  kong-backend
```

## Структура

```
backend/
├── src/              # Исходный код
├── dist/             # Скомпилированный код
├── uploads/          # Загруженные файлы
├── medusa-config.js  # Конфигурация Medusa
└── docker-compose.yml # Docker Compose для разработки
```

