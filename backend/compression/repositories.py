from compression.models import CompressionTask
from compression.base import CompressionTaskRepository


class DjangoCompressionTaskRepository(CompressionTaskRepository):
    def create(self, file, url, algorithm, operation, compressed_size):
        return CompressionTask.objects.create(
            file=file,
            url=url,
            algorithm=algorithm,
            operation=operation,
            compressed_size=compressed_size
        )
