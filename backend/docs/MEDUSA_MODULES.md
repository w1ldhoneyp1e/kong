# Использование встроенных модулей Medusa

Встроенные модули (Product, Cart, Order и т.д.) уже зарегистрированы в контейнере. Их сервисы не нужно описывать — достаточно получить сервис по имени и вызывать методы.

## 1. Импорт enum модулей

Имена модулей заданы в enum `Modules` из `@medusajs/framework/utils`:

```ts
import { Modules } from "@medusajs/framework/utils"
```

Основные значения: `Modules.PRODUCT`, `Modules.CART`, `Modules.ORDER`, `Modules.CUSTOMER`, `Modules.REGION`, `Modules.PRICING`, `Modules.INVENTORY`, `Modules.EVENT_BUS` и др.

## 2. Резолв сервиса в API-роуте

В любом роуте доступен контейнер запроса `req.scope`:

```ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productService = req.scope.resolve(Modules.PRODUCT)
  const { data } = await productService.listProducts({}, { take: 20 })
  res.json({ products: data })
}
```

## 3. Кастомный модуль (как у нас category)

Имя — строка, которую передаёте в `Module(..., { service })` (например, `"category"`). Резолв тот же:

```ts
import { CATEGORY_MODULE } from "../../modules/category"

const categoryService = req.scope.resolve(CATEGORY_MODULE)
```

## 4. Общие ресурсы контейнера

- `req.scope.resolve("query")` — кросс-модульный Query (граф-запросы по связям).
- `req.scope.resolve("link")` — управление связями между модулями.
- `req.scope.resolve("logger")` — логгер.

Типы сервисов (например, `IProductModuleService`) можно смотреть в `@medusajs/types` или в доках [Commerce Modules](https://docs.medusajs.com/resources/commerce-modules/product) и [Container Resources](https://docs.medusajs.com/resources/medusa-container-resources).

---

## Роуты в этом проекте (GET list + GET :id)

| Модуль | Роут | Сервис |
|--------|------|--------|
| Product | `/products`, `/products/:id` | `Modules.PRODUCT` |
| Region | `/regions`, `/regions/:id` | `Modules.REGION` |
| Cart | `/carts`, `/carts/:id` | `Modules.CART` |
| Order | `/orders`, `/orders/:id` | `Modules.ORDER` |
| Customer | `/customers`, `/customers/:id` | `Modules.CUSTOMER` |
| Pricing | `/price-lists`, `/price-lists/:id` | `Modules.PRICING` |
| Sales channel | `/sales-channels`, `/sales-channels/:id` | `Modules.SALES_CHANNEL` |
| Store | `/store` (один магазин) | `Modules.STORE` |
| Inventory | `/inventory-items`, `/inventory-items/:id` | `Modules.INVENTORY` |
| Stock location | `/stock-locations`, `/stock-locations/:id` | `Modules.STOCK_LOCATION` |
| Tax | `/tax-regions`, `/tax-regions/:id` | `Modules.TAX` |
| Currency | `/currencies` | `Modules.CURRENCY` |
| Category (кастом) | `/categories`, `/categories/:id` | `CATEGORY_MODULE` |

---

## Как использовать эти роуты

```ts
import { getApiBase } from '../shared'

// Список товаров
const res = await fetch(`${getApiBase()}/products`)
const { products } = await res.json()

// Один товар
const res2 = await fetch(`${getApiBase()}/products/${id}`)
const { product } = await res2.json()

// Регионы, корзины, заказы и т.д. — так же:
// getApiBase() + '/regions' | '/carts' | '/orders' | '/store' | '/currencies' | ...
```

`getApiBase()` в браузере возвращает `'/api'`, поэтому итоговый URL: `http://localhost:3000/api/products` и т.п.
