from django.urls import path
from conversion.views import FileConversionView, DownloadConversionFileView

urlpatterns = [
    path('media/conversion/download/<str:filename>/', DownloadConversionFileView.as_view(), name='download_conversion_file'),
    path('conversion/', FileConversionView.as_view(), name='file_conversion'),
]
