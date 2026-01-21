# Инструкция по настройке проекта

## Что уже сделано

✅ Next.js 16 установлен и настроен
✅ TypeScript настроен
✅ Tailwind CSS 4 установлен
✅ Shadcn/ui установлен с базовыми компонентами
✅ Базовая структура проекта создана
✅ Создан первый коммит

## Структура проекта

```
kong/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Главная страница
│   │   ├── products/          # Страница каталога
│   │   └── cart/              # Страница корзины
│   ├── components/
│   │   ├── layout/            # Компоненты лейаута (Header, Footer)
│   │   ├── products/          # Компоненты товаров (пусто)
│   │   └── ui/                # Shadcn/ui компоненты
│   └── lib/
│       ├── medusa/            # Medusa клиент
│       └── utils.ts           # Утилиты
├── public/                     # Статические файлы
└── package.json
```

## Следующие шаги

### 1. Создать репозиторий на GitHub

1. Перейди на https://github.com/new
2. Название: `kong` (или другое)
3. Описание: "E-commerce магазин на Next.js + Medusa"
4. Выбери **Public** или **Private**
5. **НЕ** создавай README, .gitignore (они уже есть)
6. Нажми **Create repository**

### 2. Подключить remote и запушить

```bash
git remote add origin https://github.com/ВАШ_USERNAME/kong.git
git branch -M main
git push -u origin main
```

### 3. Запустить проект локально

```bash
yarn dev
```

Проект будет доступен на http://localhost:3000

### 4. Установить Medusa backend

```bash
npx create-medusa-app@latest
```

Или используй существующий Medusa backend, указав URL в `.env.local`

### 5. Установить дополнительные зависимости для Medusa

```bash
yarn add @medusajs/medusa-js
yarn add -D @medusajs/types
```

## Доступные команды

```bash
yarn dev          # Запуск dev сервера
yarn build        # Сборка для production
yarn start        # Запуск production сервера
yarn lint         # Проверка кода
yarn type-check   # Проверка типов TypeScript
```

## Переменные окружения

Создан файл `.env.local` с базовыми настройками:

- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - URL Medusa backend
- `NEXT_PUBLIC_BASE_URL` - URL фронтенда

## Установленные UI компоненты

- Button
- Card
- Input
- Badge

Для добавления новых компонентов:

```bash
npx shadcn@latest add [component-name]
```

Доступные компоненты: https://ui.shadcn.com/docs/components

