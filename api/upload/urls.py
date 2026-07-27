from django.urls import path

from .views import Upload, UploadInternal

urlpatterns = [
    path("", Upload.as_view(), name="index"),
    # path("debug/", views.debug, name="debug"),
    path("upload/", UploadInternal.as_view(), name="file_upload"),
]
