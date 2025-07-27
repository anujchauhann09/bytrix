import os
from django.core.files.storage import default_storage
from django.conf import settings

from files.base import FileStorage


class FileSystemStorage(FileStorage):
    def save(self, name: str, content) -> str:
        return default_storage.save(name, content)

    def move(self, src: str, dest: str) -> None:
        os.rename(src, dest)

    def exists(self, path: str) -> bool:
        return os.path.exists(path)

    def get_full_path(self, relative_path: str) -> str:
        return os.path.join(settings.MEDIA_ROOT, relative_path)

