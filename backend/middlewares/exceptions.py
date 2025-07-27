from rest_framework.exceptions import APIException
from rest_framework import status


class BaseException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "A server error occurred."
    default_code = "error"

    def __init__(self, detail=None, status_code=None):
        self.detail = {
            "status": False,
            "message": detail or self.default_detail,
            "data": None
        }
        if status_code is not None:
            self.status_code = status_code


class BadRequest(BaseException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Bad request."

    def __init__(self, detail=None):
        super().__init__(detail=detail or self.default_detail, status_code=self.status_code)


class NotFound(BaseException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "Resource not found."

    def __init__(self, detail=None):
        super().__init__(detail=detail or self.default_detail, status_code=self.status_code)


class Unauthorized(BaseException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "Unauthorized access."

    def __init__(self, detail=None):
        super().__init__(detail=detail or self.default_detail, status_code=self.status_code)


class Forbidden(BaseException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "Access forbidden."

    def __init__(self, detail=None):
        super().__init__(detail=detail or self.default_detail, status_code=self.status_code)


class ServerError(BaseException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Internal server error."

    def __init__(self, detail=None):
        super().__init__(detail=detail or self.default_detail, status_code=self.status_code)


class FileSaveError(BaseException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Failed to save uploaded file."

    def __init__(self, detail=None):
        super().__init__(detail=detail or self.default_detail, status_code=self.status_code)


class FileMoveError(BaseException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Failed to move compressed file."

    def __init__(self, detail=None):
        super().__init__(detail=detail or self.default_detail, status_code=self.status_code)


class FileNotFound(BaseException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Requested file was not found."

    def __init__(self, detail=None):
        super().__init__(detail=detail or self.default_detail, status_code=self.status_code)
