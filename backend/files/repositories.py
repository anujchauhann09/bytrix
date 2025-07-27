from files.base import FileRepository
from files.models import File


class DjangoFileRepository(FileRepository):
    def create_file(self, user, **kwargs):
        return File.objects.create(user=user, **kwargs)

    def update_compression_status(self, file_instance, is_compressed, compression_ratio):
        file_instance.is_compressed = is_compressed
        file_instance.compression_ratio = compression_ratio
        file_instance.save()
