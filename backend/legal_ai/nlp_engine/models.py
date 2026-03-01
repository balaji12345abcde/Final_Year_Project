from django.db import models

class ActSection(models.Model):
    act_name=models.CharField(max_length=255)
    section_number=models.CharField(max_length=50)
    description=models.TextField()
class AnalysisResult(models.Model):
    document=models.ForeignKey('documents.Document',on_delete=models.CASCADE)
    summary=models.TextField()
    act_section=models.CharField(max_length=255)
    confidence_score=models.FloatField()
    risk_level=models.CharField(max_length=50)
    simplified_text=models.TextField()
    translated_text=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)