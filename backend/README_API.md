# API Documentation

## Наши кастомные эндпоинты

### Categories (Категории)

#### Получить все категории
```bash
GET /store/categories
```

**Ответ:**
```json
{
  "categories": [
    {
      "id": "1",
      "name": "Электроника",
      "slug": "electronics"
    }
  ]
}
```

#### Получить одну категорию
```bash
GET /store/categories/:id
```

#### Создать категорию
```bash
POST /store/categories
Content-Type: application/json

{
  "name": "Игрушки",
  "slug": "toys"
}
```

#### Обновить категорию
```bash
PUT /store/categories/:id
Content-Type: application/json

{
  "name": "Новое название",
  "slug": "new-slug"
}
```

#### Удалить категорию
```bash
DELETE /store/categories/:id
```

---

## Встроенные эндпоинты Medusa

### Store API (публичный)

Базовый URL: `http://localhost:9000/store`

**Товары:**
- `GET /store/products` - список товаров
- `GET /store/products/:id` - один товар
- `GET /store/products/search` - поиск

**Корзина:**
- `POST /store/carts` - создать корзину
- `GET /store/carts/:id` - получить корзину
- `POST /store/carts/:id/line-items` - добавить товар

**Коллекции:**
- `GET /store/collections` - список коллекций

**Регионы:**
- `GET /store/regions` - доступные регионы

### Admin API (требует авторизации)

Базовый URL: `http://localhost:9000/admin`

**Товары:**
- `GET /admin/products`
- `POST /admin/products`
- `PUT /admin/products/:id`
- `DELETE /admin/products/:id`

**Заказы:**
- `GET /admin/orders`
- `GET /admin/orders/:id`

---

## Тестирование

### Через curl

```bash
# Получить категории
curl http://localhost:9000/store/categories

# Создать категорию
curl -X POST http://localhost:9000/store/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Игрушки","slug":"toys"}'
```

### Через REST Client в VSCode

1. Установи расширение "REST Client"
2. Открой `test-api.http`
3. Нажми "Send Request" над каждым запросом

### Через браузер

Открой: http://localhost:9000/store/categories

---

## Полная документация Medusa

- Store API: https://docs.medusajs.com/api/store
- Admin API: https://docs.medusajs.com/api/admin

