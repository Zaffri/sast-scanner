from rest_framework import serializers
from .models import FileUpload, ScanCheck


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = "__all__"


class ScanCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanCheck
        fields = "__all__"
