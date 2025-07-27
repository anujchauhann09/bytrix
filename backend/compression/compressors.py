import subprocess
import os
from compression.base import BaseCompressor
from compression.enums import AlgorithmType

class PdfCompressor(BaseCompressor):
    settings = {
        "screen": "/screen",     
        "ebook": "/ebook",       
        "prepress": "/prepress", 
        "printer": "/printer"    
    }

    @property
    def name(self) -> AlgorithmType:
        return AlgorithmType.GHOSTSCRIPT

    def compress(self, file_path: str) -> str:
        base, ext = os.path.splitext(file_path)
        output_path = f"{base}_compressed{ext}"

        gs_command = [
            "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
            f"-dPDFSETTINGS={self.settings['ebook']}",
            "-dNOPAUSE", "-dQUIET", "-dBATCH",
            f"-sOutputFile={output_path}",
            file_path
        ]
        try:
            subprocess.run(gs_command, check=True)
            return output_path
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"PDF compression failed: {e}")


class JpegCompressor(BaseCompressor):
    @property
    def name(self) -> AlgorithmType:
        return AlgorithmType.MOZJPEG
    
    def compress(self, file_path: str) -> str:
        base, ext = os.path.splitext(file_path)
        output_path = f"{base}_compressed{ext}"

        try:
            subprocess.run([
                "cjpeg", "-quality", "75",
                "-outfile", output_path, file_path
            ], check=True)
            return output_path
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"JPEG compression failed: {e}")


class PngCompressor(BaseCompressor):
    @property
    def name(self) -> AlgorithmType:
        return AlgorithmType.OPTIPNG
    
    def compress(self, file_path: str) -> str:
        try:
            subprocess.run(["optipng", "-o7", file_path], check=True)
            return file_path 
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"PNG compression failed: {e}")


class VideoCompressor(BaseCompressor):
    @property
    def name(self) -> AlgorithmType:
        return AlgorithmType.H264
    
    def compress(self, file_path: str) -> str:
        base, ext = os.path.splitext(file_path)
        output_path = f"{base}_compressed{ext}"
        subprocess.run([
            "ffmpeg",
            "-i", file_path,
            "-vcodec", "libx264",
            "-crf", "28",
            output_path
        ], check=True)
        return output_path


class AudioCompressor(BaseCompressor):
    @property
    def name(self) -> AlgorithmType:
        return AlgorithmType.AAC
    
    def compress(self, file_path: str) -> str:
        base, ext = os.path.splitext(file_path)
        output_path = f"{base}_compressed{ext}"  

        subprocess.run([
            "ffmpeg", "-i", file_path,
            "-b:a", "128k", 
            output_path
        ], check=True)

        return output_path