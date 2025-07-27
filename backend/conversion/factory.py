from typing import Optional
from conversion.base import BaseConverter
from conversion.converters import LibreOfficeConverter
from conversion.converters import Pdf2DocxConverter


class ConverterFactory:
    @staticmethod
    def get_converter(tool: str) -> Optional[BaseConverter]:
        if tool == 'libreoffice':
            return LibreOfficeConverter()
        elif tool == 'pdf2docx':
            return Pdf2DocxConverter()
        return None
