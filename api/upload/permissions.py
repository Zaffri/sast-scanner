from rest_framework.permissions import BasePermission
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class InternalAPI(BasePermission):
    def has_permission(self, request, view):
        api_token = request.headers.get("X-Internal-Api-Token")

        if not api_token:
            logger.warning("Missing internal API token header")
            return False

        if api_token != settings.INTERNAL_API_TOKEN:
            logger.warning("Provided internal API token but it does not match")
            return False

        return True
