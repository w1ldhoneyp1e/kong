# Установка и запуск Kong Backend

## Вариант 1: С Docker (Рекомендуется)

### Установка Docker

**Windows:**
1. Скачай Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Установи и запусти Docker Desktop
3. Убедись, что Docker запущен (иконка в трее)

**После установки проверь:**
```bash
docker --version
docker-compose --version
```

### Запуск с Docker

```bash
cd backend
docker-compose up
```

Это запустит:
- PostgreSQL на порту 5432
- Redis на порту 6379
- Medusa на порту 9000

**Доступ:**
- API: http://localhost:9000
- Admin: http://localhost:7001

**Остановка:**
```bash
docker-compose down
```

**Очистка данных:**
```bash
docker-compose down -v
```

---

## Вариант 2: Без Docker (Локально)

Если не хочешь использовать Docker, можно запустить всё локально.

### Требования

- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (опционально)

### Установка PostgreSQL (Windows)

1. Скачай: https://www.postgresql.org/download/windows/
2. Установи с настройками по умолчанию
3. Запомни пароль для пользователя `postgres`
4. Создай базу данных:

```sql
CREATE DATABASE medusa;
```

### Установка Redis (опционально)

Redis нужен для продакшена, для разработки можно без него.

**Windows (через WSL или Memurai):**
- Memurai: https://www.memurai.com/get-memurai
- Или используй WSL2 и установи Redis там

### Настройка

1. Скопируй `.env.example` в `.env`:
```bash
copy .env.example .env
```

2. Отредактируй `.env`:
```env
DATABASE_URL=postgres://postgres:ТВОЙ_ПАРОЛЬ@localhost:5432/medusa
REDIS_URL=redis://localhost:6379

JWT_SECRET=сгенерируй_случайную_строку
COOKIE_SECRET=сгенерируй_случайную_строку

PORT=9000
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:3000,http://localhost:7001
```

### Запуск

```bash
cd backend
yarn install
yarn dev
```

---

## После запуска

### Проверка работы

Открой: http://localhost:9000

Должен увидеть:
```json
{
  "message": "Kong Store API",
  "version": "1.0.0",
  "status": "ok"
}
```

### Доступ к Admin панели

http://localhost:7001

При первом запуске создаст админа.

---

## Рекомендации

**Для разработки:**
- Используй Docker (проще)
- Или PostgreSQL локально + без Redis

**Для production:**
- Обязательно Docker
- Обязательно Redis
- Обязательно смени JWT_SECRET и COOKIE_SECRET

---

## Проблемы?

### Порт 5432 занят
PostgreSQL уже запущен локально. Либо останови его, либо измени порт в docker-compose.yml.

### Порт 9000 занят
Medusa уже запущен или порт занят. Измени PORT в .env.

### Ошибки миграций
```bash
# Сбрось базу
docker-compose down -v
docker-compose up
```

---

## Следующие шаги

1. ✅ Установи Docker
2. ✅ Запусти `docker-compose up`
3. ✅ Проверь http://localhost:9000
4. ✅ Открой Admin http://localhost:7001
5. ✅ Подключи frontend к backend

