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
printf 'DATABASE_URL=%s\nREDIS_URL=%s\nJWT_SECRET=%s\nCOOKIE_SECRET=%s\nPORT=%s\nNODE_ENV=%s\nDATABASE_SSL=%s\nSTORE_CORS=%s\nADMIN_CORS=%s\nALGOLIA_APP_ID=%s\nALGOLIA_ADMIN_API_KEY=%s\nALGOLIA_INDEX_NAME=%s\n' \
  "${DATABASE_URL}" "${REDIS_URL}" "${JWT_SECRET}" "${COOKIE_SECRET}" "${PORT:-9000}" "${NODE_ENV:-production}" "${DATABASE_SSL}" "${STORE_CORS:-http://localhost:3000}" "${ADMIN_CORS:-http://localhost:3000,http://localhost:7001}" "${ALGOLIA_APP_ID:-}" "${ALGOLIA_ADMIN_API_KEY:-}" "${ALGOLIA_INDEX_NAME:-kong_store}" \
  > .env
echo "Running database migrations..."
./node_modules/.bin/medusa db:migrate || true
echo "Creating publishable API key..."
PGPASSWORD=postgres psql -h postgres -U postgres -d medusa -c "
INSERT INTO api_key (id, token, salt, type, title, created_by, created_at, updated_at, revoked_at) 
VALUES ('pk_01', 'pk_test_123', 'salt', 'publishable', 'Development Key', 'system', NOW(), NOW(), NULL) 
ON CONFLICT (id) DO NOTHING;
" 2>/dev/null || echo "API key already exists or table not ready"
echo "Starting Medusa..."
exec ./node_modules/.bin/medusa start --host 0.0.0.0
