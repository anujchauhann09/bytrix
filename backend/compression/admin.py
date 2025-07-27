from django.contrib import admin
from compression.models import CompressionTask

@admin.register(CompressionTask)
class CompressionTaskAdmin(admin.ModelAdmin):
    list_display = ('file', 'algorithm', 'operation', 'compressed_size', 'created_at')
    list_filter = ('algorithm', 'operation')
    readonly_fields = ('created_at', 'updated_at')
