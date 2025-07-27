from compression.compressors import (
    PdfCompressor,
    JpegCompressor,
    PngCompressor,
    VideoCompressor,
    AudioCompressor
)

EXTENSION_TO_COMPRESSOR = {
    ".pdf": PdfCompressor,

    ".jpg": JpegCompressor,
    ".jpeg": JpegCompressor,
    ".png": PngCompressor,

    ".mp4": VideoCompressor,
    ".mov": VideoCompressor,
    ".avi": VideoCompressor,
    ".mkv": VideoCompressor,
    ".webm": VideoCompressor,

    ".mp3": AudioCompressor,
    ".wav": AudioCompressor,
    ".flac": AudioCompressor,
    ".aac": AudioCompressor,
    ".ogg": AudioCompressor,
}

def get_compressor(file_name: str):
    from pathlib import Path
    ext = Path(file_name).suffix.lower()
    
    compressor_class = EXTENSION_TO_COMPRESSOR.get(ext)
    if not compressor_class:
        raise ValueError(f"No compressor available for {ext}")
    
    return compressor_class()
