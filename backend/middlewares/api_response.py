from rest_framework.response import Response
from rest_framework import status


class APIResponse:
    @staticmethod
    def success(message: str, data=None, status=status.HTTP_200_OK):
        return Response({
            "status": True,
            "message": message,
            "data": data 
        }, status=status)

    @staticmethod
    def error(message="", data=None, status=400):
        return Response({
            "status": False,
            "message": message,
            "data": data
        }, status=status)
