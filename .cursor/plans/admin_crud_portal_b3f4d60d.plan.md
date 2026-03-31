---
name: Admin CRUD Portal
overview: "Полная переработка админ-панели: кастомные CRUD-порталы для каждой сущности (товары, заказы, покупатели, пользователи, товары на складе) вместо текущих generic-обёрток AdminEntityList/AdminEntityDetail. Удаление раздела \"Склады\", пояснение раздела \"Корзины\"."
todos:
  - id: infra-session
    content: "Тема 0.1: Контекст сессии staff (роль + права) — backend /staff/me + frontend StaffSessionContext"
    status: pending
  - id: infra-remove-stock
    content: "Тема 0.2: Удалить раздел Склады из навигации и страниц"
    status: pending
  - id: infra-shared
    content: "Тема 0.3: Shared-компоненты (DataTable, ConfirmDialog, EntityPageHeader, FormField, StatusBadge)"
    status: pending
  - id: products-entity
    content: "Тема 1.1: Entity layer для Products (types, api, queries)"
    status: pending
  - id: products-backend
    content: "Тема 1.2: Backend — добавить relations (variants, images) в list/retrieve"
    status: pending
  - id: products-pages
    content: "Тема 1.3: Admin pages Products (viewmodel + list + detail + forms)"
    status: pending
  - id: orders-entity
    content: "Тема 2.1: Entity layer для Orders (types, api, queries)"
    status: pending
  - id: orders-backend
    content: "Тема 2.2: Backend — добавить relations (items, customer) в list/retrieve"
    status: pending
  - id: orders-pages
    content: "Тема 2.3: Admin pages Orders (viewmodel + list + detail)"
    status: pending
  - id: customers-entity
    content: "Тема 3.1: Entity layer для Customers (types, api, queries)"
    status: pending
  - id: customers-pages
    content: "Тема 3.3: Admin pages Customers (viewmodel + list + detail + forms)"
    status: pending
  - id: staff-entity
    content: "Тема 4.1: Entity layer для Staff (types, api, queries)"
    status: pending
  - id: staff-pages
    content: "Тема 4.3: Admin pages Staff (viewmodel + list + detail + role-based visibility)"
    status: pending
  - id: inventory-entity
    content: "Тема 5.1: Entity layer для Inventory Items (types, api, queries)"
    status: pending
  - id: inventory-pages
    content: "Тема 5.3: Admin pages Inventory Items (viewmodel + list + detail + forms)"
    status: pending
  - id: carts-entity
    content: "Тема 6: Entity layer + read-mostly pages для Carts"
    status: pending
  - id: cleanup
    content: "Тема 7: Удаление AdminEntityList/AdminEntityDetail, stock-locations, финальная проверка"
    status: pending
isProject: false
---

# Переработка CRUD-порталов админки Kong

## Текущее состояние

Сейчас все разделы кроме **Категорий** используют универсальные компоненты `AdminEntityList` и `AdminEntityDetail`, которые:

- Показывают сырые данные без доменной логики
- Используют `useState`/`useEffect`/`fetch` напрямую, без React Query
- Не имеют viewmodel-слоя (Zustand)
- Не типизированы по сущности
- Имеют примитивный UI (HTML-таблица, JSON-дамп полей)

**Эталон** — раздел Категорий: `entities/category/` (types + api + queries) + `app/admin/categories/` (zustand store + кастомные компоненты).

**Бэкенд** — полный CRUD для всех сущностей уже реализован через Medusa-модули (`Modules.PRODUCT`, `Modules.ORDER` и т.д.), защищён через `requirePermission`. Минимальные доработки описаны в каждой теме.

---

## Тема 0: Инфраструктура и подготовка

### 0.1 Контекст сессии staff (роль + права)

Сейчас `admin/layout.tsx` проверяет валидность токена, но **не сохраняет** роль/права в клиентском состоянии. Нужно:

- **Backend**: доработать `GET /staff/me` — возвращать `{ user, role, permissions[] }` (permissions уже есть в RBAC, нужно собрать через `getStaffPermissions`).
- **Frontend**: создать `StaffSessionContext` (React Context) в [admin/layout.tsx](src/app/admin/layout.tsx), передающий `{ email, role, permissions }` дочерним компонентам.
- Навигация (`AdminNav`) скрывает пункты, на которые у текущей роли нет прав (например, "Пользователи" скрыт для `manager`).

### 0.2 Удалить раздел "Склады"

- Убрать пункт `stock-locations` из [consts.ts](src/app/admin/consts.ts)
- Удалить директории `src/app/admin/stock-locations/` (page + [id]/page)
- Бэкенд-роуты `backend/src/api/stock-locations/` **оставить** (могут использоваться внутренне)

### 0.3 Shared-компоненты для админки

Создать в `shared/ui/` (или `widgets/admin-shared/`):

