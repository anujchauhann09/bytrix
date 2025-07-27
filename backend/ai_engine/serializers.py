from rest_framework import serializers
from ai_engine.models import AISummary

class AISummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AISummary
        fields = ("token_usage", "summary")
