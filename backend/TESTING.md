# Тестирование API

## Тестовые endpoints (без БД)

Пока Docker не установлен, можно протестировать простые endpoints:

### Запуск

```bash
cd backend
yarn dev
```

### Доступные endpoints

#### 1. Проверка статуса
```bash
curl http://localhost:9000
```

Ответ:
```json
{
  "message": "Kong Store API",
  "version": "1.0.0",
  "status": "ok"
}
```

#### 2. Получить все товары
```bash
curl http://localhost:9000/test/products
```

#### 3. Получить товар по ID
```bash
curl http://localhost:9000/test/products/1
```

#### 4. Создать товар
```bash
curl -X POST http://localhost:9000/test/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Новый товар","price":4990,"description":"Описание"}'
```

#### 5. Обновить товар
```bash
curl -X PUT http://localhost:9000/test/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Обновленное название","price":2500}'
```

#### 6. Удалить товар
```bash
curl -X DELETE http://localhost:9000/test/products/1
```

---

## Настоящий Medusa API (после установки Docker)

После `docker-compose up` будут доступны полноценные Medusa endpoints:

### Store API (для фронтенда)

**Базовый URL:** `http://localhost:9000/store`

#### Товары
- `GET /store/products` - Список товаров
- `GET /store/products/:id` - Товар по ID

#### Корзина
- `POST /store/carts` - Создать корзину
- `POST /store/carts/:id/line-items` - Добавить товар
- `DELETE /store/carts/:id/line-items/:line_id` - Удалить товар

#### Регионы
- `GET /store/regions` - Список регионов

#### Оформление заказа
- `POST /store/carts/:id/complete` - Завершить заказ

### Admin API (для админки)

**Базовый URL:** `http://localhost:9000/admin`

Требуется авторизация!

#### Товары
- `GET /admin/products` - Список
- `POST /admin/products` - Создать
- `PUT /admin/products/:id` - Обновить
- `DELETE /admin/products/:id` - Удалить

#### Заказы
- `GET /admin/orders` - Список заказов
- `GET /admin/orders/:id` - Заказ по ID

---

## Инструменты для тестирования

### 1. Браузер
```
http://localhost:9000/test/products
```

### 2. curl (PowerShell)
```powershell
curl http://localhost:9000/test/products
```

### 3. REST Client (VSCode extension)
Открой `test-api.http` и нажимай "Send Request"

### 4. Postman
Импортируй endpoints из документации

---

## Документация Medusa API

После запуска с Docker:

- **Swagger UI:** http://localhost:9000/docs
- **Официальная документация:** https://docs.medusajs.com/api

