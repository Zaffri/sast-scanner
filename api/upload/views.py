import logging
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse

from .forms import UploadForm
from .storage import PendingBucketStorage
from .service import UploadFileToStorage, StoreFileReference

UPLOAD_FAILED_MESSAGE = "Upload failed"

logger = logging.getLogger(__name__)

def index(request):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)

        if form.is_valid() == False:
            return render(request, "upload.html", { "form": form })
        
        # TODO: validation on file name - should be uuid (could be idempotency-key)
        file_name = "file_name_01.zip"
        uploaded_zip = request.FILES.get('file_upload')

        try:
            UploadFileToStorage(PendingBucketStorage(), file_name, uploaded_zip)
        except Exception as e:
            logger.error("Storage upload failed: %s", e)
            return HttpResponse(UPLOAD_FAILED_MESSAGE)

        try:
            StoreFileReference(file_name, "original_file_name123", "/" + file_name)
        except Exception as e:
            logger.error("Storage reference update failed: %s", e)
            return HttpResponse("Upload failed")
        
        return HttpResponse("Uploaded...")
    
    form = UploadForm()

    return render(request, "upload.html", { "form": form })

def debug(request):
    storage = PendingBucketStorage()
    s3_client = storage.connection.meta.client

    try:
        buckets_response = s3_client.list_buckets()
        bucket_names = [b['Name'] for b in buckets_response.get('Buckets', [])]

        bucket_contents = {}

        for bucket_name in bucket_names:
            try:
                objects_response = s3_client.list_objects_v2(Bucket=bucket_name)
                object_keys = [obj['Key'] for obj in objects_response.get('Contents', [])]
                bucket_contents[bucket_name] = object_keys
            except Exception as bucket_err:
                bucket_contents[bucket_name] = f"Error fetching objects: {str(bucket_err)}"
        
        return JsonResponse({
            "status": "success",
            "all_buckets": bucket_names,
            "bucket_contents": bucket_contents
        })
        
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=500)
