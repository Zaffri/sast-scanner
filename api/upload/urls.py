from django.urls import path

from .views import Upload, UploadInternal, DebugView

urlpatterns = [
    path("", Upload.as_view(), name="index"),
    path("debug/", DebugView.as_view(), name="debug_bucket"),
    path("upload/", UploadInternal.as_view(), name="file_upload"),
]
