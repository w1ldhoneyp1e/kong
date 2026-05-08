# Деплой

## Frontend

Размести Next.js приложение на Vercel или любом Node-hosting.

Обязательные env:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Backend

Размести Nest API из директории `api/`.

Минимальные env:

```env
PORT=9001
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com
DATABASE_URL=postgresql://user:password@host:5432/kong
JWT_SECRET=change-me
STAFF_JWT_SECRET=change-me-too
```

## Reverse proxy

Пример `nginx` для backend:

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:9001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Обновление

```bash
git pull
pnpm install
pnpm build
pnpm api:build
```
