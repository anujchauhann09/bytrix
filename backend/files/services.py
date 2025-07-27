import os
from urllib.parse import urljoin
from middlewares.exceptions import FileSaveError, FileMoveError, FileNotFound

BASE_URL = os.getenv("BASE_URL")


class FileService:
    def __init__(self, storage, repository):
        self.storage = storage
        self.repository = repository

    def save_uploaded_file(self, user, uploaded_file, media_type="uploads"):
        if not uploaded_file:
            raise FileSaveError("No file provided to save.")

        save_path = f"{media_type}/{uploaded_file.name}"
        saved_path = self.storage.save(save_path, uploaded_file)
        full_path = self.storage.get_full_path(saved_path)

        if not self.storage.exists(full_path):
            raise FileSaveError("File was not saved correctly.")

        download_url = urljoin(BASE_URL, f"/v1/media/{media_type}/uploads/{uploaded_file.name}")
        file_instance = self.repository.create_file(
            user=user,
            name=uploaded_file.name,
            url=download_url,
            mime_type=uploaded_file.content_type,
            size_bytes=uploaded_file.size,
            is_compressed=False
        )

        return file_instance, full_path

    def move_file(self, temp_path, subfolder):
        if not self.storage.exists(temp_path):
            raise FileMoveError("Temp file does not exist")

        filename = os.path.basename(temp_path)
        final_path = self.storage.get_full_path(f"{subfolder}/{filename}")
        self.storage.move(temp_path, final_path)
        return filename, final_path

    def get_file_path(self, subfolder, filename):
        full_path = self.storage.get_full_path(f"{subfolder}/{filename}")
        if not self.storage.exists(full_path):
            raise FileNotFound(f"File not found in {subfolder}.")
        return full_path

    def update_file_post_compression(self, file_instance, is_compressed, compression_ratio):
        self.repository.update_compression_status(
            file_instance, is_compressed, compression_ratio
        )
