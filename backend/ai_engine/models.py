from django.db import models
from files.models import File
from users.models import User
from core.models import BaseModel
from ai_engine.enums import GeminiModelVersion

class AISummary(BaseModel):
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='ai_summaries')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    summary = models.TextField()
    token_usage = models.IntegerField(null=True, blank=True)
    model = models.CharField(max_length=100, default=GeminiModelVersion.GEMINI_1_5_FLASH.value)

    def __str__(self):
        return f"Summary for {self.file.name}"
