# SAST Scan project

A simple automated security analysis tool. Limited to JavaScript projects (for now).

![Diagram of system design diagram](./docs/diagram.svg)

Notes

```
## Activate virtual env
source .venv/bin/activate

## Run api in dev
python manage.py runserver

## Check migrations
docker compose exec api python manage.py showmigrations

## Create admin user
docker compose exec api python manage.py createsuperuser

## Cool garage commands
docker compose exec object-store /garage bucket list
docker compose exec object-store /garage bucket info pending-bucket
```


