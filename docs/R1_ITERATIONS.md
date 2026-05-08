# R1 Iterations

Этот документ превращает `R1_BACKLOG.md` в рабочие итерации. Главная идея: не строить заново уже готовую админскую основу, а довести существующие модули до релизного покупательского пути.

R1 path:

```text
catalog -> product detail -> cart -> manual checkout -> admin order workflow
```

Перед коммитом каждой итерации изменения отдаются на проверку.

## Iteration 0. Baseline audit and release gates

Цель: зафиксировать текущее состояние, стопперы и правила приемки до начала больших правок.

Что уже есть:

- `docs/R1_BACKLOG.md` с R1 scope.
- Публичные страницы магазина в `src/app/(store)`.
- Back office в `src/app/admin`.
- Medusa backend и кастомные staff/RBAC-модули.

Задачи:

- Составить список ручных R1 smoke checks.
- Зафиксировать mobile acceptance checklist как release gate.
- Проверить, какие страницы footer ведут на отсутствующие routes.
- Проверить backend order detail route exports.
- Зафиксировать существующие dirty changes перед началом кодовых итераций.

Acceptance criteria:

- Есть список R1 smoke checks.
- Есть mobile checklist для клиентского пути.
- Известны явные технические стопперы.
- Нет смешения документационных изменений и кодовых правок в одном непроверенном коммите.

Ориентировочные зоны кода:

- `docs/R1_BACKLOG.md`
- `scripts/storefront-smoke.mjs`
- `src/app/(store)`
- `src/widgets/footer/Footer.tsx`
- `backend/src/api/orders/[id]/route.ts`

## Iteration 1. Product variant, price and availability foundation

Цель: довести существующий CRUD товара до продажной модели, где товар продается через variant с ценой и доступностью.

Что уже есть:

- Админский список товаров: `src/app/admin/products/ProductsListPageClient.tsx`.
- Создание/редактирование товара: `src/features/admin-product-form`.
- Детальная карточка товара в админке: `src/app/admin/products/[id]`.
- Backend routes для products: `backend/src/api/products`.
- Product types уже содержат `variants`, `prices`, `sku`.

Пробел:

- Product form сейчас сохраняет title, handle, status, category, specs, tags, media, documents.
- Управление variants, SKU, price и availability не выглядит полноценным для R1.Также нужно посмотреть

Задачи:

- Уточнить минимальную модель простого товара: один default variant, SKU, price, availability.
- Добавить в product form секцию продажи: SKU, цена, валюта, количество/наличие, default variant title.
- Для простого товара создавать или обновлять minimum viable variant.
- В detail page показывать цену, SKU и доступность variant понятным образом.
- На backend проверить, какие поля Medusa принимает в `createProducts` и `updateProducts` для variants/prices.
- Не ломать существующие sections: main, specs, tags, media, documents.

Acceptance criteria:

- Контент-менеджер может создать товар с ценой и доступным variant.
- Контент-менеджер может отредактировать SKU, цену и доступность.
- Товар без доступного variant не считается продаваемым.
- Существующие товары без variants отображаются в админке без падений.

Ориентировочные зоны кода:

- `src/features/admin-product-form`
- `src/entities/product/admin/types.ts`
- `src/entities/product/admin/api.ts`
- `src/app/admin/products/[id]/VariantsCard.tsx`
- `backend/src/api/products/route.ts`
- `backend/src/api/products/[id]/route.ts`

Риски:

- В Medusa v2 price/variant/inventory могут требовать workflow/API, а не прямой `productService.createProducts` payload.
- Inventory может быть отдельной итерацией, если базовое наличие нельзя надежно вести в product payload.

## Iteration 2. Product detail and storefront catalog readiness

Цель: покупатель видит релизную карточку товара, выбирает variant и добавляет именно его в корзину.

Что уже есть:

- Catalog list and category pages.
- `src/app/(store)/product/[handle]/page.tsx`.
- `AddToCartButton`, который принимает `variantId`.
- `ProductCard` и mapping из Medusa product.

Пробел:

