from django.contrib import admin
from users.models import User, Phone

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('uuid', 'username', 'email', 'type', 'created_at')
    search_fields = ('username', 'email')
    list_filter = ('type', 'is_deleted')
    readonly_fields = ('uuid', 'created_at', 'updated_at')

@admin.register(Phone)
class PhoneAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'whatsapp', 'dnd')
    search_fields = ('phone',)
    list_filter = ('whatsapp', 'dnd')
