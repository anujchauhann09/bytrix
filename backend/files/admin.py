from django.contrib import admin
from files.models import File

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('uuid', 'user', 'name', 'size_bytes', 'is_compressed', 'created_at')
    search_fields = ('name', 'uuid')
    list_filter = ('is_compressed',)
    readonly_fields = ('uuid', 'created_at', 'updated_at')
