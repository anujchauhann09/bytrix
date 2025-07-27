from django.contrib import admin
from conversion.models import FileConversion


@admin.register(FileConversion)
class FileConversionAdmin(admin.ModelAdmin):
    list_display = ('id', 'file', 'tool', 'operation', 'url', 'created_at')
    list_filter = ('tool', 'operation', 'created_at')
    search_fields = ('file__name', 'tool')
    raw_id_fields = ('file', )
    readonly_fields = ('created_at', 'updated_at')
