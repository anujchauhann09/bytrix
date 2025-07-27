from abc import ABC, abstractmethod

class FileStorage(ABC):
    @abstractmethod
    def save(self, name: str, content) -> str:
        pass

    @abstractmethod
    def move(self, src: str, dest: str) -> None:
        pass

    @abstractmethod
    def exists(self, path: str) -> bool:
        pass

    @abstractmethod
    def get_full_path(self, relative_path: str) -> str:
        pass


class FileRepository(ABC):
    @abstractmethod
    def create_file(self, user, **kwargs):
        pass

    @abstractmethod
    def update_compression_status(self, file_instance, is_compressed, compression_ratio):
        pass

