#!/bin/sh
set -e 

echo "Running django migrations"
python manage.py migrate --noinput

# Execute the CMD from the Dockerfile or docker-compose
exec "$@"
