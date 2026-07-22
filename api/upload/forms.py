from django import forms
from django.core.exceptions import ValidationError


def check_file_size(value):
    size_limit = 500 * 1024 * 1024  # 500MB

    if value.size > size_limit:
        raise ValidationError("File cannot be greater than 500MB")


class UploadForm(forms.Form):
    file_upload = forms.FileField(
        label="Select project (.zip)",
        widget=forms.FileInput(attrs={"accept": ".zip"}),
        validators=[check_file_size],
    )
