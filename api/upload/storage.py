from django.conf import settings
from storages.backends.s3 import S3Storage

class PendingBucketStorage(S3Storage):
  bucket_name = settings.PENDING_BUCKET

class ProcessedBucketStorage(S3Storage):
  bucket_name = settings.PROCESSED_BUCKET
