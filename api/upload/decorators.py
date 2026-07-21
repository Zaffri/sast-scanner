import logging
from functools import wraps
from django.http import HttpResponseForbidden
from django.conf import settings

logger = logging.getLogger(__name__)

def internal_api(endpoint_callback):
  @wraps(endpoint_callback)
  def internal_check(request, *args, **kwargs):
    api_token = request.headers.get('X-Internal-Api-Token')

    if not api_token:
      logger.warning("Missing internal API token header")
      return HttpResponseForbidden("Invalid request")
    
    if api_token != settings.INTERNAL_API_TOKEN:
      logger.warning("Provided internal API token but it does not match")
      return HttpResponseForbidden("Invalid request")
    
    return endpoint_callback(request, *args, **kwargs)
  
  return internal_check
