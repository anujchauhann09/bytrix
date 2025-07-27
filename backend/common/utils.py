import bcrypt
import random
from rest_framework_simplejwt.tokens import RefreshToken

from files.services import FileService
from files.storages import FileSystemStorage
from files.repositories import DjangoFileRepository


def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def check_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def calculate_compression_ratio(original_size: int, compressed_size: int) -> float:
        if compressed_size == 0:
            raise ValueError("Compressed size cannot be zero.")

        return round(original_size / compressed_size, 2)


def get_file_service() -> FileService:
    storage = FileSystemStorage()
    repository = DjangoFileRepository()
    return FileService(storage=storage, repository=repository)


def assign_username(email: str) -> str:
    if '@' not in email:
        raise ValueError("Invalid email address")

    base = email.split('@')[0]
    random_number = random.randint(10000, 99999)  
    return f"{base}{random_number}"