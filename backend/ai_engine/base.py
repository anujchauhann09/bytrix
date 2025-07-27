from abc import ABC, abstractmethod

class AISummary(ABC):
    @abstractmethod
    def summarize(self, content: str) -> str:
        pass