- Карточка товара использует первый variant.
- Цена отсутствующего variant отображается как "Цена по запросу", что не подходит R1.
- Нет UI выбора variant.
- Листинг не различает доступность.

Задачи:

- Добавить storefront view model для product variants: title, price, availability, sku.
- На карточке товара показывать выбор variant, цену выбранного variant и состояние доступности.
- Отключать add to cart для недоступного/невыбранного variant.
- На листинге показывать цену от минимального доступного variant или понятное состояние "нет в наличии".
- Убрать "Цена по запросу" из R1-пути.
- Проверить SEO metadata карточки товара.
- Проверить category and search empty states.

Acceptance criteria:

- Покупатель может выбрать variant на карточке товара.
- В корзину уходит выбранный `variantId`.
- Товар без доступных variants нельзя добавить в корзину.
- Листинг и карточка корректно выглядят на mobile/tablet/desktop.

Ориентировочные зоны кода:

- `src/app/(store)/product/[handle]/page.tsx`
- `src/entities/product/api.ts`
- `src/entities/product/mapMedusaToCard.ts`
- `src/entities/product/ProductCard.tsx`
- `src/features/cart/ui/AddToCartButton.tsx`
- `src/app/(store)/catalog/[category]/page.tsx`
- `src/app/(store)/search/page.tsx`

Риски:

- Store API response может не отдавать нужные price/inventory fields без дополнительных query params или publishable key.

## Iteration 3. Cart as production workflow

Цель: корзина становится полноценной частью продукта, а не промежуточной заглушкой.

Что уже есть:

- Создание cart в `AddToCartButton`.
- Добавление line item через `/api/carts/[id]`.
- Страница `src/app/(store)/cart/page.tsx`.
- Proxy routes для add/update/remove line item.

Пробел:

- Нет изменения количества.
- Нет удаления позиции.
- Нет счетчика в header.
- Checkout link доступен даже при пустой корзине.
- UI не показывает variant details достаточно полно.

Задачи:

- Вынести cart loading/update helpers или hook, чтобы не дублировать логику в cart/checkout/header.
- Показывать line item title, variant title, unit price, quantity, line total.
- Добавить quantity controls.
- Добавить remove line item.
- Запретить checkout из пустой корзины.
- Добавить cart count в header.
- Обработать stale/invalid cart id в localStorage.

Acceptance criteria:

- Покупатель может изменить количество товара.
- Покупатель может удалить товар.
- Итоги пересчитываются после изменения.
- Header показывает актуальное количество товаров.
- Empty cart не ведет в checkout.
- Mobile cart не имеет горизонтального scroll и наложений.

Ориентировочные зоны кода:

- `src/app/(store)/cart/page.tsx`
- `src/features/cart`
- `src/app/api/carts/route.ts`
- `src/app/api/carts/[id]/route.ts`
- `src/widgets/header/ui/HeaderTopActions.tsx`

Риски:

- Нужно аккуратно синхронизировать localStorage cart id между кнопкой, корзиной, checkout и header.

## Iteration 4. Manual checkout without online payment

Цель: оформить заказ через checkout без онлайн-оплаты, сохранив данные покупателя и доставки.

Что уже есть:

- Checkout page with fields.
- `/api/carts/[id]/complete`.
- Customer auth and account profile.

Пробел:

- Поля checkout визуальные и не сохраняются в cart.
- Нет валидации.
- Нет comment.
- Нет полноценного success state/page.
- Нужно проверить manual checkout совместимость с Medusa complete.

Задачи:

- Сделать controlled form для email, name, phone, city/address, comment.
- Валидировать обязательные поля до complete.
- Перед complete обновлять cart customer/shipping data.
- Поддержать ручной способ доставки/обработки.
- После complete показать "заказ принят" с номером/summary, если API его возвращает.
- Очистить cart id после success.
- Показать ошибки complete на UI.
- Учесть гостевой checkout и авторизованного покупателя.

Acceptance criteria:

