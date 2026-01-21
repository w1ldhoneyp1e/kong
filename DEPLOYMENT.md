# Руководство по деплою Kong Store

## Архитектура production

```
Пользователь
    ↓
Frontend (Next.js) ← Vercel
    ↓
Backend (Medusa) ← VPS (Docker)
    ↓
PostgreSQL ← Тот же VPS
    ↓
Файлы ← Cloudflare R2 / локально
```

---

## Вариант 1: Vercel + Railway (Быстрый старт)

### Преимущества
- ✅ Настройка за 30 минут
- ✅ Автодеплой из GitHub
- ✅ Managed база данных
- ✅ Не нужно настраивать сервер

### Стоимость
- Frontend (Vercel): Бесплатно
- Backend (Railway): $5-10/мес

### Шаги

#### 1. Frontend на Vercel

1. Зарегистрируйся на https://vercel.com
2. Подключи GitHub репозиторий `kong`
3. Vercel автоматически определит Next.js
4. Deploy!
5. Получишь URL: `your-project.vercel.app`

**Настройка переменных окружения:**
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
```

#### 2. Backend на Railway

1. Зарегистрируйся на https://railway.app
2. New Project → Deploy from GitHub
3. Выбери репозиторий `kong`
4. Root Directory: `backend`
5. Railway создаст PostgreSQL автоматически

**Настройка:**
- Добавь переменные окружения (DATABASE_URL создастся автоматически):
```
JWT_SECRET=случайная_строка
COOKIE_SECRET=случайная_строка
STORE_CORS=https://your-project.vercel.app
ADMIN_CORS=https://your-project.vercel.app
PORT=9000
```

6. Deploy!
7. Получишь URL: `your-backend.railway.app`

---

## Вариант 2: Vercel + VPS (Рекомендуется)

### Преимущества
- ✅ Frontend быстрый (Vercel CDN)
- ✅ Backend под контролем
- ✅ Дешевле на масштабе
- ✅ Полная кастомизация

### Стоимость
- Frontend (Vercel): Бесплатно
- VPS (Hetzner): €4.5/мес (~500₽)
- Домен: ~300₽/год

### Требования
- VPS с Ubuntu 22.04
- Docker установлен
- Домен (опционально)

### Шаги

#### 1. Подготовка VPS

**Купи VPS:**
- Hetzner: https://www.hetzner.com/cloud
- DigitalOcean: https://www.digitalocean.com
- Любой другой с Ubuntu

**Подключись по SSH:**
```bash
ssh root@YOUR_SERVER_IP
```

**Установи Docker:**
```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
apt install docker-compose -y

# Проверка
docker --version
docker-compose --version
```

#### 2. Деплой Backend на VPS

**На сервере:**

```bash
# Клонируй репозиторий
git clone https://github.com/YOUR_USERNAME/kong.git
cd kong/backend

# Создай .env
nano .env
```

**Содержимое .env:**
```env
DATABASE_URL=postgres://postgres:СЛОЖНЫЙ_ПАРОЛЬ@postgres:5432/medusa
REDIS_URL=redis://redis:6379

JWT_SECRET=сгенерируй_длинную_случайную_строку_64_символа
COOKIE_SECRET=сгенерируй_другую_длинную_случайную_строку

PORT=9000
STORE_CORS=https://your-project.vercel.app
ADMIN_CORS=https://your-project.vercel.app
NODE_ENV=production
```

**Запуск:**
```bash
# Собери и запусти
docker-compose -f docker-compose.yml up -d --build

# Проверь логи
docker-compose logs -f
```

**Проверка:**
```bash
curl http://localhost:9000
```

#### 3. Настройка Nginx (Reverse Proxy)

```bash
# Установка Nginx
apt install nginx -y

# Создай конфиг
nano /etc/nginx/sites-available/kong-backend
```

**Конфиг Nginx:**
```nginx
server {
    listen 80;
    server_name api.your-domain.com;  # Замени на свой домен

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Активируй:**
```bash
ln -s /etc/nginx/sites-available/kong-backend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 4. SSL сертификат (Let's Encrypt)

```bash
# Установка Certbot
apt install certbot python3-certbot-nginx -y

# Получение сертификата
certbot --nginx -d api.your-domain.com

# Автообновление (проверка)
certbot renew --dry-run
```

#### 5. Frontend на Vercel

1. В Vercel измени переменную окружения:
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.your-domain.com
```

2. Redeploy

---

## Настройка домена

### Для Frontend (Vercel)

В Vercel:
1. Settings → Domains
2. Добавь `your-domain.com`
3. Следуй инструкциям по настройке DNS

### Для Backend (VPS)

У регистратора домена:
```
A    api    →  YOUR_SERVER_IP
```

---

## Обновление кода

### Frontend (Vercel)
```bash
git push origin main
```
Vercel автоматически задеплоит.

### Backend (VPS)
```bash
ssh root@YOUR_SERVER_IP
cd kong/backend
git pull
docker-compose up -d --build
```

---

## Мониторинг и backup

### Логи

```bash
# Backend логи
docker-compose logs -f medusa

# Nginx логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Backup базы данных

```bash
# Создание backup
docker exec kong-postgres pg_dump -U postgres medusa > backup_$(date +%Y%m%d).sql

# Восстановление
docker exec -i kong-postgres psql -U postgres medusa < backup_20260121.sql
```

### Автоматический backup (cron)

```bash
crontab -e
```

Добавь:
```cron
0 2 * * * docker exec kong-postgres pg_dump -U postgres medusa > /root/backups/backup_$(date +\%Y\%m\%d).sql
```

---

## Безопасность

### Firewall

```bash
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw enable
```

### Fail2ban (защита от брутфорса)

```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

### Обновления

```bash
apt update && apt upgrade -y
```

Настрой автообновления:
```bash
apt install unattended-upgrades -y
dpkg-reconfigure --priority=low unattended-upgrades
```

---

## Проблемы?

### Медуза не стартует
```bash
docker-compose logs medusa
```

### База не подключается
```bash
docker-compose logs postgres
docker exec -it kong-postgres psql -U postgres
```

### Nginx ошибки
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

---

## Следующие шаги после деплоя

1. ✅ Настрой мониторинг (UptimeRobot)
2. ✅ Настрой автобэкапы
3. ✅ Добавь Cloudflare перед сайтом (опционально)
4. ✅ Настрой платёжную систему
5. ✅ Добавь аналитику (Google Analytics / Plausible)

