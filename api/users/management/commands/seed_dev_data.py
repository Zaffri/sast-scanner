from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    def handle(self, *args, **options):
        email = "user@zaffri.dev"
        username = "user"
        password = "pass"

        User = get_user_model()

        if User.objects.filter(email=email).exists():
            return

        User.objects.create_user(email=email, username=username, password=password)