- Гость может оформить заказ без онлайн-оплаты.
- Авторизованный покупатель может оформить заказ.
- Заказ содержит контакты, адрес и comment.
- После success нельзя повторно отправить тот же cart.
- Checkout mobile-friendly.

Ориентировочные зоны кода:

- `src/app/(store)/checkout/page.tsx`
- `src/app/api/carts/[id]/route.ts`
- `src/app/api/carts/[id]/complete/route.ts`
- `src/app/(store)/account/profile/page.tsx`

Риски:

- Medusa cart complete может требовать region/shipping/payment collection даже для manual mode. Если так, нужно добавить минимальную backend/workflow прослойку.

## Iteration 5. Admin order workflow

Цель: менеджер вручную обрабатывает заказ после checkout.

Что уже есть:

- Orders list and detail pages.
- Orders list filters.
- Order status select.
- Backend order list/detail/update/delete routes.

Пробел:

- Нужно проверить export handlers в `backend/src/api/orders/[id]/route.ts`.
- Удаление заказа может быть опасным действием для R1.
- Текущие статусы могут быть недостаточны для ручного workflow.
- Нужно убедиться, что order detail показывает checkout contact/shipping/comment.

Задачи:

- Исправить route exports, если handlers не экспортируются.
- Проверить order list/detail после реального checkout.
- Добавить или согласовать ручные статусы: new, processing, confirmed, completed, cancelled.
- Если Medusa status нельзя безопасно использовать, хранить internal processing status отдельно.
- Показать контакты, адрес, comment, items, variants, prices, totals.
- Заменить опасное удаление на отмену или ограничить permission.
- Проверить связь customer -> orders.

Acceptance criteria:

- Новый заказ появляется в админке после checkout.
- Менеджер видит все данные для ручной обработки.
- Менеджер меняет статус обработки.
- Заказ можно найти по номеру/email/status.
- Удаление заказа не доступно случайно.

Ориентировочные зоны кода:

- `src/app/admin/orders`
- `src/entities/order/admin`
- `backend/src/api/orders/route.ts`
- `backend/src/api/orders/[id]/route.ts`
- `src/app/admin/customers/[id]/CustomerDetailPageClient.tsx`

Риски:

- Может понадобиться отдельное поле/status module для ручной обработки, если системные Medusa status не подходят.

## Iteration 6. Content manager permissions

Цель: сделать контент-менеджмент через permissions на уже существующей staff/RBAC базе.

Что уже есть:

- Staff CRUD.
- Role assignment.
- RBAC tables and permissions.
- Admin navigation checks permissions.
- Backend `requirePermission`.

Пробел:

- Нет отдельного `catalog:publish`.
- Нет явного `content_manager` role preset.
- UI actions не всегда разделены по permissions.
- Есть debug `console.log` в staff list.

Задачи:

- Добавить permissions миграцией: `catalog:publish`, `media:manage`, `settings:manage`.
- Добавить role preset `content_manager`.
- Настроить role permissions для owner/admin/content_manager/order_manager.
- Разделить edit и publish actions в product/category UI.
- Проверять permission не только на page access, но и на destructive/publish actions.
- Убрать debug logging.

Acceptance criteria:

- Content manager может вести каталог, но не управляет staff/settings.
- Publish можно дать отдельно от catalog edit.
- Backend отклоняет запрещенные действия даже если UI обойти.
- Staff UI не содержит debug logs.

Ориентировочные зоны кода:

- `backend/src/modules/rbac/migrations`
- `backend/src/api/_shared/staffAuth.ts`
- `backend/src/api/_shared/staffPermissions.ts`
- `src/app/admin/consts.ts`
- `src/app/admin/staff`
- `src/app/admin/products`
- `src/app/admin/categories`

Риски:

- Нужна аккуратная миграция, чтобы не сломать существующих owner/admin/manager.

## Iteration 7. Commerce settings

Цель: заложить переключатель режима продаж, чтобы позже включить online payment без переписывания покупательского пути.

Что уже есть:

- Store API route.
- Admin layout/navigation.
- RBAC permissions for store/update-like actions.

Пробел:

