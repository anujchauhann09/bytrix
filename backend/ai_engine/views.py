import os
import fitz
from django.utils.text import slugify
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ai_engine.models import AISummary
from ai_engine.serializers import AISummarySerializer
from ai_engine.services import GeminiModel
from middlewares.api_response import APIResponse
from middlewares.exceptions import BadRequest, ServerError

from files.services import FileService
from files.storages import FileSystemStorage
from files.repositories import DjangoFileRepository

BASE_URL = os.getenv("BASE_URL")


def get_file_service() -> FileService:
    storage = FileSystemStorage()
    repository = DjangoFileRepository()
    return FileService(storage=storage, repository=repository)


class AISummarizeView(APIView):
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
        file_instance, input_path = file_service.save_uploaded_file(request.user, uploaded_file)

        if not os.path.exists(input_path):
            raise ServerError(f"Uploaded file not found at path: {input_path}")

        doc = fitz.open(input_path)
        text = "\n".join([page.get_text() for page in doc])
        doc.close()

        if not text.strip():
            raise BadRequest("Uploaded file does not contain any readable text.")

        model = GeminiModel()
        result = model.summarize(text)

        ai_summary = AISummary.objects.create(
            user=request.user,
            file=file_instance,
            summary=result["summary"],
            # token_usage=result["token_usage"],
            model=model.model_name
        )

        serializer = AISummarySerializer(ai_summary)

        return APIResponse.success(
            message="Summary created successfully.",
            data=serializer.data,
            status=status.HTTP_201_CREATED
        )
