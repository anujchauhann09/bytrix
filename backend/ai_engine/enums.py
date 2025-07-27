from enum import Enum

class GeminiModelVersion(Enum):
    GEMINI_1_5_FLASH = "gemini-1.5-flash"
    GEMINI_1_5_PRO = "gemini-1.5-pro"
    GEMINI_1_0_PRO = "gemini-pro"
    GEMINI_1_0_FLASH = "gemini-pro-vision"  

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