- **DataTable** — переиспользуемая таблица с сортировкой, пагинацией. Построена на HTML table + Tailwind, в стиле shadcn. Пропсы: `columns`, `data`, `loading`, `onRowClick`, `actions`.
- **ConfirmDialog** — обёртка над `AlertDialog` для подтверждения удаления.
- **EntityPageHeader** — заголовок страницы с кнопками "Назад", "Создать", breadcrumbs.
- **FormField** — обёртка Label + Input + ошибка валидации.
- **StatusBadge** — `Badge` с цветом по статусу (`active`, `draft`, `archived` и т.д.).

---

## Тема 1: Товары (Products)

**Право**: `catalog:manage` (owner / admin / manager)

### 1.1 Entity layer — `entities/product/`

Файлы рядом с существующими (store-facing) или в подпапке `admin/`:

- `admin-types.ts` — типы: `AdminProduct`, `AdminProductVariant`, `CreateProductPayload`, `UpdateProductPayload`
- `admin-api.ts` — функции API (`listProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`) через `/api/products`
- `admin-queries.ts` — React Query хуки: `useProductsQuery`, `useProductQuery(id)`, `useCreateProductMutation`, `useUpdateProductMutation`, `useDeleteProductMutation`
- Экспорт через `index.ts`

### 1.2 Backend — дополнения

Текущие роуты в [backend/src/api/products/](backend/src/api/products/route.ts) достаточны. Нужно:

- **GET list**: добавить `relations: ['variants', 'images']` и `select` нужных полей в `listProducts`, чтобы в таблице были цена и thumbnail.
- **GET by id**: аналогично — добавить variants, options, images в retrieve.

### 1.3 Admin pages — `app/admin/products/`

**Список** (`page.tsx`):

- DataTable: название, handle, статус (StatusBadge), thumbnail (маленькая картинка), created_at
- Кнопка "Создать товар" -> модалка/форма
- Действия в строке: "Открыть", "Удалить" (ConfirmDialog)

**Детальная** (`[id]/page.tsx`):

- Шапка с названием, статусом, кнопками "Редактировать" / "Удалить"
- Карточки-секции: основная информация, варианты, медиа
- Форма редактирования в модалке или inline

**Viewmodel** (`viewmodel/viewmodel.ts`):

- Zustand store: `editingId`, `isCreateOpen`, `deleteConfirmId`, `filter`
- Хук `useProductsVm()` — собирает данные из React Query + viewmodel state, отдаёт ready-to-render пропсы

---

## Тема 2: Заказы (Orders)

**Право**: `orders:manage` (owner / admin / manager)

### 2.1 Entity layer — `entities/order/`

- `types.ts` — `AdminOrder`, `OrderItem`, `OrderStatus`
- `api.ts` — `listOrders`, `getOrder`, `updateOrderStatus`, `deleteOrder`
- `queries.ts` — React Query хуки

### 2.2 Backend — дополнения

- **GET list**: добавить relations (`items`, `customer`) и select, чтобы в таблице был покупатель и сумма.
- **GET by id**: relations с items, shipping, payments.
- Заказы — read-heavy: создание через API не нужно (заказы создаются из корзин). На фронте **нет кнопки "Создать заказ"**.

### 2.3 Admin pages — `app/admin/orders/`

**Список**:

- DataTable: номер (`display_id`), статус (StatusBadge), email покупателя, сумма, дата
- Фильтр по статусу (select)

**Детальная**:

- Шапка: номер, статус, дата
- Секции: товары в заказе (таблица items), информация о покупателе, доставка, оплата
- Действие: изменение статуса (select + кнопка "Сохранить")

**Viewmodel**: Zustand store для фильтров, выбранного статуса при редактировании.

---

## Тема 3: Покупатели (Customers)

**Право**: `customers:manage` (owner / admin / manager)

### 3.1 Entity layer — `entities/customer/`

- `types.ts` — `AdminCustomer`, `CreateCustomerPayload`, `UpdateCustomerPayload`
- `api.ts`, `queries.ts` — стандартный CRUD

### 3.2 Backend — без изменений

Роуты в [backend/src/api/customers/](backend/src/api/customers/route.ts) — полный CRUD, достаточно.

### 3.3 Admin pages — `app/admin/customers/`

**Список**:

- DataTable: email, имя, фамилия, дата регистрации
- Кнопка "Создать покупателя"

**Детальная**:

- Информация о покупателе
- Форма редактирования (email, first_name, last_name)
- Удаление с подтверждением

---

## Тема 4: Пользователи / Staff

**Право**: `staff:manage` (только owner / admin). Пункт навигации **скрыт** для `manager`.

### 4.1 Entity layer — `entities/staff/`

- `types.ts` — `StaffUser`, `StaffRole`, `CreateStaffPayload`
- `api.ts`, `queries.ts` — list, get, create, delete (update роли — отдельно, если понадобится)

