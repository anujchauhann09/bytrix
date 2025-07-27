from django.contrib import admin
from ai_engine.models import AISummary

@admin.register(AISummary)
class AISummaryAdmin(admin.ModelAdmin):
    list_display = ('id', 'file', 'user', 'model', 'token_usage', 'is_deleted', 'created_at')
    list_filter = ('model', 'is_deleted', 'created_at')
    search_fields = ('file__name', 'user__email', 'summary')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
