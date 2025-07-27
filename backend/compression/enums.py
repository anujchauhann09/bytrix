from django.db import models


class AlgorithmType(models.TextChoices):
    GHOSTSCRIPT = 'GHOSTSCRIPT', 'Ghostscript (PDF compression)'
    MOZJPEG = 'MOZJPEG', 'MozJPEG (JPEG compression)'
    OPTIPNG = 'OPTIPNG', 'OptiPNG (PNG compression)'
    H264 = 'H264', 'H.264 / FFmpeg (Video compression)'
    AAC = 'AAC', 'AAC / FFmpeg (Audio compression)'

class OperationType(models.TextChoices):
    COMPRESS = 'COMPRESS', 'Compress'