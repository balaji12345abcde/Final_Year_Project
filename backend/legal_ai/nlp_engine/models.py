from django.db import models

class ActSection(models.Model):

    act_name = models.CharField(max_length=200)

    section_number = models.CharField(max_length=50)

    description = models.TextField()

    punishment = models.TextField(blank=True,null=True)

    keywords = models.TextField()

    def __str__(self):
        return f"{self.act_name} Section {self.section_number}"