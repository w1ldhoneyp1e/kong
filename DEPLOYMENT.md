# Деплой

## Архитектура

```
Frontend (Next.js) → Vercel (бесплатно)
Backend (Medusa)   → Railway ($5/мес) или VPS (€4.5/мес)
```

---

## Вариант 1: Vercel + Railway

### Frontend → Vercel

1. https://vercel.com → подключи GitHub репозиторий
2. Deploy автоматически
3. Добавь env:
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.railway.app
```

### Backend → Railway

1. https://railway.app → Deploy from GitHub
2. Root Directory: `backend`
3. Добавь env:
```
JWT_SECRET=случайная_строка
COOKIE_SECRET=случайная_строка
STORE_CORS=https://your-project.vercel.app
```

---

## Вариант 2: Vercel + VPS

### 1. Подготовка VPS

```bash
ssh root@YOUR_IP

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose -y
```

### 2. Деплой Backend

```bash
git clone https://github.com/YOUR_USERNAME/kong.git
cd kong/backend

# Создай .env
nano .env
```

```env
DATABASE_URL=postgres://postgres:ПАРОЛЬ@postgres:5432/medusa
JWT_SECRET=длинная_случайная_строка
COOKIE_SECRET=другая_длинная_строка
STORE_CORS=https://your-project.vercel.app
NODE_ENV=production
```

```bash
docker-compose up -d
```

### 3. Nginx

```bash
apt install nginx -y
nano /etc/nginx/sites-available/kong
```

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/kong /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 4. SSL

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.your-domain.com
```

---

## Настройка домена

### Frontend (Vercel)

Vercel Settings → Domains → Добавь `your-domain.com`

### Backend (VPS)

У регистратора:
```
A    api    →  YOUR_VPS_IP
```

---

## Обновление

### Frontend
```bash
git push origin main  # Vercel задеплоит автоматически
```

### Backend
```bash
ssh root@YOUR_IP
cd kong/backend
git pull
docker-compose up -d --build
```

---

## Backup

```bash
# Создание
docker exec kong-postgres pg_dump -U postgres medusa > backup.sql

# Восстановление
docker exec -i kong-postgres psql -U postgres medusa < backup.sql
```

---

## Безопасность

```bash
# Firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Fail2ban
apt install fail2ban -y
```
