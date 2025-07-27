import os
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from urllib.parse import urljoin
from django.utils.text import slugify

from compression.dispatcher import get_compressor
from compression.services import CompressionTaskService
from middlewares.exceptions import BadRequest, NotFound, ServerError, FileNotFound
from middlewares.api_response import APIResponse
from compression.enums import OperationType
from compression.repositories import DjangoCompressionTaskRepository

from common.utils import calculate_compression_ratio, get_file_service

BASE_URL = os.getenv("BASE_URL")


class FileCompressView(APIView): 
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            raise BadRequest("No file uploaded.")
        
        original_filename = uploaded_file.name
        name, ext = os.path.splitext(original_filename)
        safe_name = f"{slugify(name).replace('-', '_')}{ext}"
        uploaded_file.name = safe_name

        file_service = get_file_service()
        file_instance, input_path = file_service.save_uploaded_file(
            request.user,
            uploaded_file,
            media_type="compressed"
        )

        compressor = get_compressor(uploaded_file.name)
        if not compressor:
            raise BadRequest("No suitable compressor found for this file type.")

        compressed_temp_path = compressor.compress(input_path)
        if not file_service.storage.exists(compressed_temp_path):
            raise ServerError("Compression failed. Temporary file not found.")

        compressed_filename, final_path = file_service.move_file(
            compressed_temp_path,
            subfolder="compressed"
        )

        if not file_service.storage.exists(final_path):
            raise ServerError("Failed to move compressed file to final location.")

        original_size = uploaded_file.size
        compressed_size = os.path.getsize(final_path)

        compression_ratio = calculate_compression_ratio(original_size, compressed_size)

        file_service.update_file_post_compression(
            file_instance,
            is_compressed=True,
            compression_ratio=compression_ratio
        )

        download_url = urljoin(BASE_URL, f"/v1/media/compressed/download/{compressed_filename}")

        task_service = CompressionTaskService(repository=DjangoCompressionTaskRepository())
        task_service.create_compression_task(
            file=file_instance,
            url=download_url,
            algorithm=compressor.name,
            operation=OperationType.COMPRESS,
            compressed_size=compressed_size
        )

        return APIResponse.success(
            message="File compressed successfully.",
            data={
                "download_url": download_url,
                "original_filename": original_filename,
                "compressed_filename": compressed_filename,
                "original_size": original_size,
                "compressed_size": compressed_size,
                "compression_ratio": compression_ratio
            }
        )


class DownloadCompressedFileView(APIView):
    def get(self, request, filename):
        file_service = get_file_service()
        try:
            file_path = file_service.get_file_path("compressed", filename)
        except FileNotFound:
            raise NotFound("Compressed file not found.")

        f = open(file_path, 'rb')
        return FileResponse(f, as_attachment=True)
