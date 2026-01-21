# Быстрый старт

## Стек

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Shadcn/ui
- Medusa 2.x

## Запуск

### Frontend

```bash
yarn install
yarn dev
```

→ http://localhost:3000

### Backend

```bash
cd backend
docker-compose up
```

→ API: http://localhost:9000  
→ Admin: http://localhost:7001

## Команды

```bash
yarn dev           # Запуск dev
yarn build         # Сборка
yarn lint          # Линтер
```

## Добавление UI компонентов

```bash
npx shadcn@latest add [component-name]
```

## Деплой

См. `DEPLOYMENT.md`

