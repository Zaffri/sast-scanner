from django.urls import path

from .views import Upload, UploadView, UploadInternal, DebugView

urlpatterns = [
    path("project/", Upload.as_view(), name="index"),
    path("project/<int:upload_id>/", UploadView.as_view(), name="index"),
    path("debug/", DebugView.as_view(), name="debug_bucket"),
    path("finding/", UploadInternal.as_view(), name="file_upload"),
]
