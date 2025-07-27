import os
from urllib.parse import urljoin
from django.utils.text import slugify
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from conversion.factory import ConverterFactory
from conversion.services import ConversionTaskService
from conversion.repositories import DjangoConversionTaskRepository
from common.utils import get_file_service

from middlewares.api_response import APIResponse
from middlewares.exceptions import BadRequest, ServerError, NotFound, FileNotFound

BASE_URL = os.getenv("BASE_URL")


class FileConversionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        output_format = request.data.get('output_format')

        if not uploaded_file or not output_format:
            raise BadRequest("Both 'file' and 'output_format' are required.")

        original_filename = uploaded_file.name
        name, ext = os.path.splitext(original_filename)
        safe_name = f"{slugify(name).replace('-', '_')}{ext}"
        uploaded_file.name = safe_name

        file_service = get_file_service()

        file_instance, input_path = file_service.save_uploaded_file(
            request.user, uploaded_file, media_type="converted"
        )

        tool = 'pdf2docx' if ext.lower() == '.pdf' and output_format == 'docx' else 'libreoffice'
        converter = ConverterFactory.get_converter(tool)
        if not converter:
            raise BadRequest("No suitable converter found.")

        try:
            temp_output_path = converter.convert(input_path, output_format, 'media/converted')
        except Exception as e:
            raise ServerError(f"Conversion failed: {str(e)}")

        if not file_service.storage.exists(temp_output_path):
            raise ServerError("Conversion failed. Output file not found.")

        converted_filename, final_path = file_service.move_file(
            temp_output_path,
            subfolder="converted"
        )

        if not file_service.storage.exists(final_path):
            raise ServerError("Failed to move converted file to final location.")

        download_url = urljoin(BASE_URL, f"/v1/media/conversion/download/{converted_filename}")

        task_service = ConversionTaskService(repository=DjangoConversionTaskRepository())
        task_service.create_conversion_task(
            file=file_instance,
            url=download_url,
            tool=tool
        )

        return APIResponse.success(
            message="File converted successfully.",
            data={"download_url": download_url}
        )


class DownloadConversionFileView(APIView):
    def get(self, request, filename):
        file_service = get_file_service()

        try:
            path = file_service.get_file_path("converted", filename)
        except FileNotFound:
            raise NotFound("Converted file not found.")

        return FileResponse(open(path, 'rb'), as_attachment=True)
