from rest_framework import serializers
from .models import FileUpload, ScanCheck


class ScanCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanCheck
        fields = "__all__"

class FileUploadSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")
    checks = ScanCheckSerializer(many=True, read_only=True)

    class Meta:
        model = FileUpload
        fields = [
            "id",
            "file_name",
            "project_name",
            "original_file_name",
            "uploaded_at",
            "status",
            "scanned_at",
            "user",
            "checks",
        ]
