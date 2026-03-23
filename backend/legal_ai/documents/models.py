from django.db import models
from django.conf import settings


class Document(models.Model):

    # 🔐 USER RELATION (IMPORTANT FIX)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    # 📄 FILE DATA
    file = models.FileField(upload_to="documents/")
    extracted_text = models.TextField()

    # 🧠 ANALYSIS DATA
    doc_type = models.CharField(max_length=100, blank=True, null=True)
    risk_score = models.FloatField(default=0)
    risk_level = models.CharField(max_length=50, blank=True, null=True)

    # 📅 TIMESTAMP
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file.name} ({self.user})"