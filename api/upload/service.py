import logging
from django.db import transaction, IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from django_outbox_pattern.models import Published
from .models import FileUpload, ScanCheck

logger = logging.getLogger(__name__)


# TODO: look into avoiding over writing files with same name - unique ID and no overwrite, prevent race conditions
def UploadFileToStorage(bucket, full_path, file):
    try:
        bucket.save(full_path, file)
    except Exception as e:
        # TODO: expand error handling with specific types etc
        raise e


@transaction.atomic
def StoreFileReference(data):
    try:
        new_upload = FileUpload(
            file_name=data["file_name"],
            original_file_name=data["original_file_name"],
            s3_path=data["s3_path"],
        )
        new_upload.save()

        # avoid publish decorate to only fire on insert (better control)
        Published.objects.create(
            destination="/queue/pending_uploads",
            body={
                "id": new_upload.id,
                "file_name": new_upload.file_name,
                "original_file_name": new_upload.original_file_name,
                "s3_path": new_upload.s3_path,
                "uploaded_at": str(new_upload.uploaded_at),
                "status": new_upload.status,
                "scanned_at": str(new_upload.scanned_at),
            },
        )

        return new_upload
    except IntegrityError as e:
        if "unique constraint" in str(e).lower():
            raise ValidationError({"detail": "File upload already exists"})
        raise e


@transaction.atomic
def SaveScanFindings(id, status, scanned_at, findings):
    try:
        file_upload = get_object_or_404(FileUpload, id=id, status="PENDING")
        file_upload.status = status
        file_upload.scanned_at = scanned_at
        file_upload.save()

        if len(findings) > 0:
            for finding in findings:
                ScanCheck.objects.create(
                    check_name=finding.get("check_name"),
                    impact_severity=finding.get("impact_severity"),
                    found_in_file=finding.get("found_in_file"),
                    upload=file_upload,
                )
    except Exception as e:
        # TODO: expand error handling with specific types etc
        raise e
