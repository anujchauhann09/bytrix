import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError, NotAuthenticated, APIException

from middlewares.exceptions import BaseException  

logger = logging.getLogger('filecompressionsystem')


def build_error_response(message, status_code=status.HTTP_400_BAD_REQUEST):
    return Response({
        "status": False,
        "message": str(message),
        "data": None
    }, status=status_code)


def custom_exception_handler(exc, context):
    view = context.get('view')
    request = context.get('request')

    logger.error(
        f"[Exception] {exc} | "
        f"View: {view.__class__.__name__ if view else 'N/A'} | "
        f"Method: {getattr(request, 'method', 'N/A')} | "
        f"Path: {getattr(request, 'path', 'N/A')}"
    )

    response = exception_handler(exc, context)

    if isinstance(exc, BaseException):
        return Response(exc.detail, status=exc.status_code)

    if response is not None:
        if isinstance(exc, APIException) and isinstance(response.data, dict):
            if all(key in response.data for key in ["status", "message", "data"]):
                return Response(response.data, status=response.status_code)

            detail = response.data.get("detail", "An error occurred")
            return build_error_response(detail, status_code=response.status_code)

    if isinstance(exc, (DjangoValidationError, ValidationError)):
        if hasattr(exc, 'detail') and isinstance(exc.detail, dict):
            return Response({
                "status": False,
                "message": "Validation failed.",
                "data": exc.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        return build_error_response(str(exc), status_code=status.HTTP_400_BAD_REQUEST)

    if isinstance(exc, NotAuthenticated):
        return build_error_response("Authentication credentials were not provided.", status.HTTP_401_UNAUTHORIZED)

    return build_error_response("Internal server error", status.HTTP_500_INTERNAL_SERVER_ERROR)
