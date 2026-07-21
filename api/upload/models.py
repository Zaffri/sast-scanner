from django.db import models
from django_outbox_pattern.decorators import Config
from django_outbox_pattern.decorators import publish

@publish([Config(destination="/queue/pending_uploads")])
class FileUpload(models.Model):
  class UploadStatus(models.TextChoices):
    PENDING = 'PENDING'
    PROCESSING = 'PROCESSING'
    PASSED = 'PASSED'
    FAILED = 'FAILED'
    ERROR = 'ERROR'
  
  file_name = models.CharField(
    max_length = 100,
    unique = True,
    null = False
  )

  original_file_name = models.CharField(max_length = 255)
  
  s3_path = models.CharField(
    max_length = 200,
    unique = True,
    null = False
  )

  uploaded_at = models.DateTimeField(auto_now_add = True)

  status = models.CharField(
    choices = UploadStatus.choices,
    default = UploadStatus.PENDING,
    null = False
  )

  def __str__(self):
    return self.file_name
