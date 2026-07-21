from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import FileUpload, ScanCheck

# TODO: look into avoiding over writing files with same name - unique ID and no overwrite, prevent race conditions
def UploadFileToStorage(bucket, full_path, file):
  try:
    bucket.save(full_path, file)
  except Exception as e:
    # TODO: expand error handling with specific types etc
    raise e

# TODO: tidy error handling (specific errors)
@transaction.atomic # for outbox pattern
def StoreFileReference(file_name, original_file_name, path):
  try:
    new_upload = FileUpload(
      file_name = file_name,
      original_file_name = original_file_name,
      s3_path = path
    )
    new_upload.save()
  except Exception as e:
    # TODO: expand error handling with specific types etc
    raise e

@transaction.atomic
def UpdateFileCheck(id, status, scanned_at, findings):
  try:
    file_upload = get_object_or_404(FileUpload, id = id)
    file_upload.status = status
    file_upload.scanned_at = scanned_at
    file_upload.save()

    if len(findings) > 0:
      for finding in findings:
        ScanCheck.objects.create(
          check_name = finding.get('name'),
          severity = finding.get('severity'),
          upload = file_upload
        )
  except Exception as e:
    # TODO: expand error handling with specific types etc
    raise e
