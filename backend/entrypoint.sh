#!/bin/bash
set -e

echo "==================================================="
echo " Multisite Rectifier - Backend Entrypoint"
echo "==================================================="

if [ -n "$DB_HOST" ]; then
  # Wait for PostgreSQL to be ready
  echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
  while ! nc -z "$DB_HOST" "$DB_PORT"; do
    sleep 1
  done
  echo "✅ PostgreSQL is ready!"

  # Run Django migrations
  echo "🔄 Running database migrations..."
  python manage.py migrate --noinput

  # Collect static files
  echo "📁 Collecting static files..."
  python manage.py collectstatic --noinput

  # Seed sites data (idempotent - safe to run multiple times)
  echo "🌱 Seeding site data..."
  python seed_sites.py
  echo "✅ Seed done. Checking site count..."
  python manage.py shell -c "from monitor.models import Site; print(f'   → {Site.objects.count()} sites in database')"
else
  echo "ℹ️  DB_HOST not set — skipping DB setup (publisher mode)"
fi


echo "==================================================="
echo " Starting: ${@:-gunicorn (default)}"
echo "==================================================="
exec "$@"
