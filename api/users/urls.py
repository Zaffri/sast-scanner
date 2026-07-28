from django.urls import path
from .views import HttpOnlyTokenObtain, HttpOnlyTokenRefresh, HttpOnlyLogout

urlpatterns = [
    path("token/", HttpOnlyTokenObtain.as_view(), name="token_login"),
    path("token/refresh/", HttpOnlyTokenRefresh.as_view(), name="token_refresh"),
    path("token/logout/", HttpOnlyLogout.as_view(), name="token_logout"),
]
