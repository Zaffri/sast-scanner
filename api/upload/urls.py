from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("debug/", views.debug, name="debug"),
    path("upload/", views.file_upload, name="file_upload")
]