- Нет отдельного settings UI/API.
- Нет единого источника truth для `commerce_mode`.

Задачи:

- Выбрать хранение: store metadata, отдельная settings table/module или Medusa module.
- Добавить backend read/update API.
- Добавить admin UI для commerce settings.
- На storefront читать settings и управлять checkout/payment behavior.
- Для R1 установить `manual_checkout`.

Acceptance criteria:

- Admin с нужным permission видит и меняет commerce mode.
- Storefront не содержит hardcoded future payment behavior.
- Online payment выключена в R1.
- Checkout продолжает работать в `manual_checkout`.

Ориентировочные зоны кода:

- `backend/src/api/store/route.ts`
- `src/app/api/store/route.ts`
- `src/app/admin`
- `src/shared/lib/url.ts`
- new settings module/routes if needed.

Риски:

- Если выбрать store metadata, нужно проверить права и стабильность обновления через текущие сервисы Medusa.

## Iteration 8. Public content and trust pages

Цель: убрать ощущение технической заготовки на публичном сайте.

Что уже есть:

- About and contacts pages.
- Footer with delivery/payment/returns/FAQ/support/size-guide links.
- Bento banner with promo links.

Пробел:

- Часть footer links может вести на отсутствующие routes.
- `/products` выглядит моковой страницей.
- Promo links могут вести в несуществующие категории.

Задачи:

- Довести about/contacts.
- Добавить delivery/payment/returns pages или убрать ссылки до готовности.
- Добавить policy/offer page, если юридически требуется для публичного checkout.
- Убрать или заменить `/products`.
- Настроить promo links только на существующие категории/pages.
- Проверить 404 and empty states.
- Добавить в админке возможность редактировать их

Acceptance criteria:

- Нет публичных ссылок на неготовые страницы.
- Контентные страницы выглядят релизно на mobile/desktop.
- Покупатель понимает условия ручной оплаты и доставки.
- Страницы редактируемы администратором

Ориентировочные зоны кода:

- `src/app/(store)/about/page.tsx`
- `src/app/(store)/contacts/page.tsx`
- `src/app/(store)/products/page.tsx`
- `src/widgets/footer/Footer.tsx`
- `src/shared/ui/bento-banner.tsx`

## Iteration 9. Mobile pass and release readiness

Цель: провести финальную приемку клиентского пути и исправить адаптивные проблемы.

Что уже есть:

- Mobile requirement в `R1_BACKLOG.md`.
- Responsive Tailwind layout частично используется.

Пробел:

- Не проверен весь mobile path.
- Header/nav/catalog/cart/checkout могут требовать отдельной мобильной переработки.

Задачи:

- Проверить viewport classes for mobile/tablet/desktop.
- Пройти path: home -> category -> product -> cart -> checkout -> success.
- Проверить auth/profile pages.
- Проверить header account/cart actions.
- Проверить таблицы и админские critical screens на overflow, если они используются с планшета.
- Обновить ручной smoke checklist.
- Подготовить seed/test data для проверки.
- Обновить deployment docs после migrations/settings.

Acceptance criteria:

- Все клиентские R1 экраны работают на mobile.
- Нет горизонтального scroll в публичном пути.
- Кнопки и controls touch-friendly.
- Checkout можно пройти с телефона.
- Ручной smoke checklist пройден.

Ориентировочные зоны кода:

- `src/app/(store)`
- `src/widgets/header`
- `src/widgets/footer`
- `src/entities/product`
- `src/features/cart`
- `scripts/storefront-smoke.mjs`
- `docs/DEPLOYMENT.md`

## Recommended implementation order

1. Iteration 0: baseline audit and release gates.
2. Iteration 1: product variant, price and availability foundation.
3. Iteration 2: product detail and storefront catalog readiness.
4. Iteration 3: cart as production workflow.
5. Iteration 4: manual checkout without online payment.
6. Iteration 5: admin order workflow.
7. Iteration 6: content manager permissions.
8. Iteration 7: commerce settings.
9. Iteration 8: public content and trust pages.
10. Iteration 9: mobile pass and release readiness.
