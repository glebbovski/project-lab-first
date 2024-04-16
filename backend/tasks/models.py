from django.db import models


class OperationResult(models.Model):
    key = models.TextField()
    completed_at = models.DateTimeField(auto_now_add=True)
