from abc import ABC, abstractmethod
from typing import List


class BaseConverter(ABC):
    @property
    @abstractmethod
    def supported_output_formats(self) -> List[str]:
        pass

    @abstractmethod
    def convert(self, input_path: str, output_format: str, output_dir: str) -> str:
        pass


class ConversionTaskRepository(ABC):
    @abstractmethod
    def create(self, file, url, tool):
        pass