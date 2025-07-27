from django.db import models
from users.models import User
from core.models import BaseModel

import uuid

class File(BaseModel):
    id = models.AutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    name = models.CharField(max_length=255)
    url = models.URLField()
    mime_type = models.CharField(max_length=100)
    size_bytes = models.BigIntegerField()
    is_compressed = models.BooleanField(default=False)
    compression_ratio = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name
