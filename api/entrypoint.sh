#!/bin/sh
set -e 

echo "Running django migrations"
python manage.py migrate --noinput

# Execute the CMD from the Dockerfile or docker-compose
echo "Starting server & outbox relay"
python manage.py publish & python manage.py runserver 0.0.0.0:8000
