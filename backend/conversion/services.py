class ConversionTaskService:
    def __init__(self, repository):
        self.repository = repository

    def create_conversion_task(self, file, url, tool):
        return self.repository.create(
            file=file,
            url=url,
            tool=tool
        )
