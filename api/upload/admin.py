from django.contrib import admin

from .models import FileUpload, ScanCheck

admin.site.register(FileUpload)
admin.site.register(ScanCheck)
