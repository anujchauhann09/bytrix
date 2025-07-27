from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate

from users.models import User
from users.serializers import UserSerializer
from common.utils import hash_password, check_password, get_tokens_for_user, assign_username
from middlewares.api_response import APIResponse
from middlewares.exceptions import BadRequest, Unauthorized


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        email = data.get("email")
        password = data.get("password")

        if not email:
            raise BadRequest("Email is required.")

        if User.objects.filter(email=email).exists():
            raise BadRequest("Email already exists.")

        data["username"] = assign_username(email)
        data.pop("password", None)

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        user.set_password(password)
        user.save()

        tokens = get_tokens_for_user(user)

        payload = {
            "username": serializer.data["username"],
            "email": serializer.data["email"],
            "tokens": tokens
        }
        return APIResponse.success(message="User created successfully", data=payload, status=201)


class SigninView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            raise BadRequest("Email and password are required.")

        user = authenticate(email=email, password=password)
        if not user:
            raise Unauthorized("Invalid email or password.")
        
        tokens = get_tokens_for_user(user)

        data = {
            "username": user.username,
            "email": user.email,
            "is_subscribed": user.is_subscribed,
            "tokens": tokens
        }
        return APIResponse.success(message="Login successful", data=data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            raise BadRequest("Refresh token is required.")

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as e:
            return APIResponse.error(message="Token is invalid or already blacklisted.")

        return APIResponse.success(message="Successfully logged out.")