from django.db import models


class FileUpload(models.Model):
    class UploadStatus(models.TextChoices):
        PENDING = "PENDING"
        PROCESSING = "PROCESSING"
        PASSED = "PASSED"
        REJECTED = "REJECTED"
        ERROR = "ERROR"

    file_name = models.CharField(max_length=100, unique=True, null=False)

    original_file_name = models.CharField(max_length=255)

    s3_path = models.CharField(max_length=200, unique=True, null=False)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        choices=UploadStatus.choices, default=UploadStatus.PENDING, null=False
    )

    scanned_at = models.DateTimeField(null=True)

    def __str__(self):
        return self.file_name


class ScanCheck(models.Model):
    check_name = models.CharField(max_length=75, null=False)

    class SeverityLevel(models.TextChoices):
        HIGH = "HIGH"
        MEDIUM = "MEDIUM"
        LOW = "LOW"
        UNKNOWN = "UNKNOWN"

    impact_severity = models.CharField(
        choices=SeverityLevel.choices, default=SeverityLevel.UNKNOWN, null=False
    )

    upload = models.ForeignKey(FileUpload, on_delete=models.CASCADE)

    found_in_file = models.CharField(max_length=120, null=False)

    def __str__(self):
        return f"{self.upload.file_name}-{self.check_name}-{self.impact_severity}"
