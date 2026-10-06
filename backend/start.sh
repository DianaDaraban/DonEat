#!/usr/bin/env bash
# Render start command:  bash start.sh   (root directory: backend)
# Every boot brings the schema up to date and refreshes the demo data, so the API never
# fails on missing tables and the public feed is never empty (demo expiry dates move forward).
set -euo pipefail

python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py seed_demo

exec gunicorn backend.wsgi:application --bind "0.0.0.0:${PORT:-8000}"
