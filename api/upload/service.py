from django.db import transaction
from .models import FileUpload

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
