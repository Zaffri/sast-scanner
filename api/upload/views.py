import logging
import json
import uuid
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from .decorators import internal_api

from .forms import UploadForm
from .storage import PendingBucketStorage
from .service import UploadFileToStorage, StoreFileReference, SaveScanFindings

UPLOAD_FAILED_MESSAGE = "Upload failed"

logger = logging.getLogger(__name__)


def index(request):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)

        if not form.is_valid():
            return render(request, "upload.html", {"form": form})

        uploaded_zip = request.FILES.get("file_upload")

        original_file_name = uploaded_zip.name
        # TODO: get UUID from client (idempotency key)
        s3_file_name = str(uuid.uuid4()) + ".zip"

        try:
            # TODO: validation on file name - should be uuid (could be idempotency-key)
            UploadFileToStorage(PendingBucketStorage(), s3_file_name, uploaded_zip)
        except Exception as e:
            logger.exception("Storage upload failed: %s", e)
            return HttpResponse(UPLOAD_FAILED_MESSAGE)

        try:
            StoreFileReference(s3_file_name, original_file_name, s3_file_name)
        except Exception as e:
            logger.exception("Storage reference update failed: %s", e)
            return HttpResponse("Upload failed")

        return HttpResponse("Uploaded...")

    form = UploadForm()

    return render(request, "upload.html", {"form": form})


def debug(request):
    storage = PendingBucketStorage()
    s3_client = storage.connection.meta.client

    try:
        buckets_response = s3_client.list_buckets()
        bucket_names = [b["Name"] for b in buckets_response.get("Buckets", [])]

        bucket_contents = {}

        for bucket_name in bucket_names:
            try:
                objects_response = s3_client.list_objects_v2(Bucket=bucket_name)
                object_keys = [
                    obj["Key"] for obj in objects_response.get("Contents", [])
                ]
                bucket_contents[bucket_name] = object_keys
            except Exception as bucket_err:
                bucket_contents[bucket_name] = (
                    f"Error fetching objects: {str(bucket_err)}"
                )

        return JsonResponse(
            {
                "status": "success",
                "all_buckets": bucket_names,
                "bucket_contents": bucket_contents,
            }
        )

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@csrf_exempt  # INTERNAL API only
@internal_api
def file_upload(request):
    if request.method == "PATCH":
        request_data = json.loads(request.body)
        scanned_at = parse_datetime(request_data.get("scanned_at"))

        # TODO: add data validation
        try:
            SaveScanFindings(
                request_data.get("id"),
                request_data.get("status"),
                scanned_at,
                request_data.get("findings"),
            )
            return JsonResponse({"success": "ok"})
        except Exception as e:
            logger.exception("Failed to update upload and findings: %s", e)
            return HttpResponseServerError("Internal error")

    logger.error("Invalid request")
    return HttpResponseBadRequest("Invalid request")