### 4.2 Backend — без изменений

Роуты в [backend/src/api/staff/users/](backend/src/api/staff/users/route.ts) — create с ролью, list с ролями, get, delete. Защита от удаления owner. Достаточно.

### 4.3 Admin pages — `app/admin/staff/`

**Список**:

- DataTable: email, роль (Badge с цветом по роли: owner=красный, admin=синий, manager=зелёный)
- Кнопка "Добавить пользователя"

**Создание** (форма/модалка):

- Email, пароль, выбор роли (Select: admin, manager)
- Owner нельзя создать через UI

**Детальная**:

- Email, роль, дата создания
- Кнопка "Удалить" (с защитой: нельзя удалить owner; показываем disabled + tooltip)

---

## Тема 5: Товары на складе (Inventory Items)

**Право**: `inventory:manage` (owner / admin / manager)

### 5.1 Entity layer — `entities/inventory-item/`

- `types.ts` — `AdminInventoryItem`, `CreateInventoryItemPayload`, `UpdateInventoryItemPayload`
- `api.ts`, `queries.ts`

### 5.2 Backend — без изменений

Роуты в [backend/src/api/inventory-items/](backend/src/api/inventory-items/route.ts) — полный CRUD.

### 5.3 Admin pages — `app/admin/inventory-items/`

**Список**:

- DataTable: SKU, название, дата создания
- Кнопка "Добавить товар на склад"

**Детальная**:

- SKU, название, полная информация
- Форма редактирования SKU / title
- Удаление с подтверждением

---

## Тема 6: Корзины (Carts) — назначение и реализация

### 6.1 Зачем раздел "Корзины" в админке

Раздел "Корзины" в админ-панели нужен для:

1. **Мониторинг активных сессий** — видеть, что покупатели сейчас набирают в корзины. Полезно для анализа спроса в реальном времени.
2. **Брошенные корзины** — выявлять корзины, которые не конвертировались в заказы. Это один из ключевых инструментов для увеличения конверсии (можно отправить напоминание, предложить скидку).
3. **Поддержка клиентов** — менеджер может посмотреть корзину конкретного покупателя, помочь разобраться с проблемой (неправильная цена, отсутствующий товар).
4. **Отладка** — если заказ не оформляется, можно посмотреть состояние корзины (region_id, items, totals) и найти причину.
5. **Ручное создание** — в отдельных случаях менеджер может создать корзину от имени клиента (заказ по телефону).

### 6.2 Реализация — минимальная (read-mostly)

**Право**: `carts:manage`

- Entity layer: `entities/cart/` с типами, api, queries
- Список корзин: DataTable с id (сокращённый), статус, email покупателя (если привязан), кол-во товаров, дата создания
- Детальная: товары в корзине, регион, суммы, привязанный покупатель
- **Создание и редактирование** — пока не реализуем (через UI это сложно и редко нужно). Кнопка "Удалить" для старых корзин — оставляем.

---

## Тема 7: Очистка и финализация

- Удалить `AdminEntityList.tsx` и `AdminEntityDetail.tsx` из `app/admin/` (все сущности переписаны)
- Удалить страницы `stock-locations/`
- Проверить lint + typecheck: `yarn lint && yarn typecheck`
- Проверить все разделы в браузере

---

## Матрица прав по ролям


| Раздел           | Право            | owner | admin | manager |
| ---------------- | ---------------- | ----- | ----- | ------- |
| Категории        | catalog:manage   | да    | да    | да      |
| Товары           | catalog:manage   | да    | да    | да      |
| Заказы           | orders:manage    | да    | да    | да      |
| Покупатели       | customers:manage | да    | да    | да      |
| Товары на складе | inventory:manage | да    | да    | да      |
| Корзины          | carts:manage     | да    | да    | да      |
| Магазин          | store:update     | да    | да    | да      |
| Пользователи     | staff:manage     | да    | да    | нет     |


---

## Порядок реализации (итерации)

Каждая итерация — законченный шаг, проверяемый и коммитируемый:

1. **Инфраструктура** (тема 0): контекст сессии, shared-компоненты, удаление складов
2. **Товары** (тема 1): entity + viewmodel + pages
3. **Заказы** (тема 2): entity + viewmodel + pages
4. **Покупатели** (тема 3): entity + viewmodel + pages
5. **Staff** (тема 4): entity + viewmodel + pages + скрытие по роли
6. **Товары на складе** (тема 5): entity + viewmodel + pages
7. **Корзины** (тема 6): entity + pages (read-mostly)
8. **Очистка** (тема 7): удаление старых компонентов, финальная проверка

Внутри каждой итерации по сущности:

- Сначала entity layer (types + api + queries)
- Потом backend-доработки (если есть)
- Потом viewmodel
- Потом UI (список -> детальная -> формы)

