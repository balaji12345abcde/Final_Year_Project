from django.db import models
from django.conf import settings

class Document(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    file=models.FileField(upload_to='documents/')
    extracted_text=models.TextField(blank=True)
    uploaded_at=models.DateTimeField(auto_now_add=True)