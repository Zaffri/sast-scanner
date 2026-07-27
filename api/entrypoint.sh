#!/bin/sh
set -e 

echo "Running django migrations"
python manage.py migrate --noinput

# Execute the CMD from the Dockerfile or docker-compose
echo "Starting server & outbox relay"
python manage.py publish & \
python manage.py seed_dev_data & \
DJANGO_SUPERUSER_USERNAME=admin DJANGO_SUPERUSER_EMAIL=admin@example.com DJANGO_SUPERUSER_PASSWORD=pass \
python manage.py createsuperuser --noinput & python manage.py runserver 0.0.0.0:8000
