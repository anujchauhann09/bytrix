import os
import subprocess
from typing import List
from pdf2docx import Converter

from conversion.base import BaseConverter


class LibreOfficeConverter(BaseConverter):

    def __init__(self):
        self._formats = [
            'docx', 'odt', 'rtf', 'txt', 'pdf',
            'html', 'epub', 'xls', 'xlsx', 'csv',
            'ppt', 'pptx'
        ]

    @property
    def supported_output_formats(self) -> List[str]:
        return self._formats

    def convert(self, input_path: str, output_format: str, output_dir: str) -> str:
        if output_format not in self._formats:
            raise ValueError(f"{output_format} is not supported by LibreOffice.")

        output_format_string = f"--convert-to={output_format}"

        try:
            subprocess.run([
                'libreoffice',
                '--headless',
                '--convert-to', output_format,
                '--outdir', output_dir,
                input_path
            ], check=True)
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"LibreOffice failed: {e}")

        base_filename = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{base_filename}.{output_format}")
        
        if not os.path.exists(output_path):
            raise FileNotFoundError(f"Expected output file not found: {output_path}")

        return output_path


class Pdf2DocxConverter(BaseConverter):
    def __init__(self):
        self._formats = ['docx']

    @property
    def supported_output_formats(self) -> List[str]:
        return self._formats

    def convert(self, input_path: str, output_format: str, output_dir: str) -> str:
        if output_format not in self._formats:
            raise ValueError(f"{output_format} is not supported by Pdf2DocxConverter.")

        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")

        os.makedirs(output_dir, exist_ok=True)

        base_filename = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{base_filename}_converted.{output_format}")

        try:
            cv = Converter(input_path)
            cv.convert(output_path, start=0, end=None)
            cv.close()
        except Exception as e:
            raise RuntimeError(f"PDF to DOCX conversion failed: {e}")

        if not os.path.exists(output_path):
            raise FileNotFoundError(f"Expected output file not found: {output_path}")

        return output_path
