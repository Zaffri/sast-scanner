import logging
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

logger = logging.getLogger(__name__)

class UserView(APIView):
    pass

class HttpOnlyTokenObtain(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            logger.info(response.data)
            access_token = response.data.get('access')       
            refresh_token = response.data.get('refresh')       

            response.data.pop('access', None)
            response.data.pop('refresh', None)

            is_production_env = settings.DEBUG is False

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=is_production_env,
                samesite='Lax',
                path='/'
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=is_production_env,
                samesite='Lax',
                path='/user/token/refresh/' # only auto send cookie to refresh endpoint
            )

        return response

class HttpOnlyTokenRefresh(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            access_token = response.data.get('access')
            response.data.pop('access', None)

            is_production_env = settings.DEBUG is False

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=is_production_env,
                samesite='Lax',
                path='/'
            )

        return response

class HttpOnlyLogout(APIView):
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        # TODO: blacklist refresh token?
    
        response.delete_cookie('access_token', path='/', samesite='Lax')
        response.delete_cookie('refresh_token', path='/', samesite='Lax')
        return response
