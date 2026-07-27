import logging
import uuid
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseServerError
from django.utils.dateparse import parse_datetime
from rest_framework.decorators import parser_classes
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .decorators import internal_api

from .storage import PendingBucketStorage
from .service import UploadFileToStorage, StoreFileReference, SaveScanFindings
from .serializers import FileUploadSerializer

UPLOAD_FAILED_MESSAGE = "Upload failed"

logger = logging.getLogger(__name__)


class Upload(APIView):
    @parser_classes([JSONParser, MultiPartParser, FormParser])
    def post(self, request, pk=None):
        uploaded_zip = request.FILES.get("file_upload")

        if not uploaded_zip:
            return Response(
                {"errors": "Missing file upload"}, status=status.HTTP_400_BAD_REQUEST
            )

        file_valid, error_message = check_file_size(uploaded_zip)

        if not file_valid:
            return Response(
                {"errors": error_message}, status=status.HTTP_400_BAD_REQUEST
            )

        original_file_name = uploaded_zip.name
        # TODO: get UUID from client (idempotency key)
        s3_file_name = str(uuid.uuid4()) + ".zip"
        logger.info(f"name: {original_file_name}")
        logger.info(f"name: {s3_file_name}")

        file_upload_serializer = FileUploadSerializer(
            data={
                "file_name": s3_file_name,
                "original_file_name": original_file_name,
                "s3_path": s3_file_name,
            }
        )

        if file_upload_serializer.is_valid():
            try:
                # TODO: validation on file name - should be uuid (could be idempotency-key), add to serialiser
                UploadFileToStorage(PendingBucketStorage(), s3_file_name, uploaded_zip)
            except Exception as e:
                logger.exception("Storage upload failed: %s", e)
                return HttpResponse(UPLOAD_FAILED_MESSAGE)

            new_upload = StoreFileReference(file_upload_serializer.validated_data)
            return Response(
                FileUploadSerializer(new_upload).data, status=status.HTTP_201_CREATED
            )

        return Response(
            file_upload_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


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


class UploadInternal(APIView):
    @parser_classes([JSONParser])
    @internal_api
    def patch(self, request, pk=None):
        request_data = request.data
        scanned_at = parse_datetime(request_data.get("scanned_at"))

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


def check_file_size(value):
    # TODO: add file type check too - before .size check
    size_limit = 500 * 1024 * 1024  # 500MB

    if value.size > size_limit:
        return False, "File cannot be greater than 500MB"

    return True, ""
