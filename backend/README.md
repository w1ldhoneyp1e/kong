# Kong Backend (Medusa)

## Запуск

### С Docker

```bash
docker-compose up
```

### Без Docker

См. `INSTALL.md`

## Доступ

- API: http://localhost:9000
- Admin: http://localhost:7001

## Команды

```bash
yarn dev      # Разработка
yarn build    # Сборка
yarn start    # Production
yarn seed     # Тестовые данные
```

## Production

```bash
docker build -t kong-backend .
docker run -p 9000:9000 -e DATABASE_URL=... kong-backend
```

