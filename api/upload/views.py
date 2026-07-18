from django.shortcuts import render
from django.http import HttpResponse

from .forms import UploadForm

def index(request):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)

        if form.is_valid():
            # kick off scan...
            return HttpResponse("Uploaded...")
        else:
            return render(request, "upload.html", { "form": form })
    
    form = UploadForm()

    return render(request, "upload.html", { "form": form })
