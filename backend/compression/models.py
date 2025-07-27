from django.db import models
from files.models import File
from core.models import BaseModel
from compression.enums import AlgorithmType, OperationType

class CompressionTask(BaseModel):

    id = models.AutoField(primary_key=True)
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='tasks')
    url = models.URLField()
    algorithm = models.CharField(max_length=40, choices=AlgorithmType.choices)
    operation = models.CharField(max_length=40, choices=OperationType.choices)
    compressed_size = models.BigIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.operation} on {self.file.name}"
