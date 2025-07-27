import logging
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from users.serializers import UserSerializer
from middlewares.api_response import APIResponse
from middlewares.exceptions import BadRequest, ServerError
from users.models import User

logger = logging.getLogger('filecompressionsystem')


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            if not user or not user.is_authenticated:
                logger.warning("Unauthenticated access attempt.")
                raise BadRequest("User not authenticated.")

            if user.is_staff and user.is_active:
                users = User.objects.filter(is_active=True)
                serializer = UserSerializer(users, many=True)
                logger.info("Admin fetched user list.")
                return APIResponse.success(message="Users fetched successfully", data=serializer.data)

            serializer = UserSerializer(user)
            logger.info(f"User {user.email} fetched their profile.")
            return APIResponse.success(message="User fetched successfully", data=serializer.data)

        except Exception as e:
            logger.exception("Failed to fetch user(s)")
            raise ServerError("Failed to fetch user(s).")

    def patch(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            logger.info(f"User {user.email} updated their profile.")
            return APIResponse.success(message="User updated successfully", data=serializer.data)
        except Exception as e:
            logger.exception("Failed to update user")
            raise ServerError("Failed to update user.")

    def delete(self, request):
        try:
            user = request.user
            user.is_deleted = True
            user.is_active = False
            user.save(update_fields=["is_deleted", "is_active"])

            user.phones.update(is_deleted=True)
            logger.info(f"User {user.email} marked as deleted.")
            return APIResponse.success(message="User deleted successfully", data=None)
        except Exception as e:
            logger.exception("Failed to delete user")
            raise ServerError("Failed to delete user.")
