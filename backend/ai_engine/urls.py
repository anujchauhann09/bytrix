from django.urls import path
from ai_engine.views import AISummarizeView

urlpatterns = [
    path("ai/summarize/", AISummarizeView.as_view(), name="summarize-file"),
]
