from rest_framework import serializers
from conversion.models import FileConversion
from files.models import File
from users.models import User


class FileConversionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    file = serializers.PrimaryKeyRelatedField(queryset=File.objects.all(), write_only=True)
    tool = serializers.CharField(max_length=50, write_only=True)

    class Meta:
        model = FileConversion
        fields = [
            'user',
            'file',
            'tool',
            'url',
        ]
        read_only_fields = ['url']
