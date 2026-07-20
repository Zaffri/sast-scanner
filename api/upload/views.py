from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse

from .forms import UploadForm
from .storage import PendingBucketStorage, ProcessedBucketStorage
from .models import FileUpload

def index(request):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)

        if form.is_valid():
            # TODO: validation on file name - should be uuid (could be idempotency-key)
            file_name = "file_name_01.zip"
            uploaded_zip = request.FILES.get('file_upload')

            # TODO: look into avoiding over writing files with same name - unique ID and no overwrite, prevent race conditions
            pending_bucket = PendingBucketStorage()
            pending_bucket.save(file_name, uploaded_zip)

            # TODO: tidy error handling (specific errors) and atomic transaction for outbox message
            try:
                new_upload = FileUpload(
                    file_name = file_name,
                    original_file_name = "original_file_name123",
                    s3_path = "/" + file_name
                )
                new_upload.save()

                return HttpResponse("Uploaded...")
            except Exception as e:
                print(f"Upload failed: {e}")
                return HttpResponse("Upload failed")
        else:
            return render(request, "upload.html", { "form": form })
    
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
