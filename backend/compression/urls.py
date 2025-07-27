from django.urls import path
from compression.views import FileCompressView, DownloadCompressedFileView

urlpatterns = [
    path('compress/', FileCompressView.as_view(), name='compress'),
    path('media/compressed/download/<str:filename>/', DownloadCompressedFileView.as_view(), name='download_compressed_file'),
]
