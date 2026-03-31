---
name: product_entity_upgrade
overview: "Расширить модель продукта и админские страницы товаров: использовать встроенные поля Medusa там, где они уже есть, добавить недостающие атрибуты и спроектировать блок документов/тегов без дублирования сущностей."
todos:
  - id: product-model-contract
    content: "Спроектировать и зафиксировать целевой контракт продукта: общие поля, варианты, теги, документы в metadata"
    status: pending
  - id: product-backend-response
    content: Расширить backend list/detail, чтобы фронт получал tags, metadata и дополнительные атрибуты продукта
    status: pending
  - id: product-admin-dto
    content: Обновить admin types/api/queries под новую модель продукта
    status: pending
  - id: product-admin-detail
    content: Показать на деталке теги, характеристики и документы
    status: pending
  - id: product-admin-form
    content: Пересобрать create/edit форму товара по секциям и подготовить основу для вариантов
    status: pending
isProject: false
---

# Улучшение сущности продукта

## Что уже есть и что стоит переиспользовать

Текущая модель продукта уже покрывает часть нужного через Medusa Product Module:

- Уже есть в модели/проекте:
  - `title` — название
  - `subtitle` — краткое описание
  - `description` — описание
  - `thumbnail` и `images[]` — картинки
  - `variants[].sku` — артикул
  - `options[]` и `variants[]` — правильная база для `цвета` и `размера`
  - `tags` — есть в Medusa, но сейчас не подтягиваются в admin API/DTO
  - `material`, `weight`, размеры — есть в продуктовой модели Medusa, но пока не выведены в ваш admin DTO/UI
- Не хватает в текущем проекте:
  - явного контракта для `артикула` в admin DTO и форме
  - полей `вес`, `материал`, размеров в admin DTO/UI
  - блока документов товара
  - редактирования тегов
  - нормального разделения общих полей товара и полей варианта

## Рекомендуемая целевая модель

### Общие поля товара

Хранить на уровне продукта:

- `title`
- `subtitle` — краткое описание
- `description`
- `thumbnail`
- `images[]`
- `material`
- базовые габариты: `weight`, `length`, `width`, `height`
- `tags[]`
- `documents[]` — через `metadata` на первом этапе

### Поля вариантов

Хранить на уровне варианта:

- `sku` — артикул
- `barcode` / `ean` / `upc` — если нужны позже
- `color` и `size` как `options + variant option values`
- при необходимости позже: variant-level `weight`, если доставка зависит от конкретного варианта

### Документы

Для первой итерации не вводить отдельную сущность/таблицу, а хранить в `product.metadata.documents` массив объектов вида:

```ts
{
  id: string
  title: string
  kind: 'instruction' | 'reference' | 'certificate' | 'other'
  sourceType: 'url' | 'file'
  url: string
}
```

Это даст:

- несколько документов на товар
- поддержку ссылки как документа
- минимальные изменения в backend

Если позже понадобится загрузка файлов в хранилище, можно оставить тот же контракт, меняя только источник `url`.

## Что я предлагаю дополнить сверх твоего списка

Для нормальной товарной модели обычно ещё нужны:

- `barcode` / `ean` / `upc` у варианта
- физические размеры: `length`, `width`, `height`
- `country_of_origin` / `hs_code` — если будет логистика/международка
- `categories` и/или `collection` — для каталогизации
- `seoTitle`, `seoDescription` — если будет SEO-страница товара
- `features` / `benefits` — если нужно маркетинговое представление, но это уже лучше отдельным блоком `metadata`, а не обязательным core-полем

Для ближайшего шага я бы включил в scope только:

- название
- артикул
- краткое описание
- описание
- картинки
- материал
- вес
- цвет/размер как варианты
- теги
- документы

А вот `seo`, `brand`, `country_of_origin`, расширенные коды и маркетинговые фичи оставил бы на отдельную итерацию.

## План изменений

1. Расширить backend-контракт продукта в [backend/src/api/products/route.ts](backend/src/api/products/route.ts) и [backend/src/api/products/[id]/route.ts](backend/src/api/products/[id]/route.ts):

- подтянуть `tags` в list/detail
- убедиться, что в ответе стабильно приходят `material`, `weight`, размеры, `metadata`, `variants`, `options`, `images`
- при необходимости нормализовать ответ перед `res.json`, чтобы фронт не зависел от «сырого» DTO

1. Пересобрать admin entity layer в [src/entities/product/admin/types.ts](src/entities/product/admin/types.ts), [src/entities/product/admin/api.ts](src/entities/product/admin/api.ts), [src/entities/product/admin/queries.ts](src/entities/product/admin/queries.ts):

- разделить `product-level` и `variant-level` поля явно
- добавить `tags`, `material`, `weight`, `dimensions`, `metadata.documents`
- уточнить `CreateProductPayload` / `UpdateProductPayload`

1. Перепроектировать форму товара в [src/app/admin/products/ProductFormModal.tsx](src/app/admin/products/ProductFormModal.tsx):

- вынести из одной маленькой формы в структурированные секции
- секция «Основное»: название, артикул, краткое описание, описание, статус
- секция «Характеристики»: материал, вес, размеры
- секция «Теги»
- секция «Документы» со списком документов (title, тип, url)
- секция «Варианты» или подготовка отдельного редактора вариантов

1. Обновить детальную страницу товара:

- [src/app/admin/products/[id]/ProductDetailPageClient.tsx](src/app/admin/products/[id]/ProductDetailPageClient.tsx)
- [src/app/admin/products/[id]/ProductMainInfoCard.tsx](src/app/admin/products/[id]/ProductMainInfoCard.tsx)
- [src/app/admin/products/[id]/ProductMediaCard.tsx](src/app/admin/products/[id]/ProductMediaCard.tsx)
- [src/app/admin/products/[id]/ProductVariantsCard.tsx](src/app/admin/products/[id]/ProductVariantsCard.tsx)
- [src/app/admin/products/[id]/ProductOptionsCard.tsx](src/app/admin/products/[id]/ProductOptionsCard.tsx)

Что показать на деталке:

- основные поля
- теги
- характеристики
- документы
- опции (`цвет`, `размер`)
- варианты с `sku`

1. Обновить список товаров в [src/app/admin/products/ProductsListPageClient.tsx](src/app/admin/products/ProductsListPageClient.tsx):

- оставить компактным
- показать `title`, основной `sku` или число вариантов, `status`, `tags`, `created_at`
- не перегружать список документами/всеми характеристиками

## Итерации

### Итерация 1

- Уточнить backend response + DTO
- Добавить `tags`, `material`, `weight`, `metadata.documents` в типы и отображение на детали
- Без сложного редактора вариантов

### Итерация 2

- Расширить create/edit форму общими полями товара
- Добавить редактирование тегов и документов

### Итерация 3

- Добавить редактор опций и вариантов (`цвет`, `размер`, SKU по вариантам)
- Обновить список товаров под variant-aware отображение

## Риски и решения

- `артикул` может быть не один, а по варианту: в UI не надо вводить пользователя в заблуждение «одним SKU товара». Лучше показывать либо `primarySku`, либо `N вариантов`.
- `цвет` и `размер` нельзя дублировать и как простые поля, и как options: используем только вариантную модель.
- документы лучше сначала хранить в `metadata`, иначе задача резко разрастается до отдельной файловой подсистемы.
- если понадобится загрузка PDF/файлов, расширяем тот же `documents[]`, не ломая фронтовый контракт.

