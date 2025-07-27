from abc import ABC, abstractmethod
from compression.enums import AlgorithmType


class BaseCompressor(ABC):
    @property
    @abstractmethod
    def name(self) -> AlgorithmType:
        pass

    @abstractmethod
    def compress(self, file_path: str) -> str:
        pass
    

class CompressionTaskRepository(ABC):
    @abstractmethod
    def create(self, file, url, algorithm, operation, compressed_size):
        pass

