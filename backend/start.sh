#!/bin/sh
echo "Waiting for Postgres..."
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15; do
  if node -e "
    const net=require('net');
    const s=net.createConnection(5432,'postgres',()=>{s.destroy();process.exit(0);});
    s.on('error',()=>process.exit(1));
    s.setTimeout(3000,()=>{s.destroy();process.exit(1);});
  " 2>/dev/null; then
    echo "Postgres is up."
    break
  fi
  if [ "$i" = "15" ]; then echo "Postgres timeout"; exit 1; fi
  echo "Retry $i/15..."
  sleep 2
done
echo "Testing DB with DATABASE_URL..."
node -e "
const {Client}=require('pg');
const u=process.env.DATABASE_URL;
if(!u){console.error('DATABASE_URL is not set');process.exit(1);}
const host=(u.match(/@([^:\/]+):/)||[])[1]||'?';
console.log('DB host from URL:',host);
const c=new Client({connectionString:u});
c.connect().then(()=>{c.end();console.log('DB connection OK');process.exit(0);}).catch(e=>{console.error('DB connection FAIL:',e.message);process.exit(1);});
" || exit 1
printf 'DATABASE_URL=%s\nREDIS_URL=%s\nJWT_SECRET=%s\nCOOKIE_SECRET=%s\nPORT=%s\nNODE_ENV=%s\nDATABASE_SSL=%s\nSTORE_CORS=%s\nADMIN_CORS=%s\n' \
  "${DATABASE_URL}" "${REDIS_URL}" "${JWT_SECRET}" "${COOKIE_SECRET}" "${PORT:-9000}" "${NODE_ENV:-production}" "${DATABASE_SSL}" "${STORE_CORS:-http://localhost:3000}" "${ADMIN_CORS:-http://localhost:3000,http://localhost:7001}" \
  > .env
echo "Running database migrations..."
pnpm exec medusa db:migrate || true
echo "Starting Medusa..."
exec pnpm exec medusa start --host 0.0.0.0
