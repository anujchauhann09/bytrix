from compression.repositories import DjangoCompressionTaskRepository


class CompressionTaskService:
    def __init__(self, repository: DjangoCompressionTaskRepository):
        self.repository = repository

    def create_compression_task(self, file, url, algorithm, operation, compressed_size):
        return self.repository.create(
            file=file,
            url=url,
            algorithm=algorithm,
            operation=operation,
            compressed_size=compressed_size
        )
