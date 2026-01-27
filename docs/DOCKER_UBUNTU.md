# Запуск бэкенда через Docker на Ubuntu

Схема как в [официальной инструкции Medusa](https://docs.medusajs.com/learn/installation/docker): один `Dockerfile`, скрипт `start.sh` (миграции и запуск), `docker-compose.yml`.

## 1. Установка Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Проверка:

```bash
docker --version
docker compose version
```

## 2. Добавить пользователя в группу docker (чтобы не писать sudo)

```bash
sudo usermod -aG docker $USER
```

Затем выйти из сессии и зайти снова (или выполнить `newgrp docker`). Пока не сделали — при `permission denied` запускайте через `sudo docker compose ...`.

## 3. Перейти в папку бэкенда

```bash
cd /путь/к/проекту/kong/backend
```

## 4. Создать .env (опционально)

Если нужны свои переменные — скопировать пример и при необходимости отредактировать:

```bash
cp .env.example .env
```

Для локальной разработки достаточно значений по умолчанию из `docker-compose.yml`.

## 5. Запустить контейнеры

```bash
docker compose up -d --build
```

Поднимутся Postgres (5432), Redis (6379), Medusa (9000 — API, 7001 — админка). Сборка проекта выполняется при `docker compose build`; контейнер при старте только запускает готовое приложение (~30 с), а не `medusa develop` (10–17 мин). Чтобы применить изменения в коде бэкенда — пересобери образ: `docker compose up -d --build`.

## 6. Проверка

- API: http://localhost:9000
- Админка Medusa: http://localhost:7001
- Логи: `docker compose logs -f medusa`

## Остановка

```bash
docker compose down
```

Данные БД хранятся в томах и не удалятся. Чтобы удалить и тома:

```bash
docker compose down -v
```
