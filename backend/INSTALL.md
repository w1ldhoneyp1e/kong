# Установка Backend

## С Docker (рекомендуется)

### 1. Установка Docker

Скачай: https://www.docker.com/products/docker-desktop/

### 2. Запуск

```bash
cd backend
docker-compose up
```

### Доступ

- API: http://localhost:9000
- Admin: http://localhost:7001

### Управление

```bash
docker-compose down           # Остановка
docker-compose down -v        # Очистка данных
```

---

## Без Docker

### Требования

- Node.js 18+
- PostgreSQL 15+

### Настройка

1. Установи PostgreSQL: https://www.postgresql.org/download/windows/
2. Создай базу: `CREATE DATABASE medusa;`
3. Скопируй `.env.example` → `.env`
4. Отредактируй `DATABASE_URL` в `.env`

### Запуск

```bash
cd backend
yarn install
yarn dev
```

---

## Проблемы?

**Порт занят**: Измени PORT в `.env`  
**Ошибки БД**: `docker-compose down -v && docker-compose up`
