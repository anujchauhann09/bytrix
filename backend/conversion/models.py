from django.db import models
from core.models import BaseModel
from users.models import User
from files.models import File
from conversion.enums import ConversionTool, ConversionOperation


class FileConversion(BaseModel):
    id = models.AutoField(primary_key=True)
    file = models.ForeignKey(
        File,
        on_delete=models.CASCADE,
        related_name='conversions'
    )
    tool = models.CharField(
        max_length=40,
        choices=ConversionTool.choices
    )
    operation = models.CharField(
        max_length=30,
        choices=ConversionOperation.choices,
        default=ConversionOperation.CONVERT
    )
    url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.file.name} → {self.tool}"
