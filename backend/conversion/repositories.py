from conversion.models import FileConversion
from conversion.base import ConversionTaskRepository


class DjangoConversionTaskRepository(ConversionTaskRepository):
    def create(self, file, url, tool):
        return FileConversion.objects.create(
            file=file,
            url=url,
            tool=tool
        )
