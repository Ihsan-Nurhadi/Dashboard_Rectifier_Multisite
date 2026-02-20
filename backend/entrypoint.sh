#!/bin/bash
set -e

echo "==================================================="
echo " Multisite Rectifier - Backend Entrypoint"
echo "==================================================="

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
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

# Seed sites data (idempotent - skip if already exists)
echo "🌱 Seeding site data..."
python seed_sites.py || echo "⚠️  Seed skipped or already done."

echo "==================================================="
echo " Starting Gunicorn server on port 8000"
echo "==================================================="
exec gunicorn rectifier_monitor.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
