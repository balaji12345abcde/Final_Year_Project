from django.conf import settings
from django.db import models
class Document(models.Model):


    file = models.FileField(upload_to="documents/")
    extracted_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